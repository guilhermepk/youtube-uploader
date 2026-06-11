import { forwardRef, Module } from "@nestjs/common";
import { Auth, google, youtube_v3 } from "googleapis";
import { PublishVideoUseCase } from "./use-cases/publish-video/publish-video.use-case";
import { GoogleModule } from "../google.module";
import { GetPlaylistsUseCase } from "./use-cases/get-playlists/get-playlists.use-case";

@Module({
  imports: [
    forwardRef(() => GoogleModule)
  ],
  providers: [
    {
      provide: youtube_v3.Youtube,
      useFactory: (oAuth2Client: Auth.OAuth2Client) => google.youtube({ version: 'v3', auth: oAuth2Client }),
      inject: [Auth.OAuth2Client]
    },
    PublishVideoUseCase,
    GetPlaylistsUseCase
  ]
})
export class YoutubeModule { }