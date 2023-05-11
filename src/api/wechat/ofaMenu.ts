import * as Table from "@/api/wechat/types/type";
import {request} from "@/utils/service"

export function getMenu() {
  return request<IApiResponseData<Table.IMenu>>({
    url: "/ofa/menu",
    method: "get",
  })
}

export function publishMenu(data: Table.IMenu) {
  return request({
    url: "/ofa/publish-menu",
    method: "post",
    data
  })
}
