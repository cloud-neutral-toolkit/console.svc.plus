export const dynamic = 'error'

import { notFound, redirect } from 'next/navigation'

import { resolveExtensionRouteComponent } from '@extensions/loader'

type PageProps = {
  params: Promise<{
    segments?: string[]
  }>
}

export default async function PanelExtensionRoutePage({ params }: PageProps) {
  const { segments = [] } = await params
  const normalized = segments.filter((segment) => segment && segment.trim().length > 0)
  const path = `/panel/${normalized.join('/')}`

  try {
    const Component = await resolveExtensionRouteComponent(path)
    return <Component />
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('disabled')) {
        redirect('/panel')
      }
      if (error.message.includes('No extension route registered')) {
        notFound()
      }
    }
    throw error
  }
}
