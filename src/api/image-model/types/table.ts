export interface IGetTableData {
  id: number
  size: number,
  order: number
  name: string
  download_url: string
  description: string
}

export type GetTableResponseData = IApiResponseData<IGetTableData[]>
