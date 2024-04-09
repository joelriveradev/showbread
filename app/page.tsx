'use client'

import { Plus, UserRound, AudioLines } from 'lucide-react'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createSermon } from '@/actions/create-sermon'
import { sermons } from '@/data'

export default function Home() {
  return (
    <div className='w-full min-h-dvh max-w-md mx-auto'>
      <header className='flex items-center justify-between p-4'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='ghost'>
              <Plus size={28} />
            </Button>
          </DialogTrigger>

          <DialogContent className='max-w-md rounded-xl'>
            <DialogHeader className='text-left'>
              <DialogTitle>New Sermon</DialogTitle>
            </DialogHeader>

            <form action={createSermon}>
              <Input
                type='text'
                name='title'
                placeholder='Title of sermon'
                required
              />

              <Input
                className='my-4'
                type='text'
                name='speaker'
                placeholder='Name of speaker'
                required
              />

              <Button className='w-full py-6 rounded-lg' type='submit'>
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Button variant='ghost'>
          <UserRound size={24} />
        </Button>
      </header>

      <ScrollArea className='w-full h-[calc(100dvh-75px)] px-8'>
        {sermons.map(({ id, title, duration }) => {
          return (
            <div
              className='flex items-center mb-4 border border-neutral-200 bg-neutral-50 p-4 rounded-xl'
              key={id}
            >
              <div className='w-14 h-14 rounded-xl bg-stone-500 flex items-center justify-center'>
                <AudioLines size={24} className='text-white/40' />
              </div>

              <div className='w-3/4 ml-4'>
                <h2 className='font-semibold'>{title}</h2>
                <p className='text-sm text-neutral-400'>{duration} Min</p>
              </div>
            </div>
          )
        })}
      </ScrollArea>
    </div>
  )
}
