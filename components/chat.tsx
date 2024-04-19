'use client'

import {
  useMemo,
  useCallback,
  useState,
  useEffect,
  startTransition,
} from 'react'

import { Message, useChat } from 'ai/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Show } from '@/components/show'
import { ChatSuggestions } from '@/components/chat-suggestions'
import { isElementAtBottom } from '@/lib/utils'
import { Element, scroller } from 'react-scroll'
import { ChatSuggestion } from '@/types/chat'
import { storeMessages } from '@/actions/store-messages'

import Markdown from 'react-markdown'

interface Props {
  id: string
  transcript: string | null | undefined
  history: Message[]
}

export function Chat({ id, transcript, history }: Props) {
  const [messageCount, setMessageCount] = useState<number>(history.length)
  const [bottom, setBottom] = useState(true)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat({
    id,
    initialMessages: history,
    body: { transcript },
  })

  const handleSuggestionClick = useCallback(
    ({ prompt: content }: ChatSuggestion) => {
      append({
        id,
        role: 'user',
        content,
      })
    },
    []
  )

  const runEffectAsync = async () => {
    if (isLoading) return

    if (messages.length > messageCount && history.length !== messages.length) {
      console.log('storing messages...')

      await storeMessages(id, messages)
      setMessageCount(messages.length)
    }
  }

  const chunkContent = useMemo(() => {
    return (text: string) => text.split('\n\n')
  }, [])

  const scrollToBottom = useCallback(() => {
    scroller.scrollTo('anchor', {
      smooth: 'easeOutQuint',
      containerId: 'messages',
      isDyanmic: true,
    })
  }, [])

  const isBottom = useCallback(() => {
    if (typeof window !== 'undefined') {
      const container = document.getElementById('messages')

      if (container) {
        return isElementAtBottom(container)
      }
    }
    return false
  }, [])

  useEffect(() => {
    scrollToBottom()

    if (messages.length > 0) {
      runEffectAsync()
    }
  }, [messages, isLoading])

  return (
    <div
      className={cn(
        'container h-[calc(100dvh-210px)] mx-auto max-w-2xl p-0 relative'
      )}
    >
      <div
        id='messages'
        className='flex flex-col h-full justify-start relative my-5 overflow-scroll'
        onScroll={() => {
          startTransition(() => {
            setBottom(isBottom())
          })
        }}
      >
        {messages.map(({ id, content, role }, i) => {
          const isChatGPT = role === 'assistant'

          return (
            <div key={id} className='mb-8 px-4 last:mb-0'>
              <div className='flex items-center mb-3'>
                <div
                  className={cn('w-4 h-4 rounded-full mr-2', {
                    'bg-black': isChatGPT,
                    'border border-black': !isChatGPT,
                  })}
                ></div>
                <strong>{isChatGPT ? 'ChatGPT' : 'You'}</strong>
              </div>

              <Show when={role !== 'data'}>
                {chunkContent(content).map((chunk, i) => {
                  return (
                    <Markdown
                      key={i}
                      className={cn(
                        'antialiased text-neutral-600 ml-6 mb-4 last:mb-0'
                      )}
                    >
                      {chunk}
                    </Markdown>
                  )
                })}
              </Show>
            </div>
          )
        })}

        <Element name='anchor' />
      </div>

      <Show when={messages.length > 0 && !bottom && !isLoading}>
        <Button
          className='w-8 h-8 p-0 flex items-center justify-center bg-neutral-900 border-none rounded-full hover:bg-zinc-800 hover:scale-125 transition-all absolute bottom-10 left-0 right-0 m-auto'
          variant='default'
          onClick={scrollToBottom}
        >
          <ArrowDown size={15} className='text-white shrink-0' />
        </Button>
      </Show>

      <form
        method='POST'
        onSubmit={handleSubmit}
        className='w-full absolute -bottom-12 px-4 lg:px-0'
      >
        <Show when={messages.length === 0 && history.length === 0}>
          <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
        </Show>

        <div className='w-full flex items-center justify-between relative'>
          <Input
            placeholder='Ask me a question'
            name='message'
            onChange={handleInputChange}
            value={input}
            className='rounded-xl h-14 px-5 text-base hover:border-neutral-300'
          />

          <Button
            type='submit'
            className='w-8 h-8 p-0 flex items-center justify-center bg-transparent rounded-lg text-black bg-white absolute right-3 hover:bg-neutral-700 hover:text-white hover:scale-125 transition-all shrink-0'
            onClick={scrollToBottom}
          >
            <ArrowUp size={20} className='shrink-0' />
          </Button>
        </div>
      </form>
    </div>
  )
}
