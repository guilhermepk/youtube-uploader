export type UpdateVideosResponse = {
  results: Array<{
    rowIndex: number,
    success: boolean,
    error: null | string
  }>
}