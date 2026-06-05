import { forwardRef, Module } from '@nestjs/common';
import { Auth } from 'googleapis';
import { SecureDataManagerModule } from '../../secure-data-manager/secure-data-manager.module';
import { ReadGoogleTokenUseCase } from '@main/secure-data-manager/use-cases/red-google-token.use-case';
import { StartGoogleAuthUseCase } from './use-cases/start-auth/start-google-auth.use-case';
import { YoutubeModule } from './youtube/youtube.module';
import { googleAuthFactory } from './utils/google-auth.factory';

@Module({
  imports: [
    SecureDataManagerModule,
    forwardRef(() => YoutubeModule)
  ],
  providers: [
    StartGoogleAuthUseCase,
    {
      provide: Auth.OAuth2Client,
      useFactory: googleAuthFactory,
      inject: [ReadGoogleTokenUseCase]
    },
  ],
  exports: [
    Auth.OAuth2Client
  ]
})
export class GoogleModule { }