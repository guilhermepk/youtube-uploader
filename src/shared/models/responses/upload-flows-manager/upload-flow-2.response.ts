export type UploadFlow2Response = {
  results: Array<{
    lineIndex: number,
    success: boolean,
    error: null | string
  }>
}