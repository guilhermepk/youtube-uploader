export class UploadFlow2Dto {
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