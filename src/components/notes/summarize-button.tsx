'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { fetchWithTimeout } from '@/lib/utils/helpers';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
1
interface SummarizeButtonProps {
  content: string;
  onSummarizeSuccess: (summary: string) => void;
}

export function SummarizeButton({ content, onSummarizeSuccess }: SummarizeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!content || content.trim().length == 0) {
      toast('Not enough content', {
        description: 'Please add more content to your note to generate a summary.'
      })
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetchWithTimeout('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
        timeout: 15000,
      });

      if (!response.ok) {
        throw new Error('Failed to summarize content');
      }

      const data = await response.json();
      onSummarizeSuccess(data.summary);
      console.log(data.summary);
      
      toast('Summary Generated', {
        description: 'Your note has been summarized successfully.',
      });
    } catch (error) {
      console.error('Summarization failed:', error);
      toast('Summarization failed', {
        description: 'Unable to generate summary. Please try again later.',
        // variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSummarize}
      disabled={isLoading || content.trim().length == 0}
      variant="secondary"
      className="flex items-center gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {isLoading ? 'Generating Summary...' : 'Summarize with AI'}
    </Button>
  );
}