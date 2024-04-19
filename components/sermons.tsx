'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Sermon } from '@/types/schema'
import { AudioLines } from 'lucide-react'

import Link from 'next/link'

interface Props {
  sermons: Sermon[]
}

export function SermonList({ sermons }: Props) {
  if (!sermons.length) {
    return (
      <div className='w-full h-[calc(100dvh-75px)] flex items-center'>
        <p className='w-full text-center text-neutral-400 mb-[calc(100dvh/5)]'>
          No sermons yet.
        </p>
      </div>
    )
  }
  return (
    <ScrollArea className='w-full h-[calc(100dvh-75px)] px-5'>
      {sermons.map(({ sermon_id, title, speaker }) => {
        return (
          <Link href={`/sermon/${sermon_id}`} key={sermon_id}>
            <div className='flex items-center mb-4 border border-neutral-200 bg-neutral-50 p-4 rounded-xl'>
              <div className='w-14 h-14 rounded-xl bg-stone-500 flex items-center justify-center'>
                <AudioLines size={24} className='text-white/40' />
              </div>

              <div className='w-3/4 ml-4'>
                <h2 className='font-semibold'>{title}</h2>
                <p className='text-sm text-neutral-400'>{speaker}</p>
              </div>
            </div>
          </Link>
        )
      })}
    </ScrollArea>
  )
}
