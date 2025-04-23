'use client';

import { useNotes } from '@/lib/hooks/use-notes';
import { NoteCard } from './note-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export function NoteList() {
  const { notes, isLoading } = useNotes();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Notes</h2>
        <Button onClick={() => router.push('/notes/new')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {notes && notes.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="font-medium text-lg">No notes yet</h3>
          <p className="text-muted-foreground mt-2">
            Create your first note to get started.
          </p>
          <Button 
            onClick={() => router.push('/notes/new')} 
            className="mt-4"
          >
            Create Note
          </Button>
        </div>
      )}
    </div>
  );
}