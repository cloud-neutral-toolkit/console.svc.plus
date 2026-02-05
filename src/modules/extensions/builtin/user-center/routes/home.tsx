import Breadcrumbs from '@/app/panel/components/Breadcrumbs'
import UserOverview from '../components/UserOverview'

export default function UserCenterHomeRoute() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/panel' },
        ]}
      />
      <UserOverview />
    </div>
  )
}
