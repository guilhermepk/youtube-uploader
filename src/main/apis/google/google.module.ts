import { Module } from '@nestjs/common'
import { StartGoogleAuthUseCase } from './use-cases/start-auth/start-google-auth.use-case'
import { Auth } from 'googleapis'
import { SecureDataManagerModule } from '../../secure-data-manager/secure-data-manager.module'

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
export class GoogleModule { }
