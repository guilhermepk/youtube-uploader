import { FileManagerModule } from "../file-manager/file-manager.module";
import { Module } from "@nestjs/common";
import { SaveGoogleTokenUseCase } from "./use-cases/save-google-token.use-case";
import { ReadGoogleTokenUseCase } from "./use-cases/red-google-token.use-case";

@Module({
  imports: [
    FileManagerModule
  ],
  providers: [
    SaveGoogleTokenUseCase,
    ReadGoogleTokenUseCase
  ],
  exports: [
    SaveGoogleTokenUseCase,
    ReadGoogleTokenUseCase
  ]
})
export class SecureDataManagerModule { }