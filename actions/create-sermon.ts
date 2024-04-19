'use server'

import { sql } from '@vercel/postgres'
import { redirect } from 'next/navigation'

export async function createSermon(data: FormData) {
  const title = data.get('title') as string
  const speaker = data.get('speaker') as string
  const url = data.get('url') as string
  const report = data.get('report') as string
  const transcript = data.get('transcript') as string

  const result = await sql`
    INSERT INTO sermons (
      title, 
      speaker,
      url,
      report_id,
      transcript_id
    ) values (
      ${title}, 
      ${speaker}, 
      ${url},
      ${report},
      ${transcript}
    ) RETURNING sermon_id;
  `

  const { sermon_id } = result.rows[0]
  return redirect(`/sermon/${sermon_id}`)
}
