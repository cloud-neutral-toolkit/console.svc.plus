import 'server-only'

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import type { StorageClient, StorageConfig, PutObjectOptions, StorageObjectResult } from '../types'
import { buildPublicUrl, normalizeKey, objectBodyToBuffer } from '../utils'

export function createS3Client(config: StorageConfig): StorageClient {
  const bucket = config.bucket
  if (!bucket) {
    throw new Error('[storage] S3 bucket is required')
  }

  const credentials =
    config.credentials?.accessKeyId && config.credentials.secretAccessKey
      ? {
          accessKeyId: config.credentials.accessKeyId,
          secretAccessKey: config.credentials.secretAccessKey,
          sessionToken: config.credentials.sessionToken,
        }
      : undefined

  const client = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: config.s3?.forcePathStyle,
    credentials,
  })

  const prefix = config.prefix

  const getObject = async (key: string): Promise<Buffer> => {
    const objectKey = normalizeKey(prefix, key)
    const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: objectKey }))
    return objectBodyToBuffer(result.Body)
  }

  const putObject = async (
    key: string,
    body: Buffer | string,
    options?: PutObjectOptions,
  ): Promise<StorageObjectResult> => {
    const objectKey = normalizeKey(prefix, key)
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: body,
        ContentType: options?.contentType,
        CacheControl: options?.cacheControl,
        Metadata: options?.metadata,
      }),
    )
    return { url: buildPublicUrl(config.publicBaseUrl, objectKey) }
  }

  const getPublicUrl = (key: string): string | undefined => {
    const objectKey = normalizeKey(prefix, key)
    return buildPublicUrl(config.publicBaseUrl, objectKey)
  }

  return {
    provider: 's3',
    getObject,
    putObject,
    getPublicUrl,
  }
}
