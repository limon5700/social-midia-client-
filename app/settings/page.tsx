'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import {
  type SettingsFormSection,
  type SettingsSection,
  settingsData,
  sidebarItems,
  settingsSectionHref,
} from '@/components/settings/settingsConfig'
import { SettingsSectionPanel } from '@/components/settings/SettingsSectionPanel'

function isDesktopViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
}

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState<SettingsSection>('account')
  const [settings, setSettings] = useState(settingsData)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (!isDesktopViewport()) {
      if (tab && (tab === 'privacy' || tab === 'security' || tab === 'notifications' || tab === 'theme')) {
        router.replace(settingsSectionHref(tab))
      }
      return
    }

    if (tab === 'privacy' || tab === 'security' || tab === 'notifications' || tab === 'theme') {
      setActiveSection(tab)
      return
    }
    if (tab === 'account') {
      setActiveSection('account')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (!isDesktopViewport()) return

    const tab = searchParams.get('tab')
    if (tab && tab !== 'account') return

    if (activeSection !== 'account') {
      const url = new URL(window.location.href)
      url.searchParams.set('tab', activeSection)
      window.history.replaceState(null, '', url.pathname + url.search)
    }
  }, [activeSection, searchParams])

  const handleSettingChange = (
    section: SettingsFormSection,
    settingId: string,
    value: unknown,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: prev[section].map((setting) =>
        setting.id === settingId ? { ...setting, value } : setting,
      ),
    }))
  }

  const handleSidebarSelect = (id: SettingsSection) => {
    setActiveSection(id)
    const url = new URL(window.location.href)
    if (id === 'account') {
      url.searchParams.delete('tab')
    } else {
      url.searchParams.set('tab', id)
    }
    window.history.replaceState(null, '', url.pathname + url.search)
  }

  const handleMenuClick = (id: SettingsSection) => {
    if (isDesktopViewport()) {
      handleSidebarSelect(id)
      return
    }
    router.push(settingsSectionHref(id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and privacy</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const IconComponent = item.icon
                  const isActive = activeSection === item.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 sm:py-2 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 border border-primary-200 lg:border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 shrink-0" />
                      <span className="font-medium text-left flex-1">{item.label}</span>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? 'text-primary-600 lg:rotate-90' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1 hidden lg:block">
            <SettingsSectionPanel
              section={activeSection}
              settings={settings}
              onSettingChange={handleSettingChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center pt-24">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoadingFallback />}>
      <SettingsContent />
    </Suspense>
  )
}
