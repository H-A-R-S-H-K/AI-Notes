import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { content } = await request.json();

    if (!content || typeof content !== 'string' || content.length == 100) {
      return NextResponse.json(
        { error: 'Content must be a string with at least 100 characters' },
        { status: 400 }
      );
    }   

    // Call the AI API for summarization (using DeepSeek API as an example)
    // Replace API_KEY with actual environment variable in production
    const apiKey = process.env.DEEPSEEK_API_KEY || '';
    
    const summaryResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that summarizes text. Create a concise summary that captures the main points.',
          },
          {
            role: 'user',
            content: `Summarize the following text in a concise way, maintaining the key points:\n\n${content}`,
          },
        ],
        max_tokens: 500,
      }),
    });


    if (!summaryResponse.ok) {
      // Fallback to basic summarization if API fails
      console.error('AI API failed, using fallback summarization');
      
      // Simple fallback summarization logic
      const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
      const topSentences = sentences.slice(0, 3).join(' ');
      
      return NextResponse.json({ summary: topSentences });
    }

    const summaryData = await summaryResponse.json();
    const summary = summaryData.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in summarize API:', error);
    return NextResponse.json(
      { error: 'Failed to summarize content' },
      { status: 500 }
    );
  }
}