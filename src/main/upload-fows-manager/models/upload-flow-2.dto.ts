export class UploadFlow2Dto {
  sheetData: {
    file: File;
    titleColunmIndex: number;
    descriptionColunmIndex: number;
  }
  playlist: {
    id: string;
    name: string;
    itemCount: number;
  };
}