import {request} from "@/utils/service"
import type * as Table from "./types/table"
// @ts-ignore
import { IAdministrator } from "@/views/system/administrator/components/data";

/** 查 */
export function getTableDataApi(params: Table.IGetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "/administrator/list",
    method: "get",
    params
  })
}

export function storeAdministrator(data: IAdministrator) {
  return request({
    url: '/administrator/store',
    method: 'post',
    data
  })
}

export function updateAdministrator(id: number, data: IAdministrator) {
  return request({
    url: `/administrator/${id}/update`,
    method: 'post',
    data
  })
}

export function deleteAdministrator(id: number) {
  return request({
    url: `/administrator/${id}`,
    method: 'delete',
  })
}

export function getAdministrator(id: number) {
  return request<IApiResponseData<IAdministrator>>({
    url: '/administrator/' + id,
    method: 'get',
  })
}

