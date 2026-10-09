'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Shield,
  EyeOff,
  Lock,
  Globe,
  Users,
  UserX,
  Search,
  Download,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlockedUser {
  id: string
  name: string
  username: string
  avatar: string
  isVerified?: boolean
}

interface PrivacyState {
  privateAccount: boolean
  profileVisibility: string
  messageFrom: string
  allowTagging: boolean
  messageRequests: boolean
  showActivity: boolean
  showOnlineStatus: boolean
  locationSharing: boolean
  searchIndexing: boolean
}

const DEFAULT_STATE: PrivacyState = {
  privateAccount: false,
  profileVisibility: 'public',
  messageFrom: 'everyone',
  allowTagging: true,
  messageRequests: true,
  showActivity: true,
  showOnlineStatus: true,
  locationSharing: false,
  searchIndexing: false,
}

function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50',
        checked ? 'bg-primary-500' : 'bg-gray-200',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}

function Row({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-100 py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-gray-900">{label}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof Shield
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
        <Icon className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6">{children}</div>
    </div>
  )
}

export function PrivacySecurityHub() {
  const [settings, setSettings] = useState<PrivacyState>(DEFAULT_STATE)
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([])
  const [blockedSearch, setBlockedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  const loadSettings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/settings/privacy', { credentials: 'include' })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Failed to load privacy settings')
        return
      }
      const d = data.data
      setSettings({
        privateAccount: Boolean(d.privateAccount),
        profileVisibility: d.profileVisibility || 'public',
        messageFrom: d.messageFrom || 'everyone',
        allowTagging: Boolean(d.allowTagging),
        messageRequests: Boolean(d.messageRequests),
        showActivity: Boolean(d.showActivity),
        showOnlineStatus: Boolean(d.showOnlineStatus),
        locationSharing: Boolean(d.locationSharing),
        searchIndexing: Boolean(d.searchIndexing),
      })
      setBlockedUsers(d.blockedUsers || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load privacy settings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const persist = async (patch: Partial<PrivacyState>) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    setSaving(true)
    setSaveMessage('')
    setError('')
    try {
      const res = await fetch('/api/settings/privacy', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.message || 'Failed to save')
        await loadSettings()
        return
      }
      const d = data.data
      setSettings({
        privateAccount: Boolean(d.privateAccount),
        profileVisibility: d.profileVisibility || next.profileVisibility,
        messageFrom: d.messageFrom || next.messageFrom,
        allowTagging: Boolean(d.allowTagging),
        messageRequests: Boolean(d.messageRequests),
        showActivity: Boolean(d.showActivity),
        showOnlineStatus: Boolean(d.showOnlineStatus),
        locationSharing: Boolean(d.locationSharing),
        searchIndexing: Boolean(d.searchIndexing),
      })
      setSaveMessage('Saved')
      setTimeout(() => setSaveMessage(''), 1500)
    } catch (err) {
      console.error(err)
      setError('Failed to save privacy settings')
      await loadSettings()
    } finally {
      setSaving(false)
    }
  }

  const handleUnblock = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/block`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setBlockedUsers((prev) => prev.filter((u) => u.id !== userId))
      } else {
        setError(data.message || 'Failed to unblock')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to unblock user')
    }
  }

  const filteredBlocked = blockedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(blockedSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(blockedSearch.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {(error || saveMessage || saving) && (
        <div
          className={cn(
            'rounded-lg border px-4 py-2 text-sm',
            error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-green-200 bg-green-50 text-green-700',
          )}
        >
          {error || (saving ? 'Saving…' : saveMessage)}
        </div>
      )}

      <Card title="Privacy & Security" icon={Shield}>
        <Row
          label="Private account"
          description="Only approved followers can see your posts and profile."
        >
          <ToggleSwitch
            checked={settings.privateAccount}
            disabled={saving}
            onChange={(v) => persist({ privateAccount: v })}
          />
        </Row>

        <Row label="Profile visibility" description="Who can view your full profile.">
          <select
            value={settings.profileVisibility}
            disabled={saving}
            onChange={(e) => persist({ profileVisibility: e.target.value })}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <option value="public">Public</option>
            <option value="friends">Friends only</option>
            <option value="private">Only me</option>
          </select>
        </Row>

        <Row label="Who can message you" description="Control incoming direct messages.">
          <select
            value={settings.messageFrom}
            disabled={saving}
            onChange={(e) => persist({ messageFrom: e.target.value })}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <option value="everyone">Everyone</option>
            <option value="friends">Friends only</option>
            <option value="nobody">Nobody</option>
          </select>
        </Row>

        <Row label="Allow tagging" description="Let others tag you in posts and comments.">
          <ToggleSwitch
            checked={settings.allowTagging}
            disabled={saving}
            onChange={(v) => persist({ allowTagging: v })}
          />
        </Row>

        <Row
          label="Message requests"
          description="Receive messages from people you do not follow."
        >
          <ToggleSwitch
            checked={settings.messageRequests}
            disabled={saving}
            onChange={(v) => persist({ messageRequests: v })}
          />
        </Row>

        <Row
          label="Activity status"
          description="Show when you were last active on the platform."
        >
          <ToggleSwitch
            checked={settings.showActivity}
            disabled={saving}
            onChange={(v) => persist({ showActivity: v })}
          />
        </Row>

        <Row label="Online status" description="Show a green dot when you are online.">
          <ToggleSwitch
            checked={settings.showOnlineStatus}
            disabled={saving}
            onChange={(v) => persist({ showOnlineStatus: v })}
          />
        </Row>

        <Row
          label="Location in posts"
          description="Attach location data when you create new posts."
        >
          <ToggleSwitch
            checked={settings.locationSharing}
            disabled={saving}
            onChange={(v) => persist({ locationSharing: v })}
          />
        </Row>

        <Row
          label="Search engine indexing"
          description="Allow search engines to link to your public profile."
        >
          <ToggleSwitch
            checked={settings.searchIndexing}
            disabled={saving}
            onChange={(v) => persist({ searchIndexing: v })}
          />
        </Row>
      </Card>

      <Card title="Blocked accounts" icon={UserX}>
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={blockedSearch}
              onChange={(e) => setBlockedSearch(e.target.value)}
              placeholder="Search blocked users..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {filteredBlocked.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              {blockedUsers.length === 0
                ? 'You have not blocked anyone yet.'
                : 'No blocked accounts match your search.'}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredBlocked.map((user) => (
                <li key={user.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={user.avatar || '/images/default-avatar.svg'}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">{user.name}</p>
                      <p className="truncate text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnblock(user.id)}
                    className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Unblock
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Card title="Your data" icon={Download}>
        <Row
          label="Download your data"
          description="Get a copy of your posts, messages, and profile information."
        >
          <button
            type="button"
            onClick={() =>
              setSaveMessage('Data download will be available soon. Your settings are already saved.')
            }
            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            Request download
          </button>
        </Row>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Globe, label: 'Public posts', on: settings.profileVisibility === 'public' },
          { icon: Users, label: 'Friends', on: settings.profileVisibility === 'friends' },
          { icon: Lock, label: 'Private mode', on: settings.privateAccount },
          { icon: EyeOff, label: 'Hidden activity', on: !settings.showActivity },
        ].map(({ icon: Icon, label, on }) => (
          <div
            key={label}
            className={cn(
              'flex flex-col items-center rounded-lg border p-3 text-center text-xs',
              on
                ? 'border-primary-200 bg-primary-50 text-primary-800'
                : 'border-gray-200 bg-white text-gray-500',
            )}
          >
            <Icon className="mb-1 h-5 w-5" />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
