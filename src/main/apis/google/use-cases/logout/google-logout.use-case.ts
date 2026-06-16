import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Auth } from "googleapis";
import { DeleteGoogleTokenUseCase } from '@main/secure-data-manager/use-cases/delete-google-token/delete-google-token.use-case';

@Injectable()
export class GoogleLogoutUseCase {
  logger = new Logger(GoogleLogoutUseCase.name);

  constructor(
    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(DeleteGoogleTokenUseCase)
    private readonly deleteGoogleTokenUseCase: DeleteGoogleTokenUseCase
  ) { }

  async execute() {
    return await tryCatch(async () => {
      const currentToken = this.oAuth2Client.credentials.access_token;
      if (currentToken) {
        await this.oAuth2Client.revokeToken(currentToken).catch((error) => {
          this.logger.warn(`Não foi possível revogar o token remotamente. Erro: ${error}`);
        });
      }

      this.oAuth2Client.setCredentials({});

      await this.deleteGoogleTokenUseCase.execute();
    }, `Erro ao fazer logout do Google`);
  }
}