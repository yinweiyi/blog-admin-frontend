import {request} from "@/utils/service"
import {getToken} from "@/utils/cache/cookies";
/** 增 */
export function upload(data: FormData) {
  return request<IApiResponseData<any>>({
    url: "/file/upload",
    method: "post",
    headers: {
      // 携带 Token
      Authorization: "Bearer " + getToken(),
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
