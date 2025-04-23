'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from '@/lib/hooks/use-notes';
import { Note } from '@/lib/utils/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummarizeButton } from './summarize-button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ChevronLeft, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface NoteEditorProps {
  noteId: string;
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const { useNote, createNote, updateNote } = useNotes();
  const { data: existingNote, isLoading: isNoteLoading } = useNote(noteId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setSummary(existingNote.summary || '');
    }
  }, [existingNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (noteId === 'new' || !existingNote) {
        await createNote.mutateAsync({ title, content, summary });
        toast('Success!', {
          description: 'Your note has been created.',
        });
      } else {
        await updateNote.mutateAsync({ id: noteId, title, content, summary });
        toast('Success!', {
          description: 'Your note has been updated.',
        });
      }
      router.push('/dashboard');
    } catch (error) {
      toast('Error', {
        description: 'Failed to save note. Please try again.',
        // variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSummarizeSuccess = (summary: string) => {
    setSummary(summary);
    if (noteId && noteId !== 'new') {
      updateNote.mutate({ id: noteId, summary });
    }
  };

  if (isNoteLoading && noteId && noteId !== 'new') {
    return <div className="flex justify-center py-12">Loading note...</div>;
  }

  return (
    <div className="space-y-6 w-screen p-5">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !title || !content}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Note
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            required
          />
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview" disabled={!content}>Preview</TabsTrigger>
            {summary && <TabsTrigger value="summary">Summary
            </TabsTrigger>}
          </TabsList>
          
          <TabsContent value="editor" className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note content here..."
              required
              className="min-h-64 font-mono"
            />
          </TabsContent>
          
          <TabsContent value="preview">
            <Card className="p-6 prose dark:prose-invert max-w-none min-h-64">
              <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
            </Card>
          </TabsContent>
          
          {summary && (
            <TabsContent value="summary">
              <Card className="p-6 prose dark:prose-invert max-w-none min-h-64">
                <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br>') }} />
              </Card>
            </TabsContent>
          )}
        </Tabs>
        
        {content && content.length > 0 && !summary && (
          <div className="pt-4">
            <SummarizeButton 
              content={content} 
              onSummarizeSuccess={onSummarizeSuccess} 
            />
          </div>
        )}
      </form>
    </div>
  );
}