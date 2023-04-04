import {request} from "@/utils/service"
import type * as Table from "./types/table"
// @ts-ignore
import {ICategory, ICategoryParent} from "@/views/article/category/components/data";

/** 查 */
export function getTableDataApi() {
  return request<Table.GetTableResponseData>({
    url: "/category/list",
    method: "get",
  })
}

export function storeCategory(data: ICategory) {
  return request({
    url: '/category/store',
    method: 'post',
    data
  })
}

export function updateCategory(id: number, data: ICategory) {
  return request({
    url: `/category/${id}/update`,
    method: 'post',
    data
  })
}

export function deleteCategory(id: number) {
  return request({
    url: `/category/${id}`,
    method: 'delete',
  })
}

export function getCategory(id: number) {
  return request<IApiResponseData<ICategory>>({
    url: '/category/' + id,
    method: 'get',
  })
}

export function getParents() {
  return request<IApiResponseData<ICategoryParent[]>>({
    url: '/category/parents',
    method: 'get',
  })
}

