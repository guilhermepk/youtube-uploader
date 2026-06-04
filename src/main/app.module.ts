import { Module } from '@nestjs/common'
import { GoogleModule } from './apis/google/google.module';

@Module({
  imports: [
    GoogleModule
  ]
})
export class AppModule { }
