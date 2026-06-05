import { Module } from '@nestjs/common'
import { GoogleModule } from './apis/google/google.module';
import { FileManagerModule } from './file-manager/file-manager.module';

@Module({
  imports: [
    GoogleModule,
    FileManagerModule
  ]
})
export class AppModule { }
