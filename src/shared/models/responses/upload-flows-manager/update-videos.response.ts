export type ResultInUpdateVideosResponse = {
  rowIndex: number,
  success: boolean,
  error: null | string,
  uploadData?: {
    url: string,
    title: string,
    thumbnailUrl: string
  }
}

export type UpdateVideosResponse = {
  results: Array<ResultInUpdateVideosResponse>;
}