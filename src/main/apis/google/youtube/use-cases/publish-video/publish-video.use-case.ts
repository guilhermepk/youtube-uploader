import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { Auth, youtube_v3 } from "googleapis";
import fs from 'fs';

@Injectable()
export class PublishVideoUseCase {
  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,
  ) { }

  async execute(videoFilePath: string): Promise<void> {
    return await tryCatch(async () => {
      const fileStats = await fs.promises.stat(videoFilePath);
      const totalFileSize = fileStats.size;

      const response = await this.youtubeClient.videos.insert({
        auth: this.oAuth2Client,
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: 'Teste pelo app',
            description: 'Este vídeo foi postado pelo aplicativo',
            categoryId: '22'
          },
          status: {
            privacyStatus: 'unlisted',
            selfDeclaredMadeForKids: false
          }
        },
        media: {
          body: fs.createReadStream(videoFilePath)
        }
      },
        {
          onUploadProgress: (evt) => {
            const progress: number = Math.round((evt.bytesRead / totalFileSize) * 100);
            console.log(`Progresso do upload: ${progress}% (${evt.bytesRead} de ${totalFileSize} bytes)`);
          }
        }
      );

      console.log('Upload concluído! ID do vídeo:', response.data.id);
    }, `Erro ao publicar vídeo no YouTube`);
  }
}