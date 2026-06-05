import { Inject, Logger, Module, OnApplicationBootstrap } from '@nestjs/common'
import { StartGoogleAuthUseCase } from './use-cases/start-auth/start-google-auth.use-case'
import { Auth } from 'googleapis'
import { SecureDataManagerModule } from '../../secure-data-manager/secure-data-manager.module'
import { tryCatch } from '@main/common/utils/try-catch'
import { ReadGoogleTokenUseCase } from '@main/secure-data-manager/use-cases/red-google-token.use-case'
import { GoogleKeys } from '@main/secure-data-manager/models/types/google-keys.type'

@Module({
  imports: [
    SecureDataManagerModule
  ],
  providers: [
    StartGoogleAuthUseCase,
    {
      provide: Auth.OAuth2Client,
      useFactory: () => {
        return new Auth.OAuth2Client(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          'http://localhost:3000' // Porta local temporária
        )
      }
    }
  ]
})
export class GoogleModule implements OnApplicationBootstrap {
  logger: Logger = new Logger(GoogleModule.name);

  constructor(
    @Inject(ReadGoogleTokenUseCase)
    private readonly readGoogleTokenUseCase: ReadGoogleTokenUseCase,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,
  ) { }

  async onApplicationBootstrap() {
    await tryCatch(async () => {
      const googleKeys: GoogleKeys | null = await this.readGoogleTokenUseCase.execute();

      if (googleKeys) {
        const { accessToken, refreshToken } = googleKeys;

        this.oAuth2Client.setCredentials({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        this.logger.debug('Google previamente autenticado');
      } else {
        this.logger.debug('Google não autenticado');
      }
    }, `Erro ao inicializar credenciais do Google`)
      .catch((error) => {
        this.logger.error(error);
      });
  }
}
