import { Module } from "@nestjs/common";
import { SaveFileUseCase } from "./use-cases/save/save-file.use-case";
import { ReadFileUseCase } from "./use-cases/read/read-file.use-case";
import { ReadSheetUseCase } from "./use-cases/read-sheet/read-sheet.use-case";
import { GetFileUseCase } from "./use-cases/get-file/get-file.use-case";

@Module({
  providers: [
    SaveFileUseCase,
    ReadFileUseCase,
    ReadSheetUseCase,
    GetFileUseCase
  ],
  exports: [
    SaveFileUseCase,
    ReadFileUseCase,
    ReadSheetUseCase,
    GetFileUseCase
  ]
})
export class FileManagerModule { }