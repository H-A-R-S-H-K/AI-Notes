import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import { NoteEditor } from '@/components/notes/note-editor';

export const metadata: Metadata = {
  title: 'New Note | AI Notes',
  description: 'Create a new note with AI-powered features',
};

export default async function NewNotePage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="container py-8">
      <NoteEditor noteId="new" />
    </div>
  );
}