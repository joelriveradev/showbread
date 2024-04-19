'use server'

import { sql } from '@vercel/postgres'

export async function getReport(id: string) {
  const report = await sql`
    SELECT summary_id, 
    sentiment_id, 
    featured_quote_id, 
    key_takeaway_id, 
    tag_id, 
    scripture_ref_id 
    FROM reports 
    WHERE report_id = ${id};
  `
  const {
    summary_id,
    sentiment_id,
    featured_quote_id,
    key_takeaway_id,
    tag_id,
    scripture_ref_id,
  } = report.rows[0]

  const summary = await sql`
    SELECT * FROM summaries 
    WHERE summary_id = ${summary_id};
  `
  const summaryData = summary.rows[0]

  const sentiment = await sql`
    SELECT * FROM sentiments 
    WHERE sentiment_id = ${sentiment_id};
  `
  const sentimentData = sentiment.rows[0]

  const fq = await sql`
    SELECT * FROM featured_quotes 
    WHERE featured_quote_id = ${featured_quote_id};
  `
  const fqData = fq.rows[0]

  const key_takeaways = await sql`
    SELECT * FROM key_takeaways 
    WHERE key_takeaway_id = ${key_takeaway_id};
  `
  const ktData = key_takeaways.rows[0]

  const tags = await sql`
    SELECT * FROM tags 
    WHERE tag_id = ${tag_id};
  `
  const tagData = tags.rows[0]

  const scriptureRefs = await sql`
    SELECT * FROM scripture_refs 
    WHERE scripture_ref_id = ${scripture_ref_id};
  `

  const srData = scriptureRefs.rows[0]

  return {
    summary: summaryData,
    sentiment: sentimentData,
    featured_quote: fqData,
    key_takeaways: ktData,
    tags: tagData,
    scripture_refs: srData,
  }
}
