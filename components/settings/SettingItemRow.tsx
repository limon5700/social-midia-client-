'use client'

import type { SettingItem } from './settingsConfig'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        checked ? 'bg-primary-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

interface SettingItemRowProps {
  setting: SettingItem
  onChange: (value: unknown) => void
  onButtonClick: () => void
}

export function SettingItemRow({ setting, onChange, onButtonClick }: SettingItemRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          {setting.icon && <setting.icon className="h-4 w-4 text-gray-400 shrink-0" />}
          <h3 className="font-medium text-gray-900">{setting.label}</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
      </div>

      <div className="flex-shrink-0 w-full sm:w-auto">
        {setting.type === 'toggle' && (
          <ToggleSwitch checked={Boolean(setting.value)} onChange={onChange} />
        )}

        {setting.type === 'dropdown' && (
          <select
            value={String(setting.value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {setting.type === 'input' && (
          <input
            type="text"
            value={String(setting.value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.placeholder}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
          />
        )}

        {setting.type === 'textarea' && (
          <textarea
            value={String(setting.value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.placeholder}
            rows={3}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64 resize-none"
          />
        )}

        {setting.type === 'button' && (
          <button
            type="button"
            onClick={onButtonClick}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-colors duration-200 ${
              setting.id === 'delete-account'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {String(setting.value)}
          </button>
        )}
      </div>
    </div>
  )
}
