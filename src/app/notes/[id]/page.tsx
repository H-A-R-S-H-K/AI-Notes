import { NoteEditor } from '@/components/notes/note-editor';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

interface NotePageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Edit Note | AI Notes',
  description: 'Edit your note with AI-powered features',
};

export default async function NotePage({ params }: NotePageProps) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="container py-8">
      <NoteEditor noteId={params.id} />
    </div>
  );
}