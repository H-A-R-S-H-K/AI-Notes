'use client';

import { formatDate, truncateText } from '@/lib/utils/helpers';
import { Note } from '@/lib/utils/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotes } from '@/lib/hooks/use-notes';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const router = useRouter();
  const { deleteNote } = useNotes();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/notes/${note.id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteNote.mutateAsync(note.id);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(`/notes/${note.id}`)}>
        <CardHeader className="pb-2 flex flex-row justify-between items-start">
          <CardTitle className="text-lg pr-6">{note.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(); }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => { e.stopPropagation(); setIsDeleteDialogOpen(true); }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">
            {truncateText(note.content)}
          </p>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {formatDate(note.updated_at)}
          </div>
          {note.summary && (
            <Badge variant="outline" className="ml-2">
              Summarized
            </Badge>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}