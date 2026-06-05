import { Injectable } from "@nestjs/common";
import { app } from "electron";
import path from "path";
import fs from 'fs';
import { tryCatch } from "@main/common/utils/try-catch";

@Injectable()
export class SaveFileUseCase {
  async execute(
    stringData: string,
    fileName: string
  ): Promise<void> {
    return await tryCatch(async () => {
      const file_path: string = path.join(app.getPath('userData'), fileName);

      fs.writeFileSync(file_path, stringData);
    }, `Erro ao salvar arquivo`);
  }
}