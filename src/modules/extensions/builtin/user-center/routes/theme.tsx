import Breadcrumbs from '@/app/panel/components/Breadcrumbs'
import ThemePreferenceCard from '../account/ThemePreferenceCard'

export default function UserCenterThemeRoute() {
  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/panel' },
          { label: 'Appearance', href: '/panel/appearance' },
        ]}
      />
      <ThemePreferenceCard />
    </div>
  )
}
