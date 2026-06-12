import { Inject, Logger, Module, OnApplicationBootstrap } from "@nestjs/common";
import { UpdateVideosPart1UseCase } from "./use-cases/update-videos-part-1/update-videos-part-1.use-case";
import { FileManagerModule } from "@main/file-manager/file-manager.module";
import { YoutubeModule } from "@main/apis/google/youtube/youtube.module";
import { GetFileUseCase } from "@main/file-manager/use-cases/get-file/get-file.use-case";

@Module({
  imports: [
    FileManagerModule,
    YoutubeModule
  ],
  providers: [
    UpdateVideosPart1UseCase
  ]
})
export class UploadFlowsManagerModule implements OnApplicationBootstrap {
  logger = new Logger(UploadFlowsManagerModule.name);

  constructor(
    @Inject(UpdateVideosPart1UseCase)
    private readonly uploadFlow2UseCase: UpdateVideosPart1UseCase,

    @Inject(GetFileUseCase)
    private readonly getFileUseCase: GetFileUseCase
  ) { }

  async onApplicationBootstrap() {
    console.log('\n');
    try {
      const filePath = `C:\\Users\\Guilherme\\Downloads\\teste.xlsx`;
      const file: File | null = await this.getFileUseCase.execute(filePath);

      if (!file) throw new Error(`Erro ao obter o arquivo "${filePath}". O arquivo realmente existe?`);

      const response = await this.uploadFlow2UseCase.execute({
        sheetData: {
          file,
          personFirstNameColunmIndex: 0,
          personLastNameColunmIndex: 1,
          personSectorColumnIndex: 2,
          descriptionColunmIndex: 3,
        },
        playlist: {
          id: 'PLHvogOXMIOMU58YqADqXMKk-XSnEoIF68',
          name: 'Playlist de teste',
          itemCount: 2
        }
      });

      this.logger.log(response)
    } catch (error: any) {
      this.logger.error(error.message ?? error, error);
    }
    console.log('\n');
  }
}