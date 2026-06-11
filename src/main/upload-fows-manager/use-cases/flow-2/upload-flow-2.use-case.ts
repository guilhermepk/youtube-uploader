import { GetPlaylistItemsUseCase } from "@main/apis/google/youtube/use-cases/get-playlist-items/get-playlist-items.use-case";
import { UpdateVideoUseCase } from "@main/apis/google/youtube/use-cases/update-video/update-video.use-case";
import { tryCatch } from "@main/common/utils/try-catch";
import { ReadSheetUseCase } from "@main/file-manager/use-cases/read-sheet/read-sheet.use-case";
import { UploadFlow2Dto } from "@main/upload-fows-manager/models/upload-flow-2.dto";
import { Inject, Injectable } from "@nestjs/common";
import { UnprocessableContentError } from "@shared/models/errors/unprocessable-content.error";
import { UploadFlow2Response } from "@shared/models/responses/upload-flows-manager/upload-flow-2.response";
import { youtube_v3 } from "googleapis";
import * as XLSX from 'xlsx';

@Injectable()
export class UploadFlow2UseCase {
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
      const { file, titleColunmIndex, descriptionColunmIndex } = sheetData;

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
        const title = line[titleColunmIndex];
        const description = line[descriptionColunmIndex];

        if (!title) {
          if (!description) {
            const nextLine = jsonData[lineIndex + 1];

            const nextLineTitle = nextLine[titleColunmIndex];
            const nextLineDescription = nextLine[descriptionColunmIndex];

            if (!nextLineTitle && !nextLineDescription) break;
          }

          response.results.push({
            lineIndex,
            success: false,
            error: `Dados ausentes para o campo de título`
          });

          continue;
        }

        const upperCaseTitle = title.toUpperCase();

        const playlistItem: youtube_v3.Schema$PlaylistItem | undefined = playlistItems.find(
          item => (item.snippet?.title ?? '').toUpperCase() === upperCaseTitle
        );
        const videoId: string | undefined | null = playlistItem?.snippet?.resourceId?.videoId;

        if (!playlistItem || !videoId) {
          let errorMsg: string = '';

          if (!playlistItem) errorMsg = `Vídeo "${upperCaseTitle}" não encontrado na playlist "${playlistData.name}"`;
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