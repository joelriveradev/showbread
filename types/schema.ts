export interface Report {
  id: string
  summary: string
  featuredQuote: string
  keyTakeaways: string[]
  tags: string[]
  scriptureRefs: string[]
}

export interface Sermon {
  sermon_id: string
  title: string
  speaker: string
  url: string
  transcript_id: string
  report_id: string
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
