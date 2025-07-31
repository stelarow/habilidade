// Example usage of CanvaMaterialManager in a lesson editing form

import React, { useState } from 'react'
import CanvaMaterialManager from './CanvaMaterialManager'

export default function LessonEditExample() {
  // This would normally come from your lesson data
  const [lessonMaterials, setLessonMaterials] = useState([
    {
      id: "c83578a8-c50f-4875-a8e5-a1e6a99f7eb0",
      type: "canva",
      title: "Apresentação Básica Minimalista Preto e Branco",
      description: "Material introdutório visual da aula",
      url: "https://www.canva.com/design/DAGuqW8uqiw/_HxYFw6YjdkL93523L-55w/view?embed",
      author: "Maria Eduarda Weingartner",
      authorUrl: "https://www.canva.com/design/DAGuqW8uqiw/_HxYFw6YjdkL93523L-55w/view?utm_content=DAGuqW8uqiw&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
      embedType: "iframe",
      order: 1
    }
  ])

  const handleMaterialsUpdate = async (newMaterials: any[]) => {
    // Update local state
    setLessonMaterials(newMaterials)
    
    // In a real implementation, you would save this to the database
    // Example:
    // await updateLesson(lessonId, { materials: newMaterials })
    console.log('Updated materials:', newMaterials)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Aula</h1>
      
      {/* Other lesson form fields would go here */}
      
      {/* Canva Material Manager */}
      <CanvaMaterialManager
        materials={lessonMaterials}
        onUpdate={handleMaterialsUpdate}
      />
      
      {/* Save button and other form controls */}
    </div>
  )
}