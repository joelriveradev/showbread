import { AssemblyAI } from 'assemblyai'

export const aaiClient = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY!,
})
