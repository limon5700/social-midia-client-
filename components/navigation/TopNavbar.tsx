'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, Bell, MessageCircle, Settings } from 'lucide-react'
import SearchModal from '@/components/modals/SearchModal'

export default function TopNavbar() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 safe-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="hidden sm:inline text-lg sm:text-xl font-bold text-gray-900 truncate">
              SocialConnect
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                onClick={() => setIsSearchModalOpen(true)}
                readOnly
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <Link
              href="/notifications"
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                3
              </span>
            </Link>

            <Link
              href="/messages"
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Messages"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                2
              </span>
            </Link>

            <Link
              href="/profile/account"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Account settings"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </div>
        </div>
      </div>

      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </header>
  )
}
