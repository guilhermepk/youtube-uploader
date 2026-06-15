export class UpdateVideosDto {
  sheetData: {
    file: File;
    personFirstNameColumnIndex: number;
    personLastNameColumnIndex: number;
    personSectorColumnIndex: number;
    descriptionColumnIndexes: Array<number>;
  }
  playlist: {
    id: string;
    name: string;
    itemCount: number;
  };
}