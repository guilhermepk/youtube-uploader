import { tryCatch } from "@main/common/utils/try-catch";
import { Injectable } from "@nestjs/common";
import fs from 'fs';

@Injectable()
export class DeleteFileUseCase {
  async execute(filePath: string) {
    return await tryCatch(async () => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }, `Erro ao deletar arquivo`);
  }
}