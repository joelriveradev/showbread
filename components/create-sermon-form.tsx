'use client'

import { upload } from '@vercel/blob/client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Input } from '@/components/ui/input'
import { createSermon } from '@/actions/create-sermon'
import { createTranscript } from '@/actions/create-transcript'
import { createReport } from '@/actions/create-report'

export const CreateSermonForm = () => {
  const [url, setUrl] = useState<string>()
  const [transcript, setTranscript] = useState<string>()
  const [report, setReport] = useState<string>()
  const [loading, setLoading] = useState(false)
  const { pending } = useFormStatus()

  const renderLoadingStatus = () => {
    if (loading && !url) {
      return 'Uploading...'
    }
    if (loading && url && !transcript) {
      return 'Creating transcript...'
    }
    if (loading && url && transcript && !report) {
      return 'Creating report...'
    }
    if (loading && url && transcript && report) {
      return 'Creating Sermon...'
    } else {
      return 'Create Sermon'
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files

    if (files && files.length > 0) {
      setLoading(true)

      const file = files[0]

      // 1. Upload the audio file to the server
      const { url } = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/sermon/upload',
      })

      setUrl(url)

      // 2. Transcribe the audio file
      const transcript = await createTranscript(url)
      setTranscript(transcript.id)

      // 3. Create the AI report
      const report = await createReport(transcript.text!)
      setReport(report.id)
      setLoading(false)
    }
  }

  return (
    <form action={createSermon}>
      <Input
        type='text'
        name='title'
        placeholder='Title of sermon'
        required
        disabled={loading}
      />

      <Input
        className='my-4'
        type='text'
        name='speaker'
        placeholder='Name of speaker'
        disabled={loading}
        required
      />

      <Input type='hidden' name='url' value={url ?? ''} />
      <Input type='hidden' name='transcript' value={transcript ?? ''} />
      <Input type='hidden' name='report' value={report ?? ''} />

      <Input
        className='my-4'
        type='file'
        name='audio'
        accept='audio/*'
        placeholder='Upload audio file'
        onChange={handleFileChange}
        disabled={loading || pending}
        required
      />

      <Button
        className='w-full py-6 rounded-lg disabled:bg-neutral-200 disabled:text-neutral-700 disabled:border disabled:border-neutral-400'
        type='submit'
        disabled={!url || !transcript || !report}
      >
        {renderLoadingStatus()}
      </Button>
    </form>
  )
}
