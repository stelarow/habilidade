export interface Material {
  id: string
  type: 'pdf' | 'video' | 'canva' | 'link' | 'download' | string
  title: string
  description?: string
  url: string
  author?: string
  authorUrl?: string
  embedType?: 'iframe' | 'link'
  order?: number
}

export interface CanvaMaterial extends Material {
  type: 'canva'
  embedType: 'iframe'
}