import {request} from "@/utils/service"
import type * as Table from "./types/table"
// @ts-ignore
import {IImageModel} from "@/views/image/image-model/components/data";

/** 查 */
export function getTableDataApi() {
  return request<Table.GetTableResponseData>({
    url: "/image-model/list",
    method: "get",
  })
}

export function storeImageModel(data: IImageModel) {
  return request({
    url: '/image-model/store',
    method: 'post',
    data
  })
}

export function updateImageModel(id: number, data: IImageModel) {
  return request({
    url: `/image-model/${id}/update`,
    method: 'post',
    data
  })
}

export function deleteImageModel(id: number) {
  return request({
    url: `/image-model/${id}`,
    method: 'delete',
  })
}

export function getImageModel(id: number) {
  return request<IApiResponseData<IImageModel>>({
    url: '/image-model/' + id,
    method: 'get',
  })
}

