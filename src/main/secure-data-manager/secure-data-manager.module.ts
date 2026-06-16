import { FileManagerModule } from "../file-manager/file-manager.module";
import { Module } from "@nestjs/common";
import { ReadGoogleTokenUseCase } from "./use-cases/read-google-token/read-google-token.use-case";
import { SaveGoogleTokenUseCase } from "./use-cases/save-google-token/save-google-token.use-case";
import { DeleteGoogleTokenUseCase } from "./use-cases/delete-google-token/delete-google-token.use-case";

@Module({
  imports: [
    FileManagerModule
  ],
  providers: [
    SaveGoogleTokenUseCase,
    ReadGoogleTokenUseCase,
    DeleteGoogleTokenUseCase
  ],
  exports: [
    SaveGoogleTokenUseCase,
    ReadGoogleTokenUseCase,
    DeleteGoogleTokenUseCase
  ]
})
export class SecureDataManagerModule { }