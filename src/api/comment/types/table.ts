export interface IComment {
  id: number,
  content: string,
  avatar: string,
  nickname: string,
  email: string,
  created_at: string,
  children: IComment[]
}

export type GetTableResponseData = IApiResponseData<IGetTableResponseData>

export interface IGetTableResponseData {
  title: string
  list: IComment[],
  total: number
}

export interface IReply {
  parent_id: number,
  comment: string
}

export interface IGetTableRequestData {
  id: number,
  type: string,
  page: number
}
