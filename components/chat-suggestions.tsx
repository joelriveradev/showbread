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
    <ul className='flex items-center h-24 lg:h-44 snap-x no-scrollbar snap-mandatory overflow-x-auto scroll-smooth lg:grid w-full lg:grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 lg:gap-y-px'>
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
