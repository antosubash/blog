import DarkModeTest from '@/components/ui/DarkModeTest'

export default function DarkModeTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/30 dark:from-secondary-900 dark:via-secondary-800 dark:to-primary-900/20">
      <DarkModeTest />
    </div>
  )
}
