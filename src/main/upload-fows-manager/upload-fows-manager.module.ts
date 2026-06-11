import { Module } from "@nestjs/common";
import { UploadFlow2UseCase } from "./use-cases/flow-2/upload-flow-2.use-case";
import { FileManagerModule } from "@main/file-manager/file-manager.module";
import { YoutubeModule } from "@main/apis/google/youtube/youtube.module";

@Module({
  imports: [
    FileManagerModule,
    YoutubeModule
  ],
  providers: [
    UploadFlow2UseCase
  ]
})
export class UploadFlowsManagerModule { }