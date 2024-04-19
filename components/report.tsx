'use server'

import { getReport } from '@/actions/get-report'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
  id: string
}

export async function Report({ id }: Props) {
  const { summary, featured_quote, key_takeaways, sentiment, scripture_refs } =
    await getReport(id)

  const delimiter = ' - '

  return (
    <div className='w-full h-[calc(100dvh-240px)] text-neutral-700 antialiased'>
      <ScrollArea className='w-full overflow-auto h-[calc(100dvh-130px)] px-5'>
        <section className='mt-5 mb-10'>
          <h2 className='font-semibold mb-1'>Summary</h2>
          <p className='leading-relaxed'>{summary.summary}</p>

          <p className='leading-relaxed mt-3'>
            The overall sentiment of this sermon is{' '}
            <span className='font-bold lowercase'>{sentiment.sentiment}</span>.
          </p>
        </section>

        <section className='mb-10'>
          <h2 className='font-semibold mb-1'>Key Takeaways</h2>
          <ol>
            {key_takeaways.key_takeaway
              .split(delimiter)
              .map((takeaway: string) => (
                <li className='mb-3' key={takeaway}>
                  {takeaway}
                </li>
              ))}
          </ol>
        </section>

        <section className='mb-10'>
          <h2 className='font-semibold mb-1'>Scripture References</h2>
          <ol>
            {scripture_refs.scripture_ref
              .split(delimiter)
              .map((ref: string, i: number) => (
                <li className='mb-1' key={`${ref}-${i}`}>
                  {ref}
                </li>
              ))}
          </ol>
        </section>

        <section className='mb-10'>
          <h2 className='font-semibold mb-1'>Featured Quotes</h2>

          <ul>
            {featured_quote.featured_quote
              .split(delimiter)
              .map((quote: string) => (
                <li className='mb-3 italic' key={quote}>
                  {quote}
                </li>
              ))}
          </ul>
        </section>
      </ScrollArea>
    </div>
  )
}
