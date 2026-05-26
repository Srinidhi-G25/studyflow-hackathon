import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system:
      'You are an AI study coach. Create a practical, motivating 3-day study plan with clear bullet points for each day. Keep it concise and actionable.',
    prompt: `The student has these upcoming tasks: ${prompt}. Generate a 3-day study plan to help them complete these tasks efficiently.`,
  });

  return result.toUIMessageStreamResponse();
}
