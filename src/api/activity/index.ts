import {request} from "@/utils/service"
import type * as Table from "./types/table"
import {IActivity} from "@/views/activity/activity/components/data";

/** 查 */
export function getTableDataApi(params: Table.IGetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "/activity/list",
    method: "get",
    params
  })
}

export function addActivity(data: IActivity) {
  return request({
    url: '/activity/add',
    method: 'post',
    data
  })
}

export function updateActivity(id: number, data: IActivity) {
  return request({
    url: `/activity/${id}/update`,
    method: 'post',
    data
  })
}

export function getActivity(id: number) {
  return request<IApiResponseData<IActivity>>({
    url: '/activity/' + id,
    method: 'get',
  })
}

export function updatePrizeStock(id: number, data: any) {
  return request({
    url: `/prize/update-stock/${id}`,
    method: 'post',
    data
  })
}

export function refreshCache(id: number) {
  return request({
    url: `/activity/${id}/refresh-cache`,
    method: 'get',
  })
}
