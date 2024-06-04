'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Input } from '@/components/ui/input'
import { createSermon } from '@/actions/create-sermon'
import { createTranscript } from '@/actions/create-transcript'
import { createReport } from '@/actions/create-report'
// import { createStudySeries } from '@/actions/create-study-series'

export const CreateSermonForm = () => {
  const [url, setUrl] = useState<string>()
  const [transcript, setTranscript] = useState<string>()
  // const [studySeries, setStudySeries] = useState<string>()
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
    // if (loading && url && transcript && report && !studySeries) {
    //   return 'Creating study series...'
    // }
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

    try {
      if (files && files.length > 0) {
        setLoading(true)

        const file = files[0]

        // 1. Upload the audio file to the server
        const body = new FormData()
        body.append('file', file)

        const { preSignedUrl, publicUrl } = await fetch('/api/sermon/upload', {
          method: 'POST',
          body,
        }).then((response) => response.json())

        await fetch(preSignedUrl as string, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        })

        setUrl(publicUrl)

        // // 2. Transcribe the audio file
        const { id, text } = await createTranscript(publicUrl)
        setTranscript(id)

        // // 3. Create the AI report
        const report = await createReport(text!)
        setReport(report.id)

        // // 4. Create the study series
        // const series = await createStudySeries(text!)
        // setStudySeries(series)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
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
      {/* <Input type='hidden' name='studySeries' value={studySeries ?? ''} /> */}
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
