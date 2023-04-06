import {request} from "@/utils/service"
import type * as Table from "./types/table"
// @ts-ignore
import {ISentence, ISentenceStatus} from "@/views/other/sentence/components/data";

/** 查 */
export function getTableDataApi(params: Table.IGetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "/sentence/list",
    method: "get",
    params
  })
}

export function storeSentence(data: ISentence) {
  return request({
    url: '/sentence/store',
    method: 'post',
    data
  })
}

export function updateSentence(id: number, data: ISentence) {
  return request({
    url: `/sentence/${id}/update`,
    method: 'post',
    data
  })
}

export function deleteSentence(id: number) {
  return request({
    url: `/sentence/${id}`,
    method: 'delete',
  })
}

export function getSentence(id: number) {
  return request<IApiResponseData<ISentence>>({
    url: '/sentence/' + id,
    method: 'get',
  })
}

