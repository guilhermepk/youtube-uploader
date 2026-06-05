import { tryCatch } from "@main/common/utils/try-catch"
import { Injectable } from "@nestjs/common"
import { app } from "electron";
import path from "path";
import fs from 'fs'

@Injectable()
export class ReadFileUseCase {
  async execute(
    fileName: string
  ): Promise<string | null> {
    return await tryCatch(async () => {
      const filePath: string = path.join(app.getPath('userData'), fileName);

      if (!fs.existsSync(filePath)) return null;

      const data = fs.readFileSync(filePath, 'utf-8');
      return data;
    }, `Erro ao ler arquivo`);
  }
}