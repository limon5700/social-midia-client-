'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Phone,
  Video,
  Image,
  File,
  MessageCircle,
  ArrowLeft,
  Loader2,
  Reply,
  X,
} from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const DEFAULT_AVATAR = '/images/default-avatar.svg'
const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '👍'] as const

interface FriendUser {
  id: string
  firstName: string
  lastName: string
  username: string
  avatar: string
}

type MessageStatus = 'sent' | 'delivered' | 'read'

interface MessageReaction {
  userId: string
  emoji: string
}

interface ReplyPreview {
  id: string
  content: string
  senderName: string
}

interface ChatMessage {
  id: string
  content: string
  createdAt: Date
  status: MessageStatus
  seenAt?: Date
  deliveredAt?: Date
  seenByAvatar?: string
  replyTo?: ReplyPreview
  reactions: MessageReaction[]
  sender: { id: string; firstName?: string; lastName?: string; username?: string; avatar?: string }
}

interface ConversationItem {
  friend: FriendUser
  conversationId?: string
  lastMessage?: { content: string; createdAt: Date }
  unreadCount: number
  messages: ChatMessage[]
}

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
  }
}

function formatExactTime(date: Date | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function statusLabel(status: MessageStatus): string {
  if (status === 'read') return 'Seen'
  if (status === 'delivered') return 'Delivered'
  return 'Sent'
}

function normalizeMessage(
  raw: Record<string, unknown>,
  _currentUserId: string,
  friendAvatar?: string,
): ChatMessage {
  const sender = (raw.sender ?? {}) as Record<string, unknown>
  const senderId = String(sender._id ?? sender.id ?? '')
  const status = (raw.status as MessageStatus) || 'sent'
  const seenByAvatar = raw.seenByAvatar
    ? String(raw.seenByAvatar)
    : status === 'read'
      ? friendAvatar
      : undefined

  const replyRaw = raw.replyTo as Record<string, unknown> | undefined
  const replyTo = replyRaw?.id
    ? {
        id: String(replyRaw.id),
        content: String(replyRaw.content ?? ''),
        senderName: String(replyRaw.senderName ?? 'User'),
      }
    : undefined

  const reactions = ((raw.reactions ?? []) as Array<Record<string, unknown>>).map((r) => ({
    userId: String(r.userId ?? ''),
    emoji: String(r.emoji ?? ''),
  }))

  return {
    id: String(raw.id ?? raw._id ?? ''),
    content: String(raw.content ?? ''),
    createdAt: new Date(String(raw.createdAt ?? Date.now())),
    status,
    seenAt: raw.seenAt ? new Date(String(raw.seenAt)) : undefined,
    deliveredAt: raw.deliveredAt ? new Date(String(raw.deliveredAt)) : undefined,
    seenByAvatar,
    replyTo,
    reactions,
    sender: {
      id: senderId,
      firstName: String(sender.firstName ?? ''),
      lastName: String(sender.lastName ?? ''),
      username: String(sender.username ?? ''),
      avatar: String(sender.avatar || DEFAULT_AVATAR),
    },
  }
}

function MessageStatusText({ status }: { status: MessageStatus }) {
  return (
    <span className="text-xs text-gray-500 capitalize">{statusLabel(status)}</span>
  )
}

export default function MessagesPage() {
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const currentUserId = currentUser?.id ? String(currentUser.id) : null

  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)

  const selectedConversation = conversations.find((c) => c.friend.id === selectedFriendId) ?? null

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, authLoading, router])

  const loadConversations = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [friendsRes, messagesRes] = await Promise.all([
        fetch('/api/friends/list'),
        fetch('/api/messages?type=direct'),
      ])

      const friendsData = await friendsRes.json()
      const messagesData = await messagesRes.json()

      if (!friendsData.success) {
        setError(friendsData.message || 'Failed to load friends')
        setConversations([])
        return
      }

      const friends: FriendUser[] = (friendsData.data?.friends || [])
        .map(normalizeFriend)
        .filter((f: FriendUser) => f.id && f.id !== currentUserId)

      const apiConversations = messagesData.success ? messagesData.data?.conversations || [] : []

      const merged: ConversationItem[] = friends.map((friend) => {
        const existing = apiConversations.find((conv: Record<string, unknown>) => {
          const others = (conv.otherParticipants || []) as Array<Record<string, unknown>>
          return others.some((p) => String(p._id ?? p.id) === friend.id)
        })

        const lastMsg = existing?.lastMessage as Record<string, unknown> | undefined

        return {
          friend,
          conversationId: existing ? String(existing.id ?? existing._id) : undefined,
          lastMessage: lastMsg?.content
            ? {
                content: String(lastMsg.content),
                createdAt: new Date(String(lastMsg.timestamp ?? lastMsg.createdAt ?? Date.now())),
              }
            : undefined,
          unreadCount: Number(existing?.unreadCount ?? 0),
          messages: [],
        }
      })

      setConversations(merged)
    } catch {
      setError('Failed to load conversations')
      setConversations([])
    } finally {
      setIsLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    if (isAuthenticated && !authLoading && currentUserId) {
      loadConversations()
    }
  }, [isAuthenticated, authLoading, currentUserId, loadConversations])

  const fetchMessages = useCallback(
    async (conversationId: string, friendId: string, friendAvatar?: string, silent = false) => {
      if (!silent) setIsLoadingMessages(true)
      try {
        const response = await fetch(`/api/messages/${conversationId}`)
        const data = await response.json()
        if (data.success && currentUserId) {
          const messages = (data.data?.messages || []).map((m: Record<string, unknown>) =>
            normalizeMessage(m, currentUserId, friendAvatar),
          )
          setConversations((prev) =>
            prev.map((conv) =>
              conv.friend.id === friendId ? { ...conv, messages } : conv,
            ),
          )
        }
      } catch {
        if (!silent) setError('Failed to load messages')
      } finally {
        if (!silent) setIsLoadingMessages(false)
      }
    },
    [currentUserId],
  )

  const ensureConversation = useCallback(async (friendId: string): Promise<string | null> => {
    const existing = conversations.find((c) => c.friend.id === friendId)
    if (existing?.conversationId) return existing.conversationId

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantIds: [friendId], type: 'direct' }),
      })
      const data = await response.json()
      if (data.success) {
        const conversationId = String(data.data.conversation.id ?? data.data.conversation._id)
        setConversations((prev) =>
          prev.map((conv) =>
            conv.friend.id === friendId ? { ...conv, conversationId } : conv,
          ),
        )
        return conversationId
      }
    } catch {
      setError('Could not start conversation')
    }
    return null
  }, [conversations])

  const handleSelectFriend = async (friendId: string) => {
    setSelectedFriendId(friendId)
    setMobileShowChat(true)
    setActiveMessageId(null)
    setReplyingTo(null)

    const conv = conversations.find((c) => c.friend.id === friendId)
    if (!conv) return

    let conversationId = conv.conversationId
    if (!conversationId) {
      conversationId = (await ensureConversation(friendId)) ?? undefined
    }

    if (conversationId) {
      await fetchMessages(conversationId, friendId, conv.friend.avatar)
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    const name = displayName(conv.friend).toLowerCase()
    const username = conv.friend.username.toLowerCase()
    const query = searchQuery.toLowerCase()
    return name.includes(query) || username.includes(query)
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages?.length])

  useEffect(() => {
    const conversationId = selectedConversation?.conversationId
    const friendId = selectedFriendId
    const friendAvatar = selectedConversation?.friend.avatar
    if (!conversationId || !friendId || isLoadingMessages) return

    const timer = setTimeout(async () => {
      try {
        await fetch(`/api/messages/${conversationId}`, { method: 'PUT' })
        await fetchMessages(conversationId, friendId, friendAvatar, true)
      } catch {
        /* silent */
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [
    selectedConversation?.conversationId,
    selectedFriendId,
    selectedConversation?.friend.avatar,
    isLoadingMessages,
    fetchMessages,
  ])

  useEffect(() => {
    const conversationId = selectedConversation?.conversationId
    const friendId = selectedFriendId
    const friendAvatar = selectedConversation?.friend.avatar
    if (!conversationId || !friendId) return

    const interval = setInterval(() => {
      fetchMessages(conversationId, friendId, friendAvatar, true)
    }, 4000)

    return () => clearInterval(interval)
  }, [
    selectedConversation?.conversationId,
    selectedFriendId,
    selectedConversation?.friend.avatar,
    fetchMessages,
  ])

  const updateMessageInState = (friendId: string, updated: ChatMessage) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.friend.id === friendId
          ? {
              ...conv,
              messages: conv.messages.map((m) => (m.id === updated.id ? updated : m)),
            }
          : conv,
      ),
    )
  }

  const handleReact = async (msg: ChatMessage, emoji: string) => {
    const conversationId = selectedConversation?.conversationId
    if (!conversationId || !selectedFriendId || !currentUserId) return

    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msg.id, emoji }),
      })
      const data = await response.json()
      if (data.success) {
        const updated = normalizeMessage(
          data.data.message,
          currentUserId,
          selectedConversation?.friend.avatar,
        )
        updateMessageInState(selectedFriendId, updated)
      }
    } catch {
      setError('Failed to react')
    }
  }

  const handleReply = (msg: ChatMessage) => {
    setReplyingTo(msg)
    setActiveMessageId(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedFriendId || !currentUserId || isSending) return

    setIsSending(true)
    const content = message.trim()
    const replyId = replyingTo?.id
    setMessage('')
    setShowEmojiPicker(false)
    setReplyingTo(null)

    try {
      let conversationId = selectedConversation?.conversationId
      if (!conversationId) {
        conversationId = (await ensureConversation(selectedFriendId)) ?? undefined
      }
      if (!conversationId) {
        setMessage(content)
        return
      }

      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, replyTo: replyId }),
      })
      const data = await response.json()

      if (data.success) {
        const newMsg = normalizeMessage(
          data.data.message,
          currentUserId,
          selectedConversation?.friend.avatar,
        )
        setConversations((prev) =>
          prev.map((conv) =>
            conv.friend.id === selectedFriendId
              ? {
                  ...conv,
                  conversationId,
                  messages: [...conv.messages, newMsg],
                  lastMessage: { content, createdAt: new Date() },
                }
              : conv,
          ),
        )
      } else {
        setMessage(content)
        setError(data.message || 'Failed to send message')
      }
    } catch {
      setMessage(content)
      setError('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] bg-white overflow-hidden">
        {error && (
          <div className="mx-4 mt-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex justify-between gap-2 shrink-0">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} className="shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex flex-1 min-h-0">
          <div
            className={`${
              mobileShowChat ? 'hidden' : 'flex'
            } lg:flex flex-col w-full lg:w-80 xl:w-96 bg-white border-r border-gray-200 pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0`}
          >
            <div className="p-3 sm:p-4 border-b border-gray-100">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-gray-700">No friends to message</p>
                  <p className="text-sm mt-1">Add friends first to start chatting.</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const isActive = selectedFriendId === conversation.friend.id

                  return (
                    <div
                      key={conversation.friend.id}
                      onClick={() => handleSelectFriend(conversation.friend.id)}
                      className={`flex items-center gap-3 p-3 sm:p-4 cursor-pointer transition-colors ${
                        isActive ? 'bg-primary-50 border-r-2 border-primary-500' : 'hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={conversation.friend.avatar}
                        alt={displayName(conversation.friend)}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {displayName(conversation.friend)}
                          </h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(conversation.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage?.content || 'No messages yet'}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div
            className={`${
              mobileShowChat ? 'flex' : 'hidden'
            } lg:flex flex-1 flex-col bg-white min-w-0 min-h-0 pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0`}
          >
            {selectedConversation ? (
              <>
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 gap-2 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileShowChat(false)
                        setActiveMessageId(null)
                      }}
                      className="lg:hidden p-2 -ml-1 text-gray-600 hover:bg-gray-100 rounded-lg shrink-0"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <img
                      src={selectedConversation.friend.avatar}
                      alt={displayName(selectedConversation.friend)}
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h2 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {displayName(selectedConversation.friend)}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        @{selectedConversation.friend.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" className="hidden sm:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button type="button" className="hidden sm:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Video className="h-5 w-5" />
                    </button>
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div
                  className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
                  onClick={() => setActiveMessageId(null)}
                >
                  {isLoadingMessages ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                    </div>
                  ) : selectedConversation.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <MessageCircle className="h-12 w-12 mb-3 text-gray-300" />
                      <p className="text-sm">No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    selectedConversation.messages.map((msg) => {
                      const isOwnMessage = msg.sender.id === currentUserId
                      const isActive = activeMessageId === msg.id
                      const reactionSummary = REACTION_EMOJIS.map((emoji) => ({
                        emoji,
                        count: msg.reactions.filter((r) => r.emoji === emoji).length,
                      })).filter((r) => r.count > 0)

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md relative ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            {msg.replyTo && (
                              <div
                                className={`mb-1 px-3 py-1.5 rounded-lg text-xs border-l-2 ${
                                  isOwnMessage
                                    ? 'bg-primary-400/30 border-white/70 text-white/90'
                                    : 'bg-gray-50 border-primary-400 text-gray-600'
                                }`}
                              >
                                <p className="font-medium truncate">{msg.replyTo.senderName}</p>
                                <p className="truncate opacity-80">{msg.replyTo.content}</p>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveMessageId(isActive ? null : msg.id)
                              }}
                              className={`w-full text-left px-4 py-2 rounded-2xl transition-shadow ${
                                isOwnMessage
                                  ? 'bg-primary-500 text-white rounded-br-md'
                                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
                              } ${isActive ? 'ring-2 ring-primary-300' : ''}`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            </button>

                            {reactionSummary.length > 0 && (
                              <div
                                className={`flex gap-1 mt-1 flex-wrap ${
                                  isOwnMessage ? 'justify-end' : 'justify-start'
                                }`}
                              >
                                {reactionSummary.map((r) => (
                                  <span
                                    key={r.emoji}
                                    className="inline-flex items-center gap-0.5 bg-white border border-gray-200 rounded-full px-1.5 py-0.5 text-xs shadow-sm"
                                  >
                                    {r.emoji}
                                    {r.count > 1 && (
                                      <span className="text-gray-500">{r.count}</span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            )}

                            {isActive && (
                              <div
                                className={`absolute z-20 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-lg p-3 ${
                                  isOwnMessage ? 'right-0' : 'left-0'
                                }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                                  <div className="flex justify-between gap-2">
                                    <span className="text-gray-400">Sent</span>
                                    <span className="text-right font-medium text-gray-800">
                                      {formatExactTime(msg.createdAt)}
                                    </span>
                                  </div>
                                  {msg.status === 'delivered' && msg.deliveredAt && (
                                    <div className="flex justify-between gap-2">
                                      <span className="text-gray-400">Delivered</span>
                                      <span className="text-right font-medium text-gray-800">
                                        {formatExactTime(msg.deliveredAt)}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex justify-between gap-2">
                                    <span className="text-gray-400">Seen</span>
                                    <span className="text-right font-medium text-gray-800">
                                      {msg.seenAt ? formatExactTime(msg.seenAt) : 'Not seen yet'}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex justify-between gap-1 mb-3 pb-3 border-b border-gray-100">
                                  {REACTION_EMOJIS.map((emoji) => {
                                    const mine = msg.reactions.some(
                                      (r) =>
                                        r.emoji === emoji &&
                                        r.userId === currentUserId,
                                    )
                                    return (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleReact(msg, emoji)}
                                        className={`text-lg p-1 rounded-lg hover:bg-gray-100 ${
                                          mine ? 'bg-primary-50 ring-1 ring-primary-300' : ''
                                        }`}
                                        title={emoji}
                                      >
                                        {emoji}
                                      </button>
                                    )
                                  })}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleReply(msg)}
                                  className="flex w-full items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                  <Reply className="h-4 w-4" />
                                  Reply
                                </button>
                              </div>
                            )}

                            <div
                              className={`flex items-center space-x-1.5 mt-1 ${
                                isOwnMessage ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(msg.createdAt)}
                              </span>
                              {isOwnMessage && <MessageStatusText status={msg.status} />}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {replyingTo && (
                  <div className="px-4 pt-3 flex items-start gap-2 border-t border-gray-100 bg-gray-50 shrink-0">
                    <div className="flex-1 min-w-0 border-l-2 border-primary-500 pl-3 py-1">
                      <p className="text-xs font-medium text-primary-600">
                        Replying to{' '}
                        {replyingTo.sender.id === currentUserId
                          ? 'yourself'
                          : displayName(replyingTo.sender)}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{replyingTo.content}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      aria-label="Cancel reply"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="p-3 sm:p-4 border-t border-gray-200 shrink-0">
                  <div className="flex items-end space-x-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>

                      {showAttachmentMenu && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors duration-200">
                            <Image className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Photo</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors duration-200">
                            <File className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Document</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={replyingTo ? 'Write a reply...' : 'Type a message...'}
                        rows={1}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                      />
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Smile className="h-5 w-5" />
                      </button>

                      {showEmojiPicker && (
                        <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                          <div className="grid grid-cols-5 gap-1">
                            {REACTION_EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  setMessage((prev) => prev + emoji)
                                  setShowEmojiPicker(false)
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200 text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isSending}
                      className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <MessageCircle className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a friend</h3>
                  <p className="text-gray-500">Choose a friend to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
