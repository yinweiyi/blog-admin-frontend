export interface IArticle {
  title: string
  slug: string
  author: string
  content_type: 1 | 2
  markdown: string
  html: string
  description: string | null
  keywords: string
  order: number
  views: number
  category_id: number
  tags: number[]
  is_top: boolean
  is_show: boolean
}

