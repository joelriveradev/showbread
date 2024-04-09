export interface Sentence {
  text: string
  start: number
  end: number
  confidence: number
  speaker: string | null
}

export interface Transcript {
  id: string
  confidence: number
  audio_duration: number
  sentences: Sentence[]
}

export interface Summary {
  id: string
  summary: string
  featuredQuote: string
  keyTakeaways: string[]
  tags: string[]
  scriptureRefs: string[]
}

export interface Sermon {
  id: string
  title: string
  speaker: string
  // transcript: Transcript
  // summary: Summary
  // notes: string
  duration: number
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  subscribed: boolean
  sermons: Sermon[]
}
