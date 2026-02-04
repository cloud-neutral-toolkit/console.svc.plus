'use client'

import MfaSetupPanel from '../account/MfaSetupPanel'
import SubscriptionPanel from '../account/SubscriptionPanel'
import UserOverview from '../components/UserOverview'
import { useUserStore } from '@lib/userStore'

export default function UserCenterAccountRoute() {
  const user = useUserStore((state) => state.user)
  const isDemoReadOnly = Boolean(user?.isReadOnly && user?.email?.toLowerCase() === 'demo@svc.plus')

  return (
    <div className="space-y-6">
      <UserOverview hideMfaMainPrompt />
      {!isDemoReadOnly ? <MfaSetupPanel showSummary={false} /> : null}
      {!isDemoReadOnly ? <SubscriptionPanel /> : null}
    </div>
  )
}
