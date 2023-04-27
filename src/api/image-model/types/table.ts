export interface IGetTableData {
  id: number
  size: number,
  order: number
  name: string
  download_url: string
  default_prompt: string
  default_negative_prompt: string
  description: string
}

export type GetTableResponseData = IApiResponseData<IGetTableData[]>
