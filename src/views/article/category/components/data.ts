//活动详情
export interface ICategory {
  id: number
  parent_id: number
  order: number
  name: string
  slug: string
  description: string
}

export interface ICategoryParent {
  id: number
  name: string
}

export interface ICategorySelect {
  label: string
  value: number
}

