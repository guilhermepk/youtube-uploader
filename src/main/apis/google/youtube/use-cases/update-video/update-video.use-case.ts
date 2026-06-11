import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { Auth, youtube_v3 } from "googleapis";
import { UpdateVideoDto } from "../../models/dtos/update-video.dto";

@Injectable()
export class UpdateVideoUseCase {
  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,
  ) { }

  async execute(data: UpdateVideoDto): Promise<youtube_v3.Schema$Video> {
    return await tryCatch(async () => {
      const { id, title, description } = data;

      const response = await this.youtubeClient.videos.update({
        auth: this.oAuth2Client,
        part: ['snippet'],
        requestBody: {
          id,
          snippet: {
            title,
            description,
            categoryId: '22'
          }
        }
      });

      return response.data;
    }, `Erro ao editar vídeo`);
  }
}