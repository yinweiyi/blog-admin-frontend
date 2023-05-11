export interface IMenu {
  button: Array<any>
}

export interface IMaterial {
  media_id: string
  name: string
  update_time: string
  url: string
}

export interface IGetMaterialParam {
  type: string
  /** 当前页码 */
  page: number
  /** 查询条数 */
  pageSize: number
}

export type GetTableResponseData = IApiResponseData<{
  list: IMaterial[]
  total: number
}>
