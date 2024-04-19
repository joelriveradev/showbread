'use server'

import { aaiClient } from '@/lib/assembly'

export async function getTranscript(id: string) {
  return await aaiClient.transcripts.get(id)
}
