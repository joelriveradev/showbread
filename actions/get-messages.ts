'use server'
import { kv } from '@vercel/kv'
import { Message } from 'ai'

export async function getMessages(id: string) {
  return { messages: ((await kv.get(id)) as Message[]) ?? [] }
}
