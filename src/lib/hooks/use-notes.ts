'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { Note } from '../utils/types';

interface UpdateData {
    title?: string;
    content?: string;
    summary?: string;
  }

export function useNotes() {
  const queryClient = useQueryClient();

  const { data: notes, isLoading, error } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
  });

  const createNote = useMutation({
    mutationFn: async ({ title, content, summary }: { title: string, content: string, summary: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ title, content, summary, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, title, content, summary }: { id: string, title?: string, content?: string, summary?: string }) => {
      const updateData: UpdateData = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (summary !== undefined) updateData.summary = summary;

      const { data, error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', data.id] });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const useNote = (id?: string) => {
    return useQuery({
      queryKey: ['note', id],
      queryFn: async () => {
        if (!id) return null;
        
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data as Note;
      },
      enabled: !!id,
    });
  };

  return {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    useNote,
  };
}