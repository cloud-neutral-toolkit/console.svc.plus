export type TWebReleaseMetadata = {
  image: string | null
  tag: string | null
  commit: string | null
  version: string | null
}

type TReleaseMetadataEnv = Record<string, string | undefined>

function normalizeReleaseValue(value: string | undefined): string | null {
  const normalizedValue = value?.trim()
  return normalizedValue ? normalizedValue : null
}

export function resolveWebReleaseMetadata(env: TReleaseMetadataEnv = process.env): TWebReleaseMetadata {
  return {
    image: normalizeReleaseValue(env.NEXT_PUBLIC_RELEASE_IMAGE),
    tag: normalizeReleaseValue(env.NEXT_PUBLIC_RELEASE_TAG),
    commit: normalizeReleaseValue(env.NEXT_PUBLIC_RELEASE_COMMIT),
    version: normalizeReleaseValue(env.NEXT_PUBLIC_RELEASE_VERSION),
  }
}
