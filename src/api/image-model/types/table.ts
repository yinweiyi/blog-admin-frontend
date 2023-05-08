export interface IGetTableData {
  id: number
  order: number
  name: string
  description: string
}

export type GetTableResponseData = IApiResponseData<IGetTableData[]>
