export class UpdateVideosDto {
  sheetData: {
    file: File;
    personFirstNameColunmIndex: number;
    personLastNameColunmIndex: number;
    personSectorColumnIndex: number;
    descriptionColunmIndex: number;
  }
  playlist: {
    id: string;
    name: string;
    itemCount: number;
  };
}