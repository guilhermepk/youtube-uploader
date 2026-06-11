import { tryCatch } from "@main/common/utils/try-catch";
import { Injectable } from "@nestjs/common";
import * as XLSX from 'xlsx';

@Injectable()
export class ReadSheetUseCase {
  async execute(sheetFile: File): Promise<XLSX.WorkBook> {
    return await tryCatch(async () => {
      const data = await sheetFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      return workbook;
    }, `Erro ao ler dados da planilha`);
  }
}