export interface IGetTableRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  pageSize: number
}

export interface IGetTableData {
  id: number
  title: string
  link: string
  status: boolean
  order: number
  description: string | null
  created_at: string
  updated_at: string
}

export type GetTableResponseData = IApiResponseData<{
  list: IGetTableData[]
  total: number
}>
