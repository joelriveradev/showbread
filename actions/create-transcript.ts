'use server'

import { aaiClient } from '@/lib/assembly'
import { sql } from '@vercel/postgres'

export async function createTranscript(url: string) {
  const transcript = await aaiClient.transcripts.transcribe({
    audio_url: url,
    language_code: 'en_us',
  })

  await sql`
    INSERT INTO transcripts (transcript_id, transcript)
    values (${transcript.id}, ${transcript.text});
  `
  return transcript
}
