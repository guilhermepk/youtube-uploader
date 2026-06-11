import { tryCatch } from "@main/common/utils/try-catch";
import { Injectable } from "@nestjs/common";
import path from "path";
import fs from 'fs';

@Injectable()
export class GetFileUseCase {
  async execute(
    fileName: string
  ): Promise<File | null> {
    return await tryCatch(async () => {
      // const filePath: string = path.join(app.getPath('userData'), fileName);
      const filePath: string = path.join('', fileName);

      if (!fs.existsSync(filePath)) return null;

      const fileBuffer = fs.readFileSync(filePath);

      const file = new File([fileBuffer], fileName, {
        type: 'application/octet-stream'
      });

      return file;
    }, `Erro ao carregar o arquivo`);
  }
}