'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder = 'Write your description...', minHeight = '300px' }: RichTextEditorProps) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3], // Only H2 and H3 for section headings
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[' + minHeight + '] p-4',
            },
        },
    });

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ onClick, isActive, children, title }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <Button
            type="button"
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={onClick}
            title={title}
            className="h-8 w-8 p-0"
        >
            {children}
        </Button>
    );

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            {/* Instructions */}
            <div className="bg-muted/50 px-3 py-2 text-xs text-muted-foreground border-b border-border">
                <strong>Tip:</strong> Press <kbd className="px-1 py-0.5 bg-background rounded border">Enter</kbd> to create new paragraphs.
                Headings apply to entire lines. Use <strong>Bold</strong> to emphasize specific words.
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/30">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold - works on selected text (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic - works on selected text (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-8 bg-border mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Section Heading (H2) - applies to current line only"
                >
                    <Type className="w-5 h-5" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Subsection Heading (H3) - applies to current line only"
                >
                    <Type className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-8 bg-border mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <div className="bg-background" style={{ minHeight }}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};
