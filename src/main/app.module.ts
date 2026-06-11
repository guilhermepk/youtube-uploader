import { Module } from '@nestjs/common'
import { GoogleModule } from './apis/google/google.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { SecureDataManagerModule } from './secure-data-manager/secure-data-manager.module';

@Module({
  imports: [
    SecureDataManagerModule,
    GoogleModule,
    FileManagerModule
  ]
})
export class AppModule { }
