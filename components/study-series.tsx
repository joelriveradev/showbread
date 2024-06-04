'use server'

import { sql } from '@vercel/postgres'
import Markdown from 'react-markdown'

interface Props {
  sermon_id: string
}

export async function StudySeries({ sermon_id }: Props) {
  // const query = sql`SELECT study_series FROM sermons WHERE sermon_id = ${sermon_id};`
  // const { rows } = await query

  // if (rows.length) {
  //   const { study_series } = rows[0]

  //   return (
  //     <div className='w-full h-dvh'>
  //       <Markdown>{study_series}</Markdown>
  //     </div>
  //   )
  // }

  return (
    <div className='w-full h-dvh'>
      <p className='antialiased text-neutral-500 text-center mt-20'>
        Study series coming soon!
      </p>
    </div>
  )
}
