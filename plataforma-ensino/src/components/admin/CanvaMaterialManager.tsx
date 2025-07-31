'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'
import type { CanvaMaterial } from '@/types/materials'

interface CanvaMaterialManagerProps {
  materials: any[]
  onUpdate: (materials: any[]) => void
}

export default function CanvaMaterialManager({ materials, onUpdate }: CanvaMaterialManagerProps) {
  const [editingMaterial, setEditingMaterial] = useState<Partial<CanvaMaterial> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const canvaMaterials = materials.filter(m => m.type === 'canva')

  const extractCanvaInfo = (url: string) => {
    // Extract embed URL and author URL from standard Canva share link
    const embedUrl = url.includes('?embed') ? url : `${url.split('?')[0]}?embed`
    const authorUrl = url.includes('utm_content') ? url : `${url}?utm_content=${url.match(/design\/(\w+)/)?.[1]}&utm_campaign=designshare&utm_medium=embeds&utm_source=link`
    
    return { embedUrl, authorUrl }
  }

  const handleSave = () => {
    if (!editingMaterial?.url) return

    const { embedUrl, authorUrl } = extractCanvaInfo(editingMaterial.url)
    
    const newMaterial: CanvaMaterial = {
      id: editingMaterial.id || crypto.randomUUID(),
      type: 'canva',
      title: editingMaterial.title || 'Apresentação Canva',
      description: editingMaterial.description,
      url: embedUrl,
      author: editingMaterial.author,
      authorUrl: editingMaterial.authorUrl || authorUrl,
      embedType: 'iframe',
      order: editingMaterial.order || canvaMaterials.length + 1
    }

    let updatedMaterials
    if (editingMaterial.id) {
      // Update existing
      updatedMaterials = materials.map(m => 
        m.id === editingMaterial.id ? newMaterial : m
      )
    } else {
      // Add new
      updatedMaterials = [...materials, newMaterial]
    }

    onUpdate(updatedMaterials)
    setEditingMaterial(null)
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    const updatedMaterials = materials.filter(m => m.id !== id)
    onUpdate(updatedMaterials)
  }

  const handleEdit = (material: CanvaMaterial) => {
    setEditingMaterial(material)
    setIsDialogOpen(true)
  }

  const handleNew = () => {
    setEditingMaterial({})
    setIsDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Apresentações Canva</CardTitle>
            <CardDescription>
              Gerencie as apresentações Canva incorporadas nesta aula
            </CardDescription>
          </div>
          <Button onClick={handleNew} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Canva
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {canvaMaterials.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma apresentação Canva adicionada ainda
            </p>
          ) : (
            canvaMaterials.map((material) => (
              <div
                key={material.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{material.title}</h4>
                  {material.description && (
                    <p className="text-sm text-muted-foreground">{material.description}</p>
                  )}
                  {material.author && (
                    <p className="text-xs text-muted-foreground mt-1">Por: {material.author}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(material.url.replace('?embed', ''), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(material)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(material.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMaterial?.id ? 'Editar' : 'Adicionar'} Apresentação Canva
              </DialogTitle>
              <DialogDescription>
                Cole o link de compartilhamento da apresentação Canva
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="url">URL do Canva</Label>
                <Input
                  id="url"
                  placeholder="https://www.canva.com/design/..."
                  value={editingMaterial?.url || ''}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Cole o link de compartilhamento da sua apresentação Canva
                </p>
              </div>
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Ex: Apresentação de Introdução"
                  value={editingMaterial?.title || ''}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o conteúdo da apresentação"
                  value={editingMaterial?.description || ''}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="author">Autor (opcional)</Label>
                <Input
                  id="author"
                  placeholder="Nome do criador"
                  value={editingMaterial?.author || ''}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, author: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={!editingMaterial?.url || !editingMaterial?.title}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}