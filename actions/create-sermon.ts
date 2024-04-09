'use server'

export async function createSermon(data: FormData) {
  const title = data.get('title')
  const speaker = data.get('speaker')

  console.log({ title, speaker })

  return { title, speaker }
}
