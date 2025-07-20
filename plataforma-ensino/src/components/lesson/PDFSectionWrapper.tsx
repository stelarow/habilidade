'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

// Temporarily disabled PDFSection due to build issues
// const PDFSection = dynamic(() => import('./PDFSection'), { 
//   ssr: false,
//   loading: () => (
//     <Card className="h-[600px] flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//         <p className="text-muted-foreground">Loading PDF viewer...</p>
//       </div>
//     </Card>
//   )
// })

interface PDFSectionWrapperProps {
  title?: string
  pdfUrl?: string
  lessonId?: string
  onProgressUpdate?: (progress: number) => void
  initialProgress?: number
}

const PDFSectionWrapper: React.FC<PDFSectionWrapperProps> = (props) => {
  // Temporary placeholder while PDFSection is being fixed
  return (
    <Card className="h-[600px] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">PDF viewer temporarily unavailable</p>
        <p className="text-sm text-muted-foreground mt-2">Component being fixed - will be restored soon</p>
      </div>
    </Card>
  )
}

export default PDFSectionWrapper