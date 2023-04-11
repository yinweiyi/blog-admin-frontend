import * as Table from "@/api/comment/types/table";
import {request} from "@/utils/service";

/** 查 */
export function getTableDataApi(params: Table.IGetTableRequestData) {
  return request<Table.GetTableResponseData>({
    url: "/comment/list",
    method: "get",
    params
  })
}


export function reply(data: Table.IReply) {
  return request({
    url: "/comment/reply",
    method: "post",
    data
  })
}
