export interface IGetTableData {
  id: number
  parent_id: number
  name: string
  slug: string
  order: number
  description: string
  created_at: string
  updated_at: string
  children: IGetTableData[]
}

export type GetTableResponseData = IApiResponseData<IGetTableData[]>
