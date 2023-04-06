//活动详情
export interface IFriendship {
  id: number
  title: string
  link: string
  status: boolean
  order: number
  description: string | null
}

export interface IFriendshipStatus {
  status: boolean
}
