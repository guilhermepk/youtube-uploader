import { forwardRef, Module } from '@nestjs/common';
import { Auth } from 'googleapis';
import { SecureDataManagerModule } from '../../secure-data-manager/secure-data-manager.module';
import { ReadGoogleTokenUseCase } from '@main/secure-data-manager/use-cases/red-google-token.use-case';
import { StartGoogleAuthUseCase } from './use-cases/start-auth/start-google-auth.use-case';
import { YoutubeModule } from './youtube/youtube.module';
import { googleAuthFactory } from './utils/google-auth.factory';
import { GetGoogleUserDataUseCase } from './use-cases/get-user-data/get-google-user-data.use-case';

@Module({
  imports: [
    SecureDataManagerModule,
    forwardRef(() => YoutubeModule)
  ],
  providers: [
    {
      provide: Auth.OAuth2Client,
      useFactory: googleAuthFactory,
      inject: [ReadGoogleTokenUseCase]
    },
    StartGoogleAuthUseCase,
    GetGoogleUserDataUseCase
  ],
  exports: [
    Auth.OAuth2Client
  ]
})
export class GoogleModule { }