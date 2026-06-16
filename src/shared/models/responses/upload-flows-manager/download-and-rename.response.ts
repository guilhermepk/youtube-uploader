export type DownloadAndRenameResponse = {
  results: Array<{
    rowIndex: number,
    fileName?: string,
    success: boolean,
    error: null | string
  }>
}