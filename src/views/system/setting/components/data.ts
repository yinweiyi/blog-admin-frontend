export interface ISite {
  title: string
  sub_title: string
  keywords: string | null
  icp: string | null
  beian: string | null
  author: string | null
  description: string | null
}

export interface IGuestbook {
  content: string
  can_comment: boolean
}
