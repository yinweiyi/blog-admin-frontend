
import {request} from "@/utils/service"
import {GetTableResponseData, IGetMaterialParam} from "@/api/wechat/types/type";
import {IMaterialForm} from "@/views/wechat/material/components/data";
import {getToken} from "@/utils/cache/cookies";

export function getMaterial(params: IGetMaterialParam) {
  return request<GetTableResponseData>({
    url: "/ofa/material",
    method: "get",
    params
  })
}

export function addMaterial(data: IMaterialForm) {
  return request<GetTableResponseData>({
    url: "/ofa/add-material",
    method: "post",
    headers: {
      // 携带 Token
      Authorization: "Bearer " + getToken(),
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function deleteMaterial(mediaId: string) {
  return request({
    url: `/ofa/material/${mediaId}`,
    method: "delete",
  })
}

// export function publishMenu(data: Table.IMaterial) {
//   return request({
//     url: "/ofa/publish-menu",
//     method: "post",
//     data
//   })
// }
