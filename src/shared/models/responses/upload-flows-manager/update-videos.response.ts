export type UploadFlow2Response = {
  results: Array<{
    rowIndex: number,
    success: boolean,
    error: null | string
  }>
}