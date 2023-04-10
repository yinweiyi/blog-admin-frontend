import {ICategory} from "@/views/article/category/components/data";
import {ITag} from "@/views/article/tag/components/data";

export interface IGetTableRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  pageSize: number
}

export interface IGetTableData {
  id: number
  title: string
  slug: string
  author: string
  order: number
  views: number
  category: ICategory
  tags: ITag[]
  is_top: boolean
  is_show: boolean
  updated_at: string
}

export type GetTableResponseData = IApiResponseData<{
  list: IGetTableData[]
  total: number
}>
