import {request} from "@/utils/service"
import type * as Table from "./types/table"
// @ts-ignore
import {IArticle, IArticleStatus} from "@/views/article/article/components/data";

/** 查 */
export function getTableDataApi(params: Table.IGetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "/article/list",
    method: "get",
    params
  })
}

export function storeArticle(data: IArticle) {
  return request({
    url: '/article/store',
    method: 'post',
    data
  })
}

export function updateArticle(id: number, data: IArticle) {
  return request({
    url: `/article/${id}/update`,
    method: 'post',
    data
  })
}

export function updateStatus(id: number, data: any) {
  return request<IApiResponseData<null>>({
    url: `/article/${id}/update-status`,
    method: 'post',
    data
  })
}

export function deleteArticle(id: number) {
  return request({
    url: `/article/${id}`,
    method: 'delete',
  })
}

export function getArticle(id: number) {
  return request<IApiResponseData<IArticle>>({
    url: '/article/' + id,
    method: 'get',
  })
}

