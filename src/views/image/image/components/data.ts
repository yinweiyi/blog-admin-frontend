export interface IImage {
  id: number
  image_url: string
  width: number
  height: number
  prompt: string
  negative_prompt: string
  order: number
  image_model_id: number
}
