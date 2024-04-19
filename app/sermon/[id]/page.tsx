import { Sermon } from '@/types/schema'
import { Button } from '@/components/ui/button'

import { Ellipsis, AudioLines, MessageSquareText, Sparkles } from 'lucide-react'

import { Chat } from '@/components/chat'
import { Report } from '@/components/report'
import { Show } from '@/components/show'
import { BackButton } from '@/components/back-button'
import { Transcript } from '@/components/transcript'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { getSermon } from '@/actions/get-sermon'
import { getTranscript } from '@/actions/get-transcript'
import { getParagraphs } from '@/actions/get-paragraphs'
import { getMessages } from '@/actions/get-messages'

interface Props {
  params: { id: string }
}

export default async function SermonDetailPage({ params: { id } }: Props) {
  const result = await getSermon(id)

  const { title, sermon_id, report_id, transcript_id } = result as Sermon
  const { messages } = await getMessages(sermon_id)
  const { audio_url, text } = await getTranscript(transcript_id)
  const { paragraphs } = await getParagraphs(transcript_id)

  return (
    <div className='w-full h-dvh max-w-md mx-auto'>
      <header className='flex items-center justify-between p-4'>
        <BackButton />

        <h1 className='font-semibold text-sm'>{title}</h1>

        <Button
          variant='ghost'
          className='p-0 flex items-center justify-center'
        >
          <Ellipsis size={24} />
        </Button>
      </header>

      <Tabs defaultValue='transcript'>
        <TabsList className='w-full mx-auto h-14 flex items-center justify-between rounded-xl bg-neutral-50 border border-neutral-200 '>
          <TabsTrigger value='transcript'>
            <AudioLines size={24} />
          </TabsTrigger>

          <TabsTrigger value='summary'>
            <Sparkles size={24} />
          </TabsTrigger>

          <TabsTrigger value='chat'>
            <MessageSquareText size={24} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value='transcript' className='pt-5 pb-10 m-0'>
          <Transcript paragraphs={paragraphs} audioUrl={audio_url} />
        </TabsContent>

        <TabsContent value='summary'>
          <Report id={report_id} />
        </TabsContent>

        <TabsContent value='chat' className='m-0'>
          <Show when={!!transcript_id}>
            <Chat id={sermon_id} transcript={text} history={messages} />
          </Show>
        </TabsContent>
      </Tabs>
    </div>
  )
}
