import { Module } from "@nestjs/common";
import { SaveFileUseCase } from "./use-cases/save-file.use-case";

@Module({
  providers: [
    SaveFileUseCase
  ],
  exports: [
    SaveFileUseCase
  ]
})
export class FileManagerModule { }