export interface IGetTableData {
  id: number
  image_url: string
  width: number
  height: number
  prompt: string
  negative_prompt: string
  order: number
  image_model_id: number
}

export interface IGetTableParam {
  model_id: number | undefined
  /** 当前页码 */
  page: number
  /** 查询条数 */
  pageSize: number
}


export type GetTableResponseData = IApiResponseData<{
  list: IGetTableData[]
  total: number
}>
