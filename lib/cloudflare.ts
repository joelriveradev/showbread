import { S3Client } from '@aws-sdk/client-s3'

export const S3 = new S3Client({
  region: 'auto',
  endpoint: process.env.CF_S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
  },
})
