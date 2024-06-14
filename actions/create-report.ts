'use server'

import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { sql } from '@vercel/postgres'
import { z } from 'zod'

export async function createReport(
  transcript: string
): Promise<{ id: string }> {
  return new Promise(async (resolve, reject) => {
    const prompt = `
    You are an assistant to help summarize sermon transcripts
    and extract insights to help users further explore
    sermon content. Given a transcript, generate a report 
    that contains the following:

    1. A brief summary of the sermon
    2. A list of the key takeaways
    3. A list of featured quotes
    4. A list of the bible verses used in the sermon
    5. A list of categories that the sermon falls under, no more than 3
    6. The overall sentiment of the sermon

    Here's the transcript: "${transcript}"
  `

    try {
      // 1. Generate the report

      const keys = {
        summary_id: '',
        key_takeaway_id: '',
        featured_quote_id: '',
        scripture_ref_id: '',
        tag_id: '',
        sentiment_id: '',
      }

      const { object: report } = await generateObject({
        model: openai('gpt-4o'),
        schema: z.object({
          summary: z.string().describe('A brief summary of the sermon.'),
          key_takeaway: z.string().describe('A list of the key takeaways.'),
          featured_quote: z.string().describe('A list of featured quotes.'),
          scripture_ref: z
            .string()
            .describe('A list of the bible verses used in the sermon.'),
          tags: z.string().describe('A list of categories of the sermon'),
          sentiment: z
            .string()
            .describe('The overall sentiment of the sermon.'),
        }),
        prompt,
      })

      if (report) {
        console.log({ report })

        const summary = await sql`
          INSERT INTO summaries(summary)
          values(${report.summary})
          RETURNING summary_id;
        `

        const key_takeaway = await sql`
          INSERT INTO key_takeaways(key_takeaway)
          values(${report.key_takeaway})
          RETURNING key_takeaway_id;
        `

        const quotes = await sql`
          INSERT INTO featured_quotes(featured_quote)
          values(${report.featured_quote})
          RETURNING featured_quote_id;
        `

        const scripture_ref = await sql`
          INSERT INTO scripture_refs(scripture_ref)
          values(${report.scripture_ref})
          RETURNING scripture_ref_id;
        `

        const tags = await sql`
          INSERT INTO tags(tag)
          values(${report.tags})
          RETURNING tag_id;
        `

        const sentiment = await sql`
          INSERT INTO sentiments(sentiment)
          values(${report.sentiment})
          RETURNING sentiment_id;
        `

        if (summary.rows.length > 0) {
          keys.summary_id = summary.rows[0].summary_id
        }
        if (key_takeaway.rows.length > 0) {
          keys.key_takeaway_id = key_takeaway.rows[0].key_takeaway_id
        }
        if (tags.rows.length > 0) {
          keys.tag_id = tags.rows[0].tag_id
        }
        if (sentiment.rows.length > 0) {
          keys.sentiment_id = sentiment.rows[0].sentiment_id
        }
        if (scripture_ref.rows.length > 0) {
          keys.scripture_ref_id = scripture_ref.rows[0].scripture_ref_id
        }
        if (quotes.rows.length > 0) {
          keys.featured_quote_id = quotes.rows[0].featured_quote_id
        }
      }

      // 2. Insert the report ids into the database
      const { rows } = await sql`
          INSERT INTO reports(
            summary_id,
            key_takeaway_id,
            featured_quote_id,
            scripture_ref_id,
            tag_id,
            sentiment_id
          ) values (
            ${keys.summary_id},
            ${keys.key_takeaway_id},
            ${keys.featured_quote_id},
            ${keys.scripture_ref_id},
            ${keys.tag_id},
            ${keys.sentiment_id}
          ) RETURNING report_id;
        `
      if (rows.length > 0) {
        resolve({ id: rows[0].report_id })
      }
    } catch (error) {
      reject(
        error instanceof Error
          ? error.message
          : 'An error occurred while creating the report.'
      )
    }
  })
}
