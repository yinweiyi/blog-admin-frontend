export interface IGetTableRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  pageSize: number
}

export interface IGetTableData {
  id: number
  activityName: string
  startTime: string
  endTime: string
  statusText: string
  winningCount: number
}

export type GetTableResponseData = IApiResponseData<{
  list: IGetTableData[]
  total: number
}>
