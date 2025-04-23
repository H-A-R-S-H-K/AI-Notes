import { NoteList } from '@/components/notes/note-list';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | AI Notes',
  description: 'View and manage your notes',
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="container py-8">
      <NoteList />
    </div>
  );
}