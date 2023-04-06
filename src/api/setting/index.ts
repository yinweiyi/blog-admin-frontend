import {request} from "@/utils/service"

export function updateSetting(key: string, data: any) {
  return request({
    url: `/setting/${key}/update`,
    method: 'post',
    data
  })
}

export function getSetting(key: string) {
  return request<IApiResponseData<any>>({
    url: '/setting/' + key,
    method: 'get',
  })
}

