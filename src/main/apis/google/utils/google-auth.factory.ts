import { ReadGoogleTokenUseCase } from "@main/secure-data-manager/use-cases/red-google-token.use-case";
import { Logger } from "@nestjs/common";
import { Auth } from "googleapis";

export async function googleAuthFactory(readGoogleTokenUseCase: ReadGoogleTokenUseCase) {
  const logger = new Logger('GoogleAuthFactory');
  const client = new Auth.OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000' // Porta local temporária
  );

  try {
    const googleKeys = await readGoogleTokenUseCase.execute();

    if (googleKeys) {
      client.setCredentials({
        access_token: googleKeys.accessToken,
        refresh_token: googleKeys.refreshToken
      });
      logger.debug('Google previamente autenticado');
    } else {
      logger.debug('Google não autenticado');
    }
  } catch (error) {
    logger.error('Erro ao inicializar credenciais do Google', error);
  }

  return client;
}