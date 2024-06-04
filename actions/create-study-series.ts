'use server'

import { sql } from '@vercel/postgres'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function createStudySeries(transcript: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const prompt = `
    Create a daily devotional series based on the provided 
    sermon transcript, further exploring the central theme and key 
    points of the sermon. For the next 6 days, generate a 
    devotional for each day.

    Components:
    1. Title: A concise and thought-provoking title that reflects 
    the theme of the day, derived from the key takeaways, 
    scripture references, featured quotes, and overall sentiment 
    of the sermon. 
    
    2. Scripture References: A list of 3 relevant, 
    scripture references related to the original scriptures used 
    in the sermon, that strongly support the theme of the day.
    
    3. Commentary: A brief and engaging commentary that aligns with 
    the theme of the day and the sermon, providing insights and 
    reflections to help readers apply the message to their daily lives.
    
    4. Reflection Question: A thought-provoking question that encourages 
    readers to reflect on their own lives, values, and motivations, 
    and to consider how they can apply the message of the sermon to 
    their daily lives.

    Requirements:
    1. The devotional series should be 6 days long, with each day's 
    content building on the previous day's theme and message.
    
    2. The devotional should be engaging, thought-provoking, and easy 
    to understand, with a tone that is conversational and accessible 
    to a wide range of readers.

    3. The scripture references should be accurately cited and relevant 
    to the theme of the day, with a brief explanation or commentary 
    provided to help readers understand the context and significance 
    of the passage.

    4. The devotional for each day should take no more than 10 minutes
    to read.

    Evaluation Criteria:
    1. Clarity and coherence of the devotional series, with each day's 
    content building on the previous day's theme and message.

    2. Relevance and accuracy of the scripture references, with a clear 
    explanation or commentary provided to help readers understand the 
    context and significance of the passage.

    3. Engaging and thought-provoking commentary and reflection questions, 
    with a tone that is conversational and accessible to a wide range of readers.

    4. Overall quality and coherence of the devotional series, with 
    a clear and consistent structure and format throughout.

    Here's the transcript: "${transcript}"
  `
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4-turbo-2024-04-09',
        messages: [{ role: 'system', content: prompt }],
      })

      const study_series = completion.choices[0].message.content

      if (study_series) {
        resolve(study_series)
      }
    } catch (error) {
      reject(error instanceof Error ? error.message : error)
    }
  })
}
