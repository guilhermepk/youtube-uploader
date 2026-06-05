import { tryCatch } from "../../common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { SaveGoogleTokenDto } from "../models/dtos/save-google-token.dto";
import { safeStorage } from "electron";
import { SaveFileUseCase } from "../../file-manager/use-cases/save-file.use-case";

@Injectable()
export class SaveGoogleTokenUseCase {
  constructor(
    @Inject(SaveFileUseCase)
    private readonly saveFileUseCase: SaveFileUseCase
  ) { }

  async execute(data: SaveGoogleTokenDto) {
    return await tryCatch(async () => {
      const stringData = JSON.stringify(data);

      const dataToSave: string =
        safeStorage.isEncryptionAvailable()
          ? safeStorage.encryptString(stringData).toString('hex')
          : stringData;

      await this.saveFileUseCase.execute(dataToSave, 'google-keys.txt')
    }, `Erro ao salvar token do Google`)
  }
}