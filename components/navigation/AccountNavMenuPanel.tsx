'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  User,
  Bell,
  Activity,
  Archive,
  FileText,
  FolderOpen,
  Clock,
  Flag,
  Gift,
  Settings,
  Shield,
  FileCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type AccountNavItem = { icon: LucideIcon; label: string; href: string }

export const PROFILE_ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: Activity, label: 'Activity Log', href: '/activity' },
  { icon: Archive, label: 'Archived Posts', href: '/archived' },
  { icon: FileText, label: 'Drafts', href: '/drafts' },
  { icon: FolderOpen, label: 'Collections', href: '/collections' },
  { icon: Clock, label: 'Saved', href: '/saved' },
  { icon: Flag, label: 'Reports', href: '/reports' },
  { icon: Gift, label: 'Referrals', href: '/referrals' },
]

export const SETTINGS_ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: Shield, label: 'Privacy & Security', href: '/settings?tab=privacy' },
  { icon: FileCheck, label: 'Terms & Privacy', href: '/legal' },
]

const linkClass =
  'flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'

function NavRows({
  items,
  pathname,
  onNavigate,
}: {
  items: AccountNavItem[]
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              linkClass,
              isActive && 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </>
  )
}

/** Shared account link lists (used by `/profile/account` and any compact menus). */
export function AccountNavMenuPanel({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string
  onNavigate?: () => void
  className?: string
}) {
  return (
    <div className={cn('py-1', className)}>
      <NavRows items={PROFILE_ACCOUNT_NAV_ITEMS} pathname={pathname} onNavigate={onNavigate} />
      <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
      <NavRows items={SETTINGS_ACCOUNT_NAV_ITEMS} pathname={pathname} onNavigate={onNavigate} />
    </div>
  )
}
