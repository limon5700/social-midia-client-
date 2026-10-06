'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Video, Users, User, Calendar, Users2, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

type NavItem = { icon: typeof LayoutDashboard; label: string; href: string }

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const displayName =
    user && (user.firstName || user.lastName)
      ? [user.firstName, user.lastName].filter(Boolean).join(' ')
      : 'Account'
  const subtitle = user?.email ?? ''

  const mainNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Video, label: 'Reels', href: '/reels' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: Users, label: 'Friends', href: '/friends' },
  ]

  const createNavItems: NavItem[] = [
    { icon: Calendar, label: 'Events', href: '/events' },
    { icon: Users2, label: 'Groups', href: '/groups' },
  ]

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        key={item.href}
        href={item.href}
        title={!isExpanded ? item.label : undefined}
        className={cn(
          'flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100',
          isExpanded ? 'px-3' : 'px-2 justify-center',
          isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
        )}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {isExpanded && <span className="truncate">{item.label}</span>}
      </Link>
    )
  }

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        'hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden',
        isExpanded ? 'w-60 z-50 shadow-xl' : 'w-16 z-40',
      )}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-6 overscroll-contain">
          <div>
            {isExpanded && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Main
              </h3>
            )}
            <div className="space-y-1">{mainNavItems.map(renderNavItem)}</div>
          </div>

          <div>
            {isExpanded && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Create
              </h3>
            )}
            <div className="space-y-1">{createNavItems.map(renderNavItem)}</div>
          </div>
        </nav>

        <div className="shrink-0 p-2 border-t border-gray-200 bg-white">
          <Link
            href="/profile"
            title={!isExpanded ? displayName : undefined}
            className={cn(
              'flex items-center rounded-lg hover:bg-gray-100 transition-colors',
              isExpanded ? 'gap-2 p-2' : 'justify-center p-2',
            )}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-8 h-8 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                {subtitle ? (
                  <p className="text-xs text-gray-500 truncate">{subtitle}</p>
                ) : null}
              </div>
            )}
          </Link>
        </div>
      </div>
    </aside>
  )
}
