export class UpdateVideosDto {
  sheetData: {
    file: File;
    personFirstNameColunmIndex: number;
    personLastNameColunmIndex: number;
    personSectorColumnIndex: number;
    descriptionColumnIndexes: Array<number>;
  }
  playlist: {
    id: string;
    name: string;
    itemCount: number;
  };
}