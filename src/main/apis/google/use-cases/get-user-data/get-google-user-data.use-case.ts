import { tryCatch } from "@main/common/utils/try-catch";
import { GoogleKeys } from "@main/secure-data-manager/models/types/google-keys.type";
import { ReadGoogleTokenUseCase } from "@main/secure-data-manager/use-cases/read-google-token.use-case";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { GetGoogleUserDataResponse } from "@shared/models/responses/google/get-google-user-data.response";
import { Auth, google } from "googleapis";

@Injectable()
export class GetGoogleUserDataUseCase {
  constructor(
    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(ReadGoogleTokenUseCase)
    private readonly readGoogleTokenUseCase: ReadGoogleTokenUseCase
  ) { }

  async execute(): Promise<GetGoogleUserDataResponse> {
    return await tryCatch(async () => {
      const logger = new Logger(GetGoogleUserDataUseCase.name)

      const googleKeys: GoogleKeys | null = await this.readGoogleTokenUseCase.execute()

      if (!googleKeys) return { email: null, userName: null, pictureUrl: null };

      const oauth2 = google.oauth2({
        auth: this.oAuth2Client,
        version: "v2",
      });

      let userName: string | null = null;
      let pictureUrl: string | null = null;
      let email: string | null = null;

      try {
        const userInfo = await oauth2.userinfo.get();
        userName = userInfo.data.name ?? null;
        pictureUrl = userInfo.data.picture ?? null;
        email = userInfo.data.email ?? null;
      } catch (error) {
        logger.error("Erro ao buscar detalhes do perfil do usuário:", error);
      }

      return { email, userName, pictureUrl }
    }, `Erro ao verificar autenticação do Google`);
  }
}