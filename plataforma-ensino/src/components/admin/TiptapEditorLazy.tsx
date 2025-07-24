'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  minHeight?: number;
}

// Lazy load TiptapEditor and its heavy dependencies
const TiptapEditor = dynamic(
  async () => {
    // Dynamically import all TipTap dependencies
    const [
      { default: React }, 
      { useEditor, EditorContent },
      { default: StarterKit },
      { default: Underline }
    ] = await Promise.all([
      import('react'),
      import('@tiptap/react'),
      import('@tiptap/starter-kit'),
      import('@tiptap/extension-underline')
    ]);

    const TiptapEditorComponent: React.FC<TiptapEditorProps> = ({
      content = '',
      onChange,
      placeholder = 'Start typing...',
      editable = true,
      className = '',
      minHeight = 200
    }) => {
      const editor = useEditor({
        extensions: [
          StarterKit.configure({
            bulletList: {
              keepMarks: true,
              keepAttributes: false,
            },
            orderedList: {
              keepMarks: true,
              keepAttributes: false,
            },
          }),
          Underline,
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
          onChange?.(editor.getHTML());
        },
      });

      React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
          editor.commands.setContent(content);
        }
      }, [content, editor]);

      if (!editor) {
        return (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-t-lg mb-2"></div>
            <div className="bg-gray-100 rounded-b-lg p-4" style={{ minHeight }}>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className={`prose max-w-none ${className}`}>
          {/* Toolbar */}
          <div className="border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded text-sm ${
                  editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
                }`}
              >
                B
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 rounded text-sm italic ${
                  editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
                }`}
              >
                I
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`px-2 py-1 rounded text-sm underline ${
                  editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
                }`}
              >
                U
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-2 py-1 rounded text-sm ${
                  editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
                }`}
              >
                •
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-2 py-1 rounded text-sm ${
                  editor.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
                }`}
              >
                1.
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <EditorContent
            editor={editor}
            className="border-l border-r border-b border-gray-200 p-4 rounded-b-lg bg-white"
            style={{ minHeight }}
          />
        </div>
      );
    };

    return { default: TiptapEditorComponent };
  },
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-t-lg mb-2"></div>
        <div className="bg-gray-100 rounded-b-lg p-4" style={{ minHeight: 200 }}>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-600 mb-4 mx-auto"></div>
            <p className="text-gray-600 font-medium">Loading rich text editor...</p>
            <p className="text-gray-500 text-sm mt-2">Initializing TipTap...</p>
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
);

export default TiptapEditor;
export type { TiptapEditorProps };