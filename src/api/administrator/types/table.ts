export interface IGetTableRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  pageSize: number
}

export interface IGetTableData {
  id: number
  name: string
  account: string
  status: boolean
  last_login_ip: string
  last_login_at: string
  created_at: string
  updated_at: string
}

export type GetTableResponseData = IApiResponseData<{
  list: IGetTableData[]
  total: number
}>
