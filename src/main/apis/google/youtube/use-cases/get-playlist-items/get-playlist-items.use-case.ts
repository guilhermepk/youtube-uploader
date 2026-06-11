import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { Auth, youtube_v3 } from "googleapis";

@Injectable()
export class GetPlaylistItemsUseCase {
  constructor(
    @Inject(youtube_v3.Youtube)
    private readonly youtubeClient: youtube_v3.Youtube,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,
  ) { }

  async execute(
    playlistId: string,
    playlistItemCount: number
  ): Promise<Array<youtube_v3.Schema$PlaylistItem>> {
    return await tryCatch(async () => {
      const response = await this.youtubeClient.playlistItems.list({
        auth: this.oAuth2Client,
        part: ['snippet'],
        playlistId,
        maxResults: playlistItemCount > 0 ? playlistItemCount : 50,
      });

      return response.data.items ?? [];
    }, `Erro ao buscar itens de playlist`);
  }
}