export interface Menu {
  button: Array<any>
}

export interface Parent {
  name: string
  sub_button: Array<any>
}

export interface Click {
  type: string,
  name: string,
  key: string
}

export interface View {
  type: string,
  name: string,
  url: string
}

export interface Miniprogram {
  type: string,
  name: string,
  url: string,
  appid: string,
  pagepath: string
}

export interface Midia {
  type: string,
  name: string,
  media_id: string
}
