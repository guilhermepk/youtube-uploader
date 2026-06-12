import { tryCatch } from "@main/common/utils/try-catch";
import { ReadSheetUseCase } from "@main/file-manager/use-cases/read-sheet/read-sheet.use-case";
import { DownloadAndRenameDto, SheetDataInDownloadAndRenameDto } from "@main/upload-flows-manager/models/dtos/download-and-rename.dto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { DownloadAndRenameResponse } from "@shared/models/responses/upload-flows-manager/download-and-rename.response";
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { InternalError } from "@shared/models/errors/internal.error";

type RowRelevantData = {
  url: string | undefined;
  personFirstName: string | undefined;
  personLastName: string | undefined;
  personSector: string | undefined;
}

@Injectable()
export class DownloadAndRenameUseCase {
  logger = new Logger(DownloadAndRenameUseCase.name);

  constructor(
    @Inject(ReadSheetUseCase)
    private readonly readSheetUseCase: ReadSheetUseCase,
  ) { }

  async execute(data: DownloadAndRenameDto): Promise<DownloadAndRenameResponse> {
    return await tryCatch(async () => {
      const { sheet, destinationFolderPath } = data;

      if (!fs.existsSync(destinationFolderPath)) {
        fs.mkdirSync(destinationFolderPath, { recursive: true });
        this.logger.log(`Pasta criada em ${destinationFolderPath}`);
      }

      const sheetRows: Array<RowRelevantData> = await this.getSheetRows(sheet);

      const response: DownloadAndRenameResponse = { results: [] };

      for (let rowIndex = 1; rowIndex < sheetRows.length; rowIndex++) {
        const row = sheetRows[rowIndex];
        const { url, personFirstName, personLastName, personSector } = row;

        let errorMsgs: string[] = [];
        if (!url || !personFirstName || !personLastName || !personSector) {
          if (!url) errorMsgs.push(`URL para o download ausente`);
          if (!personFirstName) errorMsgs.push(`Primeiro nome ausente`);
          if (!personLastName) errorMsgs.push(`Sobrenome ausente`);
          if (!personSector) errorMsgs.push(`Setor ausente`);

          response.results.push({
            rowIndex,
            success: false,
            error: errorMsgs.join('; ')
          });

          continue;
        }

        const fileName: string = `${personFirstName} ${personLastName} - ${personSector}`.toUpperCase();
        const filePath: string = this.handleFilePath(url, fileName, destinationFolderPath);

        const downloadResult = await this.downloadVideo(url, filePath);

        response.results.push({
          rowIndex: rowIndex,
          success: downloadResult.success,
          error: downloadResult.error,
        });
      }

      this.logger.log('Processamento de vídeos concluído');
      return response;
    }, `Erro ao baixar vídeos e renomeá-los`);
  }

  private async getSheetRows(sheetData: SheetDataInDownloadAndRenameDto): Promise<Array<RowRelevantData>> {
    try {

      const { file, personFirstNameColumnIndex, personLastNameColumnIndex, personSectorColumnIndex, urlColumnIndex } = sheetData;

      const workbook: XLSX.WorkBook = await this.readSheetUseCase.execute(file);
      const firstSheetName: string = workbook.SheetNames[0];
      const firstSheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as Array<Array<string | undefined>>;

      const rows: Array<RowRelevantData> = [];

      for (let rowIndex = 0; rowIndex < jsonData.length; rowIndex++) {
        const row = jsonData[rowIndex];
        const url = row[urlColumnIndex];
        const personFirstName = row[personFirstNameColumnIndex];
        const personLastName = row[personLastNameColumnIndex];
        const personSector = row[personSectorColumnIndex];

        if (!url && !personFirstName && !personLastName && !personSector) {
          if (rowIndex + 1 < jsonData.length) {
            const nextRow = jsonData[rowIndex + 1];
            const nextRowUrl = nextRow[urlColumnIndex];
            const nextRowPersonFirstName = nextRow[personFirstNameColumnIndex];
            const nextRowPersonLastName = nextRow[personLastNameColumnIndex];
            const nextRowPersonSector = nextRow[personSectorColumnIndex];

            if (
              !nextRowUrl && !nextRowPersonFirstName
              && !nextRowPersonLastName && !nextRowPersonSector
            ) break;
          }
        }

        rows.push({ url, personFirstName, personLastName, personSector });
      }

      return rows;
    } catch (error) {
      throw new InternalError(`Erro ao processar planilha`, [`${error}`]);
    }
  }

  private handleFilePath(url: string, fileName: string, destinationFolderPath: string): string {
    const extension = path.extname(new URL(url).pathname) || '.mp4';
    const finalFileName = `${fileName}${extension}`;
    const finalDestination = path.join(destinationFolderPath, finalFileName);
    return finalDestination;
  }

  private async downloadVideo(url: string, destinationPath: string): Promise<{ success: boolean, error: string | null }> {
    try {
      this.logger.debug(`Iniciando o download em "${path.basename(destinationPath)}"`);
      this.logger.debug(`${url} -> "${destinationPath}"`);

      const writer = fs.createWriteStream(destinationPath);

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      });

      let downloadedBytes: number = 0;
      this.handleProgress(response, (newValue) => { downloadedBytes = newValue });

      response.data.pipe(writer);

      return new Promise((resolve, _reject) => {
        writer.on('finish', () => {
          this.logger.log(`Progresso: 100% (${this.bytesToMegaBytes(downloadedBytes).toFixed(2)} Mb). Download concluído para "${path.basename(destinationPath)}"`);
          resolve({ success: true, error: null });
        });

        writer.on('error', (error) => {
          this.logger.error(`Erro ao salvar no disco: "${destinationPath}"`, error);
          resolve({ success: false, error: `Erro ao salvar no disco: "${destinationPath}"; ${error}` });
        });
      });
    } catch (error) {
      this.logger.error(`Erro ao fazer requisição para ${url}`, error);
      return { success: false, error: `Erro ao fazer requisição para ${url}; ${error}` };
    }
  }

  private handleProgress(response: axios.AxiosResponse, updateDownloadedBytes: (newValue: number) => void): void {
    const contentLengthHeader = response.headers['content-length'];
    const totalLength: number | undefined = contentLengthHeader ? parseInt(contentLengthHeader as string, 10) : undefined;
    let downloadedBytes: number = 0;

    if (!totalLength) this.logger.debug(`Não foi possível obter o tamanho total do arquivo. O progresso será informado sem a porcentagem`);

    let canLog: boolean = true;
    response.data.on('data', (chunk: Buffer) => {
      downloadedBytes += chunk.length;
      updateDownloadedBytes(downloadedBytes);
      const downloadedMegaBytes: number = this.bytesToMegaBytes(downloadedBytes);

      if (canLog && downloadedBytes > 10 * 1024) {
        canLog = false;
        setTimeout(() => { canLog = true }, 1 * 1000);
        const formattedDownloadedMegaBytes: string = downloadedMegaBytes.toFixed(2);

        if (totalLength) {
          const percentage = Math.round((downloadedBytes * 100) / totalLength);
          const totalMegaBytes: string = this.bytesToMegaBytes(totalLength).toFixed(2)

          this.logger.debug(`Progresso: ${percentage}% (${formattedDownloadedMegaBytes} de ${totalMegaBytes}) Mb`);
        } else {
          this.logger.debug(`Progresso: ${formattedDownloadedMegaBytes} Mb`);
        }
      }
    });
  }

  private bytesToMegaBytes(byteAmount: number): number {
    const megaByteAmount: number = Math.max((byteAmount / 1024 / 1024), 0);
    return megaByteAmount;
  }
}