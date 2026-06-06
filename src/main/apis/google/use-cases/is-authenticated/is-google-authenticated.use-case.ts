import { tryCatch } from "@main/common/utils/try-catch";
import { GoogleKeys } from "@main/secure-data-manager/models/types/google-keys.type";
import { ReadGoogleTokenUseCase } from "@main/secure-data-manager/use-cases/red-google-token.use-case";
import { Inject, Injectable } from "@nestjs/common";
import { IsGoogleAuthenticatedResponse } from "@shared/responses/google/is-google-authenticated.response";
import { Auth } from "googleapis";

@Injectable()
export class IsGoogleAuthenticatedUseCase {
  constructor(
    @Inject(ReadGoogleTokenUseCase)
    private readonly readGoogleTokenUseCase: ReadGoogleTokenUseCase,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,
  ) { }

  async execute(): Promise<IsGoogleAuthenticatedResponse> {
    return await tryCatch(async () => {
      const googleKeys: GoogleKeys | null = await this.readGoogleTokenUseCase.execute();

      if (!googleKeys) return { isAuthenticated: false, email: null };

      const tokenInfo = await this.oAuth2Client.getTokenInfo(googleKeys.accessToken)
        .catch(() => null);

      if (!tokenInfo) {
        return { isAuthenticated: false, email: null }
      } else {
        return { isAuthenticated: true, email: tokenInfo.email ?? null }
      }
    }, `Erro ao verificar autenticação do Google`);
  }
}