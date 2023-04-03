import { request } from "@/utils/service"

/** 增 */
export function getDashboard() {
  return request({
    url: "/dashboard",
    method: "get"
  })
}
