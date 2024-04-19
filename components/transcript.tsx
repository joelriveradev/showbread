'use client'

import { useState, useEffect, useRef } from 'react'
import { TranscriptParagraph } from 'assemblyai'
import { formatTime } from '@/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Props {
  audioUrl: string
  paragraphs: TranscriptParagraph[]
}

export function Transcript({ audioUrl, paragraphs }: Props) {
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null)
  const [_, setCurrentTime] = useState(0)
  const [active, setActive] = useState<TranscriptParagraph | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) return

    const playHandler = () => {
      if (intervalID) clearInterval(intervalID)

      const id = setInterval(() => {
        const current = audio.currentTime * 1000
        setCurrentTime(current)

        const match = paragraphs.find(
          ({ start, end }) => start <= current && end >= current
        )

        if (match && match !== active) {
          setActive(match)
        }
      }, 10)

      setIntervalID(id)
    }

    const pauseHandler = () => {
      if (intervalID) {
        clearInterval(intervalID)
        setIntervalID(null)
      }
    }

    audio.addEventListener('play', playHandler)
    audio.addEventListener('pause', pauseHandler)
    audio.addEventListener('ended', pauseHandler)

    return () => {
      if (intervalID) {
        clearInterval(intervalID)
      }
      audio.removeEventListener('play', playHandler)
      audio.removeEventListener('pause', pauseHandler)
      audio.removeEventListener('ended', pauseHandler)
    }
  }, [])

  useEffect(() => {
    if (active) {
      const paragraph = document.getElementById(active.start.toString())

      paragraph?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [active])

  return (
    <div>
      <audio src={audioUrl} controls className='w-full' ref={audioRef} />

      <ScrollArea className='h-[calc(100dvh-265px)] mt-5'>
        {paragraphs.map(({ text, start, end }, i) => {
          const isActive = active && active.start === start

          return (
            <div
              id={start.toString()}
              className={cn('px-5 pb-8 opacity-50 transition-all', {
                'opacity-100': isActive,
              })}
              key={i}
            >
              <span className='mb-1.5 font-medium text-sm block'>
                {formatTime(start)}
              </span>

              <p className='antialiased text-neutral-700 leading-relaxed'>
                {text}
              </p>
            </div>
          )
        })}
      </ScrollArea>
    </div>
  )
}
