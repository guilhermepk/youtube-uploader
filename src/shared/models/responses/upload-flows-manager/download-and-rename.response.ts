export type DownloadAndRenameResponse = {
  results: Array<{
    rowIndex: number,
    success: boolean,
    error: null | string
  }>
}