import { Plus, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sql } from '@vercel/postgres'
import { CreateSermonForm } from '@/components/create-sermon-form'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Sermon } from '@/types/schema'
import { SermonList } from '@/components/sermons'

export default async function Home() {
  const { rows } = await sql`SELECT * FROM sermons;`

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

            <CreateSermonForm />
          </DialogContent>
        </Dialog>

        <span className='font-semibold text-sm'>showbread</span>

        <Button variant='ghost'>
          <UserRound size={24} />
        </Button>
      </header>

      <SermonList sermons={rows as Sermon[]} />
    </div>
  )
}
