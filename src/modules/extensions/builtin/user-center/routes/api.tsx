import Breadcrumbs from '@/app/panel/components/Breadcrumbs'
import Card from '../components/Card'

export default function UserCenterApiRoute() {
  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/panel' },
          { label: 'APIs', href: '/panel/api' },
        ]}
      />
      <Card>
        <h1 className="text-2xl font-semibold text-gray-900">API Status</h1>
        <p className="mt-2 text-sm text-gray-600">View backend API health and toggle feature matrices.</p>
      </Card>
    </div>
  )
}
