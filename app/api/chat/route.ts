import { streamText, StreamingTextResponse } from 'ai'
import { openai } from '@ai-sdk/openai'

// Set the runtime to edge for best performance
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, transcript } = await req.json()

  const prompt = `
    You are an assistant to help answer questions and provide insights,
    based strictly on the provided sermon transcript. Do not go beyond 
    the content of the transcript. Here's the transcript: "${transcript}"
  `

  const initialMessage = {
    role: 'system',
    content: prompt,
  }

  const response = await streamText({
    model: openai('gpt-4o-2024-05-13'),
    messages: [initialMessage, ...messages],
  })

  return new StreamingTextResponse(response.toAIStream())
}
