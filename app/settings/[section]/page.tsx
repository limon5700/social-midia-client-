'use client'

import { Suspense, useEffect, useState } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import {
  type SettingsFormSection,
  isSettingsSection,
  settingsData,
} from '@/components/settings/settingsConfig'
import { SettingsSectionPanel } from '@/components/settings/SettingsSectionPanel'

function isDesktopViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
}

function SettingsSectionContent() {
  const router = useRouter()
  const params = useParams()
  const sectionParam = params.section

  if (typeof sectionParam !== 'string' || !isSettingsSection(sectionParam)) {
    notFound()
  }

  const section = sectionParam
  const [settings, setSettings] = useState(settingsData)

  useEffect(() => {
    const redirectDesktop = () => {
      if (!isDesktopViewport()) return
      const query = section === 'account' ? '' : `?tab=${section}`
      router.replace(`/settings${query}`)
    }

    redirectDesktop()
    window.addEventListener('resize', redirectDesktop)
    return () => window.removeEventListener('resize', redirectDesktop)
  }, [section, router])

  const handleSettingChange = (
    formSection: SettingsFormSection,
    settingId: string,
    value: unknown,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [formSection]: prev[formSection].map((setting) =>
        setting.id === settingId ? { ...setting, value } : setting,
      ),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:hidden">
      <div className="max-w-lg mx-auto px-4 py-4 pb-24">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          Back to Settings
        </Link>

        <SettingsSectionPanel
          section={section}
          settings={settings}
          onSettingChange={handleSettingChange}
        />
      </div>
    </div>
  )
}

function SettingsSectionLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center lg:hidden">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
    </div>
  )
}

export default function SettingsSectionPage() {
  return (
    <Suspense fallback={<SettingsSectionLoading />}>
      <SettingsSectionContent />
    </Suspense>
  )
}
