'use client'

import MfaSetupPanel from '../account/MfaSetupPanel'
import SubscriptionPanel from '../account/SubscriptionPanel'
import UserOverview from '../components/UserOverview'
import { useUserStore } from '@lib/userStore'

export default function UserCenterAccountRoute() {
  const user = useUserStore((state) => state.user)
  const isReadOnlyRole = Boolean(user?.isReadOnly)

  return (
    <div className="space-y-6">
      <UserOverview hideMfaMainPrompt />
      {!isReadOnlyRole ? <MfaSetupPanel showSummary={false} /> : null}
      {!isReadOnlyRole ? <SubscriptionPanel /> : null}
    </div>
  )
}
