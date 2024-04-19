'use client'
import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

export const BackButton = () => {
  return (
    <Link href='/' prefetch>
      <ArrowLeft size={24} />
    </Link>
  )
}
