import {request} from "@/utils/service"
import type * as Table from "./types/table"
// @ts-ignore
import {IImage} from "@/views/image/image/components/data";

/** 查 */
export function getTableDataApi(params: Table.IGetTableParam) {
  return request<Table.GetTableResponseData>({
    url: "/image/list",
    method: "get",
    params
  })
}

export function storeImage(data: IImage) {
  return request({
    url: '/image/store',
    method: 'post',
    data
  })
}

export function updateImage(id: number, data: IImage) {
  return request({
    url: `/image/${id}/update`,
    method: 'post',
    data
  })
}

export function deleteImage(id: number) {
  return request({
    url: `/image/${id}`,
    method: 'delete',
  })
}

export function getImage(id: number) {
  return request<IApiResponseData<IImage>>({
    url: '/image/' + id,
    method: 'get',
  })
}

