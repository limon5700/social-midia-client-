'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Video, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MobileNavbar() {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Video, label: 'Reels', href: '/reels' },
    { icon: MessageCircle, label: 'Chat', href: '/messages' },
    { icon: User, label: 'Profile', href: '/profile' },
  ]

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-[100] lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-1px_8px_rgba(0,0,0,0.06)] safe-bottom"
    >
      <div className="grid grid-cols-4 w-full">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 py-2 px-1 min-h-[3.25rem] transition-colors',
                isActive ? 'text-blue-600' : 'text-gray-600 active:text-gray-900',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                  isActive ? 'bg-blue-50' : 'bg-transparent',
                )}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
