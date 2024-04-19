'use server'

import OpenAI from 'openai'

import { sql } from '@vercel/postgres'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ReportSection {
  key: string
  value: string | string[]
}

export async function createReport(
  transcript: string
): Promise<{ id: string }> {
  return new Promise(async (resolve, reject) => {
    const prompt = `
    You are an assistant to help summarize sermon transcripts
    and extract insights to help users further explore
    sermon content. Given a transcript, generate a
    report that contains the following:

    1. A brief summary of the sermon (summary)
    2. A list of the key takeaways (key_takeaways)
    3. A list of featured quotes (featured_quotes)
    4. A list of the bible verses used (scripture_refs)
    5. A list of categories that the sermon falls under, no more than 3 (tags)
    6. The overall sentiment of the sermon (sentiment)

    Return the summary as a raw JSON array of key-value pair objects,
    where the key is the section of the report ie: summary, takeaways, etc.
    like so: [{ key: 'summary', value: 'The sermon was about...' }]
    The names for each section I want you to use are in parentheses.
    DO NOT RETURN THE DATA IN MARKDOWN, ONLY IN RAW JSON.

    Here's the transcript: "${transcript}"
  `

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: prompt },
    ]

    try {
      // 1. Generate the report
      const completion = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
      })

      // remove markdown formatting
      // just in case chatGPT doesn't follow instructions
      const content = completion.choices[0].message.content
        ?.replace(/```/g, '')
        .replace('json', '')

      if (content) {
        const keys = {
          summary_id: '',
          key_takeaway_id: '',
          featured_quote_id: '',
          scripture_ref_id: '',
          tag_id: '',
          sentiment_id: '',
        }

        console.log(content)
        const report: ReportSection[] = JSON.parse(content)

        // 2. Insert each section of the report into the database
        await Promise.all(
          report.map(async ({ key, value }: ReportSection) => {
            const deliminator = ' - '

            const serializedValue = Array.isArray(value)
              ? value.join(deliminator)
              : value

            if (key === 'summary') {
              const { rows } = await sql`
              INSERT INTO summaries(summary)
              values(${serializedValue})
              RETURNING summary_id;
            `
              if (rows.length > 0) {
                keys.summary_id = rows[0].summary_id
              }
            }
            if (key === 'key_takeaways') {
              const { rows } = await sql`
              INSERT INTO key_takeaways(key_takeaway)
              values(${serializedValue})
              RETURNING key_takeaway_id;
            `
              if (rows.length > 0) {
                keys.key_takeaway_id = rows[0].key_takeaway_id
              }
            }
            if (key === 'featured_quotes') {
              const { rows } = await sql`
              INSERT INTO featured_quotes(featured_quote)
              values(${serializedValue})
              RETURNING featured_quote_id;
            `
              if (rows.length > 0) {
                keys.featured_quote_id = rows[0].featured_quote_id
              }
            }
            if (key === 'scripture_refs') {
              const { rows } = await sql`
              INSERT INTO scripture_refs(scripture_ref)
              values(${serializedValue})
              RETURNING scripture_ref_id;
            `
              if (rows.length > 0) {
                keys.scripture_ref_id = rows[0].scripture_ref_id
              }
            }
            if (key === 'tags') {
              const { rows } = await sql`
              INSERT INTO tags(tag)
              values(${serializedValue})
              RETURNING tag_id;
            `
              if (rows.length > 0) {
                keys.tag_id = rows[0].tag_id
              }
            }
            if (key === 'sentiment') {
              const { rows } = await sql`
              INSERT INTO sentiments(sentiment)
              values(${serializedValue})
              RETURNING sentiment_id;
            `
              if (rows.length > 0) {
                keys.sentiment_id = rows[0].sentiment_id
              }
            }
          })
        )

        // 2. Insert the report into the database
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
