import {request} from "@/utils/service"
import type * as Table from "./types/table"
// @ts-ignore
import {IFriendship, IFriendshipStatus} from "@/views/other/friendship/components/data";

/** 查 */
export function getTableDataApi(params: Table.IGetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "/friendship/list",
    method: "get",
    params
  })
}

export function storeFriendship(data: IFriendship) {
  return request({
    url: '/friendship/store',
    method: 'post',
    data
  })
}

export function updateFriendship(id: number, data: IFriendship) {
  return request({
    url: `/friendship/${id}/update`,
    method: 'post',
    data
  })
}

export function updateStatus(id: number, data: IFriendshipStatus) {
  return request<IApiResponseData<null>>({
    url: `/friendship/${id}/update-status`,
    method: 'post',
    data
  })
}

export function deleteFriendship(id: number) {
  return request({
    url: `/friendship/${id}`,
    method: 'delete',
  })
}

export function getFriendship(id: number) {
  return request<IApiResponseData<IFriendship>>({
    url: '/friendship/' + id,
    method: 'get',
  })
}

