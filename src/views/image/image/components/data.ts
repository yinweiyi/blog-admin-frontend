export interface IImage {
  id: number
  image_url: string
  width: number
  height: number
  prompt: string
  negative_prompt: string
  cfg_scale: number
  steps: number
  sampler: string
  seed: number
  clip_skip: number
  order: number
  image_model_id: number
}
