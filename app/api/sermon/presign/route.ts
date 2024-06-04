import { S3 } from '@/lib/cloudflare'
import { NextResponse } from 'next/server'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { slugify } from '@/utils'

export async function POST(request: Request) {
  const body = await request.formData()
  const file = body.get('file') as File
  const bucketUrl = process.env.CF_PUBLIC_BUCKET_URL

  if (!file) {
    return NextResponse.json({
      error: 'No file provided.',
    })
  }

  const { type, name } = file

  const objectKey = `${Date.now().toString()}-${slugify(name)}`
  const publicUrl = `${bucketUrl}/${objectKey}`

  try {
    const preSignedUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: 'showbread-blob',
        Key: objectKey,
        ContentType: type,
        ACL: 'public-read',
      }),
      {
        expiresIn: 60 * 5, // 5 minutes
      }
    )
    return NextResponse.json({ preSignedUrl, publicUrl })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    )
  }
}
