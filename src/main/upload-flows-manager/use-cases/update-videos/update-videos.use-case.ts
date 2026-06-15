import { GetPlaylistItemsUseCase } from "@main/apis/google/youtube/use-cases/get-playlist-items/get-playlist-items.use-case";
import { UpdateVideoUseCase } from "@main/apis/google/youtube/use-cases/update-video/update-video.use-case";
import { tryCatch } from "@main/common/utils/try-catch";
import { ReadSheetUseCase } from "@main/file-manager/use-cases/read-sheet/read-sheet.use-case";
import { UpdateVideosDto } from "@main/upload-flows-manager/models/dtos/update-videos.dto";
import { Inject, Injectable } from "@nestjs/common";
import { UnprocessableContentError } from "@shared/models/errors/unprocessable-content.error";
import { UploadFlow2Response } from "@shared/models/responses/upload-flows-manager/update-videos.response";
import { youtube_v3 } from "googleapis";
import * as XLSX from 'xlsx';

@Injectable()
export class UpdateVideosUseCase {
  constructor(
    @Inject(ReadSheetUseCase)
    private readonly readSheetUseCase: ReadSheetUseCase,

    @Inject(GetPlaylistItemsUseCase)
    private readonly getPlaylistItemsUseCase: GetPlaylistItemsUseCase,

    @Inject(UpdateVideoUseCase)
    private readonly updateVideoUseCase: UpdateVideoUseCase
  ) { }

  async execute(data: UpdateVideosDto): Promise<UploadFlow2Response> {
    return await tryCatch(async () => {
      const { sheetData, playlist: playlistData } = data;
      const {
        file,
        personFirstNameColumnIndex,
        personLastNameColumnIndex,
        personSectorColumnIndex,
        descriptionColumnIndexes
      } = sheetData;

      const playlistItems = await this.getPlaylistItemsUseCase.execute(playlistData.id, playlistData.itemCount);

      if (playlistItems.length < 1) throw new UnprocessableContentError(`A playlist selecionada está vazia`);

      const workbook = await this.readSheetUseCase.execute(file);
      const firstSheetName = workbook.SheetNames[0];
      const firstSheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as Array<Array<string | undefined>>;

      if (jsonData.length < 2) throw new UnprocessableContentError(`Não há dados na planilha enviada`);

      const response: UploadFlow2Response = { results: [] };

      for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
        const row = jsonData[rowIndex];
        const personFirstName = row[personFirstNameColumnIndex];
        const personLastName = row[personLastNameColumnIndex];
        const personSector = row[personSectorColumnIndex];
        const descriptionValues = descriptionColumnIndexes.map(descIndex => ({ header: jsonData[0][descIndex], value: row[descIndex] }));

        if (!personFirstName || !personSector || !personLastName) {
          if (!personFirstName && !personLastName && !personSector) {
            const nextRow = jsonData[rowIndex + 1];
            const nextRowPersonFirstName = nextRow[personFirstNameColumnIndex];
            const nextRowPersonLastName = nextRow[personLastNameColumnIndex];
            const nextRowPersonSector = nextRow[personSectorColumnIndex];
            if (!nextRowPersonFirstName && !nextRowPersonLastName && !nextRowPersonSector) break;
          }

          response.results.push({
            rowIndex,
            success: false,
            error: `Dados ausentes para o campo de título`
          });

          continue;
        }

        // É uma boa prática escapar caracteres especiais das strings caso o nome ou setor contenham algo como ".", "*", ou "()", que quebram a expressão regular.
        const escapeRegExp = (text: string): string => {
          return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        };

        const safeFirstName = escapeRegExp(personFirstName);
        const safeLastName = escapeRegExp(personLastName);
        const safeSector = escapeRegExp(personSector);

        // Monta o Regex: Começa com o nome (^), seguido por 1 ou mais espaços (\s+), 
        // e termina com o setor ($). A flag 'i' ignora o case.
        const regex = new RegExp(`^${safeFirstName} ${safeLastName}(?:\\s*-\\s*|\\s+)${safeSector}$`, 'i');

        const playlistItem: youtube_v3.Schema$PlaylistItem | undefined = playlistItems.find(
          item => regex.test(item.snippet?.title ?? '')
        );
        const videoId: string | undefined | null = playlistItem?.snippet?.resourceId?.videoId;

        const title = `${personFirstName} ${personLastName} - ${personSector}`;
        const upperCaseTitle = title.toUpperCase();

        const description: string = descriptionValues.length > 0 ? descriptionValues.map(value => `${value.header}\n\n${value.value}`).join('\n\n\n') : '';

        if (!playlistItem || !videoId) {
          let errorMsg: string = '';

          if (!playlistItem) errorMsg = `Vídeo "${upperCaseTitle.replace('-', '')}" não encontrado na playlist "${playlistData.name}"`;
          else if (!videoId) errorMsg = `Não foi possível obter o ID do vídeo "${upperCaseTitle}"`;

          response.results.push({
            rowIndex: rowIndex,
            success: false,
            error: errorMsg
          });

          continue;
        }

        await this.updateVideoUseCase.execute({ id: videoId, title: upperCaseTitle, description });

        response.results.push({
          rowIndex: rowIndex,
          success: true,
          error: null,
        });
      }

      return response;
    }, `Erro ao processar planilha para o fluxo de upload 2`);
  }
}