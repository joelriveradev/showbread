'use server'

import { aaiClient } from '@/lib/assembly'

export async function getParagraphs(id: string) {
  return await aaiClient.transcripts.paragraphs(id)
}
