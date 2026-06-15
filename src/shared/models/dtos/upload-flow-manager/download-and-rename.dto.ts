export class SheetDataInDownloadAndRenameDto {
  file: File;
  urlColumnIndex: number;
  personFirstNameColumnIndex: number;
  personLastNameColumnIndex: number;
  personSectorColumnIndex: number;
}

export class DownloadAndRenameDto {
  sheet: SheetDataInDownloadAndRenameDto;
  destinationFolderPath: string;
}