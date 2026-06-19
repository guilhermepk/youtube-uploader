import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested, IsOptional } from "class-validator";

class SheetInfo {
  @IsNotEmpty()
  @IsString()
  filePath: string;

  @IsNumber()
  firstNameColumnIndex: number;

  @IsOptional()
  @IsNumber()
  lastNameColumnIndex?: number;

  @IsNumber()
  sectorColumnIndex: number;

  @IsArray()
  @IsNumber({}, { each: true })
  descriptionColumnIndexes: Array<number>;
}

class Playlist {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  itemCount: number;
}

export class UpdateVideosDto {
  @Type(() => SheetInfo)
  @ValidateNested()
  sheetInfo: SheetInfo;

  @Type(() => Playlist)
  @ValidateNested()
  playlist: Playlist;
}