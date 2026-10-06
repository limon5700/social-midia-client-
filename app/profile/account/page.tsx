'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import NextLink from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { AccountNavItem } from '@/components/navigation/AccountNavMenuPanel'
import {
  PROFILE_ACCOUNT_NAV_ITEMS,
  SETTINGS_ACCOUNT_NAV_ITEMS,
} from '@/components/navigation/AccountNavMenuPanel'
import { cn } from '@/lib/utils'

function LinkSection({ title, items, pathname }: { title: string; items: AccountNavItem[]; pathname: string }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
        {title}
      </h2>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden shadow-sm">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <NextLink
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors',
                active && 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
              )}
            >
              <Icon className="h-5 w-5 shrink-0 text-gray-600 dark:text-gray-400" />
              <span>{item.label}</span>
            </NextLink>
          )
        })}
      </div>
    </section>
  )
}

export default function ProfileAccountHubPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-8 pb-24 lg:pb-8">
        <NextLink
          href="/profile"
          className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          Back to profile
        </NextLink>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Notifications, saved content, privacy, and other shortcuts.
        </p>

        <LinkSection title="Your activity & content" items={PROFILE_ACCOUNT_NAV_ITEMS} pathname={pathname} />
        <LinkSection title="Settings & legal" items={SETTINGS_ACCOUNT_NAV_ITEMS} pathname={pathname} />
      </div>
    </div>
  )
}
