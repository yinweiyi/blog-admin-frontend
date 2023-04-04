//活动详情
export interface IAdministrator {
  id: number| undefined
  name: string
  account: string
  password: string | undefined
  password_confirmation: string | undefined
  status: boolean
}

