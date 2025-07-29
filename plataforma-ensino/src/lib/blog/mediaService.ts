import { createClient } from '@/lib/supabase/client'

export interface MediaFile {
  id: string
  name: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  alt_text?: string
  width?: number
  height?: number
  variants?: {
    thumbnail?: string
    medium?: string
    large?: string
  }
  created_at: string
  updated_at: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export class MediaService {
  private supabase = createClient()
  private bucketName = 'blog-media'

  /**
   * Upload de arquivo para o Supabase Storage
   */
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<MediaFile> {
    try {
      // Gerar nome �nico para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      // Simular progresso de upload (Supabase n�o fornece progresso nativo)
      if (onProgress) {
        const interval = setInterval(() => {
          const loaded = Math.min(file.size, Math.random() * file.size)
          onProgress({
            loaded,
            total: file.size,
            percentage: (loaded / file.size) * 100
          })
        }, 100)

        setTimeout(() => clearInterval(interval), 1000)
      }

      // Upload para o storage
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`)
      }

      // Obter URL p�blica
      const { data: { publicUrl } } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath)

      // Criar variants da imagem se for uma imagem
      let variants: MediaFile['variants'] = {}
      if (file.type.startsWith('image/')) {
        variants = await this.createImageVariants(file, filePath)
      }

      // Salvar metadados no banco
      const mediaData = {
        name: fileName,
        original_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        variants: variants,
        width: file.type.startsWith('image/') ? await this.getImageDimensions(file).then(d => d.width) : null,
        height: file.type.startsWith('image/') ? await this.getImageDimensions(file).then(d => d.height) : null
      }

      const { data: dbData, error: dbError } = await this.supabase
        .from('blog_media')
        .insert(mediaData)
        .select()
        .single()

      if (dbError) {
        // Se falhar ao salvar no banco, limpar o arquivo do storage
        await this.supabase.storage.from(this.bucketName).remove([filePath])
        throw new Error(`Erro ao salvar metadados: ${dbError.message}`)
      }

      return {
        ...dbData,
        file_path: publicUrl // Retornar URL p�blica em vez do path
      }

    } catch (error) {
      console.error('Erro no upload:', error)
      throw error
    }
  }

  /**
   * Criar variants de diferentes tamanhos para imagens
   */
  private async createImageVariants(
    file: File, 
    originalPath: string
  ): Promise<MediaFile['variants']> {
    try {
      const variants: MediaFile['variants'] = {}

      // Configura��es dos variants
      const variantConfigs = [
        { name: 'thumbnail', maxWidth: 150, maxHeight: 150 },
        { name: 'medium', maxWidth: 600, maxHeight: 400 },
        { name: 'large', maxWidth: 1200, maxHeight: 800 }
      ]

      for (const config of variantConfigs) {
        const resizedFile = await this.resizeImage(file, config.maxWidth, config.maxHeight)
        const variantPath = originalPath.replace(/(\.[^.]+)$/, `_${config.name}$1`)
        
        const { error } = await this.supabase.storage
          .from(this.bucketName)
          .upload(variantPath, resizedFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (!error) {
          const storageResponse = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(variantPath)
          
          if (storageResponse?.data?.publicUrl) {
            (variants as any)[config.name] = storageResponse.data.publicUrl
          }
        }
      }

      return variants

    } catch (error) {
      console.error('Erro ao criar variants:', error)
      return {}
    }
  }

  /**
   * Redimensionar imagem mantendo propor��o
   */
  private async resizeImage(
    file: File, 
    maxWidth: number, 
    maxHeight: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calcular novas dimens�es
        let { width, height } = img
        
        const aspectRatio = width / height

        if (width > height) {
          if (width > maxWidth) {
            width = maxWidth
            height = width / aspectRatio
          }
        } else {
          if (height > maxHeight) {
            height = maxHeight
            width = height * aspectRatio
          }
        }

        // Redimensionar
        canvas.width = width
        canvas.height = height
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Erro ao criar blob da imagem'))
            }
          }, file.type, 0.8)
        } else {
          reject(new Error('Contexto do canvas n�o dispon�vel'))
        }
      }

      img.onerror = () => reject(new Error('Erro ao carregar imagem'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Obter dimens�es da imagem
   */
  private async getImageDimensions(file: File): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => reject(new Error('Erro ao carregar imagem'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Listar arquivos de m�dia
   */
  async listFiles(
    page = 1, 
    limit = 20,
    mimeType?: string
  ): Promise<{ files: MediaFile[], total: number }> {
    try {
      let query = this.supabase
        .from('blog_media')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (mimeType) {
        query = query.like('mime_type', `${mimeType}%`)
      }

      const { data, error, count } = await query

      if (error) {
        throw new Error(`Erro ao listar arquivos: ${error.message}`)
      }

      return {
        files: data || [],
        total: count || 0
      }

    } catch (error) {
      console.error('Erro ao listar arquivos:', error)
      throw error
    }
  }

  /**
   * Buscar arquivos por nome
   */
  async searchFiles(query: string): Promise<MediaFile[]> {
    try {
      const { data, error } = await this.supabase
        .from('blog_media')
        .select('*')
        .or(`original_name.ilike.%${query}%,alt_text.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        throw new Error(`Erro na busca: ${error.message}`)
      }

      return data || []

    } catch (error) {
      console.error('Erro na busca:', error)
      throw error
    }
  }

