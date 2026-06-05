import { FileManagerModule } from "../file-manager/file-manager.module";
import { Module } from "@nestjs/common";
import { SaveGoogleTokenUseCase } from "./use-cases/save-google-token.use-case";

@Module({
  imports: [
    FileManagerModule
  ],
  providers: [
    SaveGoogleTokenUseCase
  ],
  exports: [
    SaveGoogleTokenUseCase
  ]
})
export class SecureDataManagerModule { }