'use server'

import { sql } from '@vercel/postgres'

export async function getSermon(id: string) {
  const result = await sql`SELECT * FROM sermons where sermon_id = ${id};`
  return result.rows[0]
}
