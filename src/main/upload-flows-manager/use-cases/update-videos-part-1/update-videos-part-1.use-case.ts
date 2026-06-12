import { GetPlaylistItemsUseCase } from "@main/apis/google/youtube/use-cases/get-playlist-items/get-playlist-items.use-case";
import { UpdateVideoUseCase } from "@main/apis/google/youtube/use-cases/update-video/update-video.use-case";
import { tryCatch } from "@main/common/utils/try-catch";
import { ReadSheetUseCase } from "@main/file-manager/use-cases/read-sheet/read-sheet.use-case";
import { UploadFlow2Dto } from "@main/upload-flows-manager/models/upload-flow-2.dto";
import { Inject, Injectable } from "@nestjs/common";
import { UnprocessableContentError } from "@shared/models/errors/unprocessable-content.error";
import { UploadFlow2Response } from "@shared/models/responses/upload-flows-manager/upload-flow-2.response";
import { youtube_v3 } from "googleapis";
import * as XLSX from 'xlsx';

@Injectable()
export class UpdateVideosPart1UseCase {
  constructor(
    @Inject(ReadSheetUseCase)
    private readonly readSheetUseCase: ReadSheetUseCase,

    @Inject(GetPlaylistItemsUseCase)
    private readonly getPlaylistItemsUseCase: GetPlaylistItemsUseCase,

    @Inject(UpdateVideoUseCase)
    private readonly updateVideoUseCase: UpdateVideoUseCase
  ) { }

  async execute(data: UploadFlow2Dto): Promise<UploadFlow2Response> {
    return await tryCatch(async () => {
      const { sheetData, playlist: playlistData } = data;
      const {
        file,
        personFirstNameColunmIndex,
        personLastNameColunmIndex,
        personSectorColumnIndex,
        descriptionColunmIndex
      } = sheetData;

      const playlistItems = await this.getPlaylistItemsUseCase.execute(playlistData.id, playlistData.itemCount);

      if (playlistItems.length < 1) throw new UnprocessableContentError(`A playlist selecionada está vazia`);

      const workbook = await this.readSheetUseCase.execute(file);
      const firstSheetName = workbook.SheetNames[0];
      const firstSheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as Array<Array<string | undefined>>;

      if (jsonData.length < 2) throw new UnprocessableContentError(`Não há dados na planilha enviada`);

      const response: UploadFlow2Response = { results: [] };

      for (let lineIndex = 1; lineIndex < jsonData.length; lineIndex++) {
        const line = jsonData[lineIndex];
        const personFirstName = line[personFirstNameColunmIndex];
        const personLastName = line[personLastNameColunmIndex];
        const personSector = line[personSectorColumnIndex];
        const description = line[descriptionColunmIndex];

        if (!personFirstName || !personSector || !personLastName) {
          if (!personFirstName && !personSector && !description) {
            const nextLine = jsonData[lineIndex + 1];
            const nextLinePersonFirstName = nextLine[personFirstNameColunmIndex];
            const nextLinePersonLastName = nextLine[personLastNameColunmIndex];
            const nextLinePersonSector = nextLine[personSectorColumnIndex];
            if (!nextLinePersonFirstName && !nextLinePersonLastName && !nextLinePersonSector) break;
          }

          response.results.push({
            lineIndex,
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
        const regex = new RegExp(`^${safeFirstName} ${safeLastName}\\s+${safeSector}$`, 'i');

        const playlistItem: youtube_v3.Schema$PlaylistItem | undefined = playlistItems.find(
          item => regex.test(item.snippet?.title ?? '')
        );
        const videoId: string | undefined | null = playlistItem?.snippet?.resourceId?.videoId;

        const title = `${personFirstName} ${personLastName} - ${personSector}`;
        const upperCaseTitle = title.toUpperCase();

        if (!playlistItem || !videoId) {
          let errorMsg: string = '';

          if (!playlistItem) errorMsg = `Vídeo "${upperCaseTitle.replace('-', '')}" não encontrado na playlist "${playlistData.name}"`;
          else if (!videoId) errorMsg = `Não foi possível obter o ID do vídeo "${upperCaseTitle}"`;

          response.results.push({
            lineIndex,
            success: false,
            error: errorMsg
          });

          continue;
        }

        await this.updateVideoUseCase.execute({ id: videoId, title: upperCaseTitle, description });

        response.results.push({
          lineIndex,
          success: true,
          error: null,
        });
      }

      return response;
    }, `Erro ao processar planilha para o fluxo de upload 2`);
  }
}