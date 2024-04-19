'use server'

import { Message } from 'ai'
import { kv } from '@vercel/kv'

export async function storeMessages(id: string, messages: Message[]) {
  return kv.set(id, messages)
}
