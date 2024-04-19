import type { ChatSuggestion } from '@/types/chat'
import { animate, stagger, spring } from 'motion'
import { useEffect } from 'react'

interface Props {
  onSuggestionClick: (suggestion: ChatSuggestion) => void
}

const suggestions: ChatSuggestion[] = [
  {
    title: 'Create a devotional series',
    description: 'based on the the theme of the sermon for the next 6 days.',
    prompt: `
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
    `,
  },
  {
    title: 'Write a sonnet',
    description: 'about the central theme of the sermon.',
    prompt: `Write a sonnet based on the central theme of the sermon.`,
  },
]

export const ChatSuggestions = ({ onSuggestionClick }: Props) => {
  useEffect(() => {
    const suggestions = document.querySelectorAll('#suggestion')

    if (suggestions) {
      animate(
        suggestions,
        { y: -3, opacity: 1 },
        { delay: stagger(0.1), duration: 0.5, easing: spring() }
      )
    }
  }, [])

  return (
    <ul className='flex items-center h-24 lg:h-44 snap-x snap-mandatory overflow-x-auto scroll-smooth lg:grid w-full lg:grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 lg:gap-y-px'>
      {suggestions.map((suggestion, i) => {
        const { title, description } = suggestion

        return (
          <li
            id='suggestion'
            key={`${title}-${i}`}
            onClick={() => onSuggestionClick(suggestion)}
            className='opacity-0 transform translate-y-40 snap-center'
          >
            <button
              type='button'
              className='w-[300px] flex flex-col shrink-0 justify-start lg:w-full text-left h-full bg-transparent border border-zinc-800 rounded-xl p-4 hover:bg-neutral-50 cursor-pointer'
            >
              <p className='font-semibold text-black antialiased text-sm mb-1'>
                {title}
              </p>
              <p className='w-full text-zinc-500 text-sm truncate'>
                {description}
              </p>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
