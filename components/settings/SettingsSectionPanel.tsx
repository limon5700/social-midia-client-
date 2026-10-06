'use client'

import { useState } from 'react'
import { Settings, X, AlertTriangle } from 'lucide-react'
import { PrivacySecurityHub } from '@/components/settings/PrivacySecurityHub'
import {
  type SettingsFormSection,
  type SettingsSection,
  settingsData,
  sidebarItems,
} from './settingsConfig'
import { SettingItemRow } from './SettingItemRow'

interface SettingsSectionPanelProps {
  section: SettingsSection
  settings: typeof settingsData
  onSettingChange: (section: SettingsFormSection, settingId: string, value: unknown) => void
}

export function SettingsSectionPanel({
  section,
  settings,
  onSettingChange,
}: SettingsSectionPanelProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleButtonAction = (settingId: string) => {
    switch (settingId) {
      case 'password-change':
        setShowPasswordModal(true)
        break
      case 'delete-account':
        setShowDeleteModal(true)
        break
      case 'data-export':
        console.log('Exporting data...')
        break
      case 'active-sessions':
        console.log('Viewing active sessions...')
        break
    }
  }

  const currentSettings =
    section === 'privacy' ? [] : settings[section as SettingsFormSection]

  const SectionIcon =
    sidebarItems.find((item) => item.id === section)?.icon || Settings

  return (
    <>
      {section === 'privacy' ? (
        <PrivacySecurityHub />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <SectionIcon className="h-6 w-6 text-primary-600 shrink-0" />
              <h2 className="text-xl font-semibold text-gray-900">
                {sidebarItems.find((item) => item.id === section)?.label}
              </h2>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {currentSettings.map((setting) => (
              <SettingItemRow
                key={setting.id}
                setting={setting}
                onChange={(value) =>
                  onSettingChange(section as SettingsFormSection, setting.id, value)
                }
                onButtonClick={() => handleButtonAction(setting.id)}
              />
            ))}
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  console.log('Account deleted')
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false)
                  console.log('Password changed')
                }}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
