export class UpdateVideosDto {
  sheetInfo: {
    file: File;
    firstNameColumnIndex: number;
    lastNameColumnIndex: number;
    sectorColumnIndex: number;
    descriptionColumnIndexes: Array<number>;
  }
  playlist: {
    id: string;
    name: string;
    itemCount: number;
  };
}