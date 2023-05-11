import * as Table from "@/api/wechat/types/type";
import {request} from "@/utils/service"

export function getMenu() {
  return request<IApiResponseData<Table.Menu>>({
    url: "/ofa/menu",
    method: "get",
  })
}

export function publishMenu(data: Table.Menu) {
  return request({
    url: "/ofa/publish-menu",
    method: "post",
    data
  })
}
