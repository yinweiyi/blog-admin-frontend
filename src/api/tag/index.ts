import {request} from "@/utils/service"
import type * as Table from "./types/table"
// @ts-ignore
import {ITag} from "@/views/article/tag/components/data";

/** 查 */
export function getTableDataApi(params: Table.IGetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "/tag/list",
    method: "get",
    params
  })
}

export function storeTag(data: ITag) {
  return request({
    url: '/tag/store',
    method: 'post',
    data
  })
}

export function updateTag(id: number, data: ITag) {
  return request({
    url: `/tag/${id}/update`,
    method: 'post',
    data
  })
}

export function deleteTag(id: number) {
  return request({
    url: `/tag/${id}`,
    method: 'delete',
  })
}

export function getTag(id: number) {
  return request<IApiResponseData<ITag>>({
    url: '/tag/' + id,
    method: 'get',
  })
}

