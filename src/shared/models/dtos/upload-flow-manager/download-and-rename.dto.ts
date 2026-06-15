import { Type } from "class-transformer";
import { ValidateNested, IsNumber, IsString, IsNotEmpty } from "class-validator";

export class SheetDataInDownloadAndRenameDto {
  @IsNotEmpty()
  @IsString({ message: 'sheetPath deve ser uma string' })
  sheetPath: string;

  @IsNumber({}, { message: 'urlColumnIndex deve ser um número' })
  urlColumnIndex: number;

  @IsNumber({}, { message: 'firstNameColumnIndex deve ser um número' })
  firstNameColumnIndex: number;

  @IsNumber({}, { message: 'lastNameColumnIndex deve ser um número' })
  lastNameColumnIndex: number;

  @IsNumber({}, { message: 'sectorColumnIndex deve ser um número' })
  sectorColumnIndex: number;
}

export class DownloadAndRenameDto {
  @Type(() => SheetDataInDownloadAndRenameDto)
  @ValidateNested()
  sheet: SheetDataInDownloadAndRenameDto;

  @IsString({ message: 'destinationFolderPath deve ser uma string' })
  destinationFolderPath: string;
}