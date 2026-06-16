import { tryCatch } from "@main/common/utils/try-catch";
import { DeleteFileUseCase } from "@main/file-manager/use-cases/delete-file/delete-file.use-case";
import { Inject, Injectable } from "@nestjs/common";
import { app } from "electron";
import path from "path";

@Injectable()
export class DeleteGoogleTokenUseCase {
  constructor(
    @Inject(DeleteFileUseCase)
    private readonly deleteFileUseCase: DeleteFileUseCase
  ) { }

  async execute() {
    return await tryCatch(async () => {
      const fileName: string = 'google-keys.txt';
      const filePath: string = path.join(app.getPath('userData'), fileName);
      await this.deleteFileUseCase.execute(filePath);
    }, `Erro ao excluir token do Google localmente`);
  }
}