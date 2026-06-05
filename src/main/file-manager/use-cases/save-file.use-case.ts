import { tryCatch } from "../../common/utils/try-catch";
import { Injectable } from "@nestjs/common";
import { app } from "electron";
import path from "path";
import fs from 'fs';

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