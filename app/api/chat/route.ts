import { OpenAIStream, StreamingTextResponse } from 'ai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Set the runtime to edge for best performance
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, transcript } = await req.json()

  const prompt = `
    You are an assistant to help answer questions and provide insights,
    based strictly on the provided sermon transcript. Do not go beyond 
    the content of the transcript. Here's the transcript: "${transcript}"
  `

  const initialMessage: ChatCompletionMessageParam = {
    role: 'system',
    content: prompt,
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages: [initialMessage, ...messages],
  })

  return new StreamingTextResponse(OpenAIStream(response))
}