  /**
   * Deletar arquivo
   */
  async deleteFile(id: string): Promise<void> {
    try {
      // Buscar dados do arquivo
      const { data: fileData, error: fetchError } = await this.supabase
        .from('blog_media')
        .select('file_path, variants')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(`Erro ao buscar arquivo: ${fetchError.message}`)
      }

      if (!fileData) {
        throw new Error('Arquivo n�o encontrado')
      }

      // Deletar do storage
      const filesToDelete = [fileData.file_path]
      
      // Adicionar variants � lista de deleta��o
      if (fileData.variants) {
        Object.values(fileData.variants).forEach(variantUrl => {
          if (variantUrl && typeof variantUrl === 'string') {
            // Extrair path da URL
            const path = variantUrl.split('/').slice(-2).join('/')
            filesToDelete.push(path)
          }
        })
      }

      const { error: storageError } = await this.supabase.storage
        .from(this.bucketName)
        .remove(filesToDelete)

      if (storageError) {
        console.warn('Erro ao deletar do storage:', storageError)
      }

      // Deletar do banco
      const { error: dbError } = await this.supabase
        .from('blog_media')
        .delete()
        .eq('id', id)

      if (dbError) {
        throw new Error(`Erro ao deletar do banco: ${dbError.message}`)
      }

    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      throw error
    }
  }

  /**
   * Atualizar alt text
   */
  async updateAltText(id: string, altText: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('blog_media')
        .update({ alt_text: altText })
        .eq('id', id)

      if (error) {
        throw new Error(`Erro ao atualizar alt text: ${error.message}`)
      }

    } catch (error) {
      console.error('Erro ao atualizar alt text:', error)
      throw error
    }
  }

  /**
   * Obter estat�sticas de uso de m�dia
   */
  async getStats(): Promise<{
    totalFiles: number
    totalSize: number
    imageCount: number
    videoCount: number
    documentCount: number
  }> {
    try {
      const { data, error } = await this.supabase
        .from('blog_media')
        .select('mime_type, file_size')

      if (error) {
        throw new Error(`Erro ao obter estat�sticas: ${error.message}`)
      }

      const stats = {
        totalFiles: data?.length || 0,
        totalSize: data?.reduce((sum: number, file: any) => sum + (file.file_size || 0), 0) || 0,
        imageCount: data?.filter((f: any) => f.mime_type?.startsWith('image/')).length || 0,
        videoCount: data?.filter((f: any) => f.mime_type?.startsWith('video/')).length || 0,
        documentCount: data?.filter((f: any) => f.mime_type?.startsWith('application/')).length || 0
      }

      return stats

    } catch (error) {
      console.error('Erro ao obter estat�sticas:', error)
      throw error
    }
  }
}

// Export singleton instance
export const mediaService = new MediaService()