'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Home,
  UserPlus,
  Users,
  Gift,
  ChevronRight,
  Settings,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

type FriendsSection = 'home' | 'requests' | 'suggestions' | 'all' | 'birthdays'

interface FriendUser {
  id: string
  firstName: string
  lastName: string
  username: string
  avatar: string
  bio?: string
}

interface SuggestionItem {
  id: string
  user: {
    id: string
    name: string
    username: string
    avatar: string
    bio?: string
  }
  mutualFriends: number
  reason: string
}

interface FriendRequestItem {
  id: string
  user: FriendUser
  mutualFriends: number
}

const DEFAULT_AVATAR = '/images/default-avatar.svg'

function displayName(user: { firstName?: string; lastName?: string; name?: string }) {
  if (user.name) return user.name
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User'
}

function normalizeFriend(raw: Record<string, unknown>): FriendUser {
  return {
    id: String(raw.id ?? raw._id ?? ''),
    firstName: String(raw.firstName ?? ''),
    lastName: String(raw.lastName ?? ''),
    username: String(raw.username ?? ''),
    avatar: String(raw.avatar || DEFAULT_AVATAR),
    bio: raw.bio ? String(raw.bio) : '',
  }
}

function getCurrentUserId(user: { id?: string; _id?: string } | null): string | null {
  if (!user) return null
  const id = user.id ?? user._id
  return id ? String(id) : null
}

function isSelfUser(candidateId: string, currentUserId: string | null): boolean {
  if (!currentUserId || !candidateId) return false
  return String(candidateId) === String(currentUserId)
}

function filterOutSelf<T extends { user?: { id: string }; id?: string }>(
  items: T[],
  currentUserId: string | null,
): T[] {
  if (!currentUserId) return items
  return items.filter((item) => {
    const id = item.user?.id ?? item.id ?? ''
    return !isSelfUser(id, currentUserId)
  })
}

export default function FriendsPage() {
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const currentUserId = getCurrentUserId(currentUser)
  const [section, setSection] = useState<FriendsSection>('home')
  const [friends, setFriends] = useState<FriendUser[]>([])
  const [requests, setRequests] = useState<FriendRequestItem[]>([])
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, authLoading, router])

  const fetchFriends = useCallback(async () => {
    const response = await fetch('/api/friends/list')
    const data = await response.json()
    if (data.success) {
      const list = (data.data.friends || []).map(normalizeFriend)
      setFriends(
        currentUserId ? list.filter((f: FriendUser) => !isSelfUser(f.id, currentUserId)) : list,
      )
    }
  }, [currentUserId])

  const fetchSuggestions = useCallback(async () => {
    const response = await fetch('/api/friends/suggestions?limit=24')
    const data = await response.json()
    if (data.success) {
      setSuggestions(filterOutSelf(data.data.suggestions || [], currentUserId))
    }
  }, [currentUserId])

  const fetchPendingRequests = useCallback(async () => {
    const response = await fetch('/api/follow/requests?status=pending')
    const data = await response.json()
    if (data.success && data.data.followRequests?.length) {
      setRequests(
        data.data.followRequests.map((item: Record<string, unknown>) => ({
          id: String(item.id ?? item._id ?? ''),
          user: normalizeFriend((item.user ?? item.requester ?? {}) as Record<string, unknown>),
          mutualFriends: Number(item.mutualFriends ?? 0),
        })),
      )
      return
    }

    const profileRes = await fetch('/api/auth/me')
    const profileData = await profileRes.json()
    if (!profileData.success) return

    const meRes = await fetch('/api/friends/list')
    const meData = await meRes.json()
    const friendIds = new Set(
      (meData.data?.friends || []).map((f: FriendUser) => f.id),
    )

    const followers = profileData.data?.user?.followers || []
    const pending = followers
      .filter((f: Record<string, unknown>) => {
        const id = String(f.id ?? f._id ?? '')
        return !friendIds.has(id) && !isSelfUser(id, currentUserId)
      })
      .map((f: Record<string, unknown>) => ({
        id: String(f.id ?? f._id ?? ''),
        user: normalizeFriend(f),
        mutualFriends: 0,
      }))

    setRequests(pending)
  }, [currentUserId])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      await Promise.all([fetchFriends(), fetchSuggestions(), fetchPendingRequests()])
    } catch {
      setError('Failed to load friends data')
    } finally {
      setIsLoading(false)
    }
  }, [fetchFriends, fetchSuggestions, fetchPendingRequests])

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadData()
    }
  }, [isAuthenticated, authLoading, currentUserId, loadData])

  const handleConfirmRequest = async (request: FriendRequestItem) => {
    try {
      await fetch('/api/friends/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: request.user.id }),
      })
      setRequests((prev) => prev.filter((r) => r.id !== request.id))
      fetchFriends()
    } catch {
      setError('Could not confirm request')
    }
  }

  const handleDeleteRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId))
  }

  const handleAddSuggestion = async (userId: string) => {
    try {
      await fetch('/api/friends/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId }),
      })
      setSuggestions((prev) => prev.filter((s) => s.user.id !== userId))
      fetchFriends()
    } catch {
      setError('Could not add friend')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const navItems: {
    id: FriendsSection
    label: string
    icon: typeof Home
    chevron?: boolean
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'requests', label: 'Friend requests', icon: UserPlus, chevron: true },
    { id: 'suggestions', label: 'Suggestions', icon: UserPlus, chevron: true },
    { id: 'all', label: 'All friends', icon: Users, chevron: true },
    { id: 'birthdays', label: 'Birthdays', icon: Gift },
  ]

  const previewRequests = section === 'home' ? requests.slice(0, 8) : requests
  const previewSuggestions = section === 'home' ? suggestions.slice(0, 8) : suggestions

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 lg:py-6">
        {/* Mobile section tabs */}
        <div className="lg:hidden bg-white rounded-lg shadow-sm p-3 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Friends</h1>
            <Link
              href="/settings"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              aria-label="Friends settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = section === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Desktop left nav */}
          <aside className="hidden lg:block w-full lg:w-[360px] shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <div className="flex items-center justify-between mb-2 px-2">
                <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
                <Link
                  href="/settings"
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                  aria-label="Friends settings"
                >
                  <Settings className="h-5 w-5" />
                </Link>
              </div>

              <nav className="mt-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = section === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSection(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-left transition-colors',
                        isActive ? 'bg-gray-100' : 'hover:bg-gray-50',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                          isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span
                        className={cn(
                          'flex-1 text-[15px]',
                          isActive ? 'font-semibold text-gray-900' : 'font-medium text-gray-800',
                        )}
                      >
                        {item.label}
                      </span>
                      {item.chevron && (
                        <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {(section === 'home' || section === 'requests') && (
                  <section className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h2 className="text-xl font-bold text-gray-900">Friend Requests</h2>
                      {section === 'home' && requests.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSection('requests')}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          See all
                        </button>
                      )}
                    </div>

                    {previewRequests.length === 0 ? (
                      <EmptyBlock
                        title="No friend requests"
                        description="When someone sends you a request, it will show up here."
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {previewRequests.map((request) => (
                          <RequestCard
                            key={request.id}
                            user={request.user}
                            onConfirm={() => handleConfirmRequest(request)}
                            onDelete={() => handleDeleteRequest(request.id)}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {(section === 'home' || section === 'suggestions') && (
                  <section className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h2 className="text-xl font-bold text-gray-900">People You May Know</h2>
                      {section === 'home' && suggestions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSection('suggestions')}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          See all
                        </button>
                      )}
                    </div>

                    {previewSuggestions.length === 0 ? (
                      <EmptyBlock
                        title="No suggestions right now"
                        description="We will show people you may know based on your network."
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {previewSuggestions.map((item) => (
                          <SuggestionCard
                            key={item.id}
                            user={item.user}
                            reason={item.reason}
                            onAdd={() => handleAddSuggestion(item.user.id)}
                            onDismiss={() =>
                              setSuggestions((prev) => prev.filter((s) => s.id !== item.id))
                            }
                          />
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {section === 'all' && (
                  <section className="bg-white rounded-lg shadow-sm p-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">
                      All friends ({friends.length})
                    </h2>
                    {friends.length === 0 ? (
                      <EmptyBlock
                        title="No friends yet"
                        description="Start connecting with people to build your friends list."
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {friends.map((friend) => (
                          <FriendCard key={friend.id} user={friend} />
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {section === 'birthdays' && (
                  <section className="bg-white rounded-lg shadow-sm p-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Birthdays</h2>
                    <EmptyBlock
                      title="No upcoming birthdays"
                      description="Friends' birthdays will appear here when available."
                    />
                  </section>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center py-12 px-4">
      <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  )
}

function RequestCard({
  user,
  onConfirm,
  onDelete,
}: {
  user: FriendUser
  onConfirm: () => void
  onDelete: () => void
}) {
  const name = displayName(user)
  const profileHref = user.username ? `/user/${user.username}` : '/profile'

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <Link href={profileHref} className="block">
        <img
          src={user.avatar || DEFAULT_AVATAR}
          alt={name}
          className="w-full aspect-square object-cover bg-gray-100"
        />
      </Link>
      <div className="p-3">
        <Link
          href={profileHref}
          className="block text-center font-semibold text-gray-900 text-[17px] hover:underline leading-snug"
        >
          {name}
        </Link>
        <button
          type="button"
          onClick={onConfirm}
          className="w-full mt-3 py-2 rounded-md bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold text-[15px] transition-colors"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="w-full mt-2 py-2 rounded-md bg-[#e4e6eb] hover:bg-[#d8dadf] text-gray-900 font-semibold text-[15px] transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function SuggestionCard({
  user,
  reason,
  onAdd,
  onDismiss,
}: {
  user: SuggestionItem['user']
  reason: string
  onAdd: () => void
  onDismiss: () => void
}) {
  const profileHref = user.username ? `/user/${user.username}` : '/profile'

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <Link href={profileHref} className="block">
        <img
          src={user.avatar || DEFAULT_AVATAR}
          alt={user.name}
          className="w-full aspect-square object-cover bg-gray-100"
        />
      </Link>
      <div className="p-3">
        <Link
          href={profileHref}
          className="block text-center font-semibold text-gray-900 text-[17px] hover:underline leading-snug"
        >
          {user.name}
        </Link>
        {reason && (
          <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2">{reason}</p>
        )}
        <button
          type="button"
          onClick={onAdd}
          className="w-full mt-3 py-2 rounded-md bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold text-[15px] transition-colors"
        >
          Add Friend
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="w-full mt-2 py-2 rounded-md bg-[#e4e6eb] hover:bg-[#d8dadf] text-gray-900 font-semibold text-[15px] transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

function FriendCard({ user }: { user: FriendUser }) {
  const name = displayName(user)
  const profileHref = user.username ? `/user/${user.username}` : '/profile'

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <Link href={profileHref} className="block">
        <img
          src={user.avatar || DEFAULT_AVATAR}
          alt={name}
          className="w-full aspect-square object-cover bg-gray-100"
        />
      </Link>
      <div className="p-3">
        <Link
          href={profileHref}
          className="block text-center font-semibold text-gray-900 text-[17px] hover:underline"
        >
          {name}
        </Link>
        <Link
          href="/messages"
          className="block w-full mt-3 py-2 rounded-md bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold text-[15px] text-center transition-colors"
        >
          Message
        </Link>
      </div>
    </div>
  )
}
