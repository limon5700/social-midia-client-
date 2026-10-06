'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AtSign, UserPlus, X, Palette } from 'lucide-react'
import {
  getBackgroundPreviewStyle,
  type PostBackgroundStyle,
} from '@/lib/postBackgroundTemplates'
import PostBackgroundPickerModal from './PostBackgroundPickerModal'

export interface PostTaggedUser {
  id: string
  username: string
  firstName: string
  lastName: string
  avatar: string
}

interface UserSearchResult {
  id: string
  username: string
  firstName: string
  lastName: string
  avatar: string
}

interface CreatePostPeopleAndStyleProps {
  content: string
  onContentChange: (value: string) => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  taggedUsers: PostTaggedUser[]
  onTaggedUsersChange: (users: PostTaggedUser[]) => void
  hasMedia: boolean
  backgroundStyle: PostBackgroundStyle | null
  onBackgroundChange: (style: PostBackgroundStyle | null) => void
  headerActionsRef?: React.RefObject<HTMLDivElement | null>
}

async function searchUsers(query: string): Promise<UserSearchResult[]> {
  if (!query.trim()) {
    const response = await fetch('/api/friends/suggestions?limit=8', {
      credentials: 'include',
    })
    const data = await response.json()
    if (!data.success) return []
    const users = data.data?.users || data.users || []
    return users.map((u: Record<string, string>) => ({
      id: u.id || u._id,
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      avatar: u.avatar,
    }))
  }

  const response = await fetch(
    `/api/friends/suggestions?search=${encodeURIComponent(query)}&limit=8`,
    { credentials: 'include' },
  )
  const data = await response.json()
  if (!data.success) return []

  const users = data.data?.users || data.users || []
  return users.map((u: Record<string, string>) => ({
    id: u.id || u._id,
    username: u.username,
    firstName: u.firstName,
    lastName: u.lastName,
    avatar: u.avatar,
  }))
}

export default function CreatePostPeopleAndStyle({
  content,
  onContentChange,
  textareaRef,
  taggedUsers,
  onTaggedUsersChange,
  hasMedia,
  backgroundStyle,
  onBackgroundChange,
  headerActionsRef,
}: CreatePostPeopleAndStyleProps) {
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionResults, setMentionResults] = useState<UserSearchResult[]>([])
  const [showMentionList, setShowMentionList] = useState(false)
  const [tagSearch, setTagSearch] = useState('')
  const [tagResults, setTagResults] = useState<UserSearchResult[]>([])
  const [showTagPanel, setShowTagPanel] = useState(false)
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false)
  const [loadingMentions, setLoadingMentions] = useState(false)
  const [headerActionsReady, setHeaderActionsReady] = useState(false)
  const mentionDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tagDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isTextOnly = !hasMedia
  const useStyledPreview = isTextOnly && backgroundStyle !== null
  const previewStyle = getBackgroundPreviewStyle(backgroundStyle)

  const detectMentionQuery = useCallback((text: string, cursor: number) => {
    const before = text.slice(0, cursor)
    const match = before.match(/@([a-zA-Z0-9_]*)$/)
    if (!match) {
      setShowMentionList(false)
      setMentionQuery('')
      return
    }
    setMentionQuery(match[1])
    setShowMentionList(true)
  }, [])

  const handleContentChange = (value: string) => {
    onContentChange(value)
    const cursor = textareaRef.current?.selectionStart ?? value.length
    detectMentionQuery(value, cursor)
  }

  useLayoutEffect(() => {
    setHeaderActionsReady(!!headerActionsRef?.current)
  }, [headerActionsRef])

  useEffect(() => {
    if (hasMedia) {
      setShowBackgroundPicker(false)
    }
  }, [hasMedia])

  useEffect(() => {
    if (!showMentionList) return

    if (mentionDebounceRef.current) clearTimeout(mentionDebounceRef.current)
    mentionDebounceRef.current = setTimeout(async () => {
      setLoadingMentions(true)
      try {
        const results = await searchUsers(mentionQuery)
        setMentionResults(results)
      } finally {
        setLoadingMentions(false)
      }
    }, 250)

    return () => {
      if (mentionDebounceRef.current) clearTimeout(mentionDebounceRef.current)
    }
  }, [mentionQuery, showMentionList])

  useEffect(() => {
    if (!showTagPanel) return

    if (tagDebounceRef.current) clearTimeout(tagDebounceRef.current)
    tagDebounceRef.current = setTimeout(async () => {
      const results = await searchUsers(tagSearch)
      setTagResults(results)
    }, 250)

    return () => {
      if (tagDebounceRef.current) clearTimeout(tagDebounceRef.current)
    }
  }, [tagSearch, showTagPanel])

  const insertMention = (user: UserSearchResult) => {
    const cursor = textareaRef.current?.selectionStart ?? content.length
    const before = content.slice(0, cursor)
    const after = content.slice(cursor)
    const replaced = before.replace(/@([a-zA-Z0-9_]*)$/, `@${user.username} `)
    onContentChange(replaced + after)
    setShowMentionList(false)
    setMentionQuery('')
    textareaRef.current?.focus()
  }

  const addTaggedUser = (user: UserSearchResult) => {
    if (taggedUsers.some((t) => t.id === user.id)) return

    const next: PostTaggedUser = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    }
    onTaggedUsersChange([...taggedUsers, next])

    if (!content.includes(`@${user.username}`)) {
      const prefix = content.trim() ? `${content.trim()} ` : ''
      onContentChange(`${prefix}@${user.username} `)
    }

    setTagSearch('')
    setShowTagPanel(false)
  }

  const removeTaggedUser = (id: string) => {
    onTaggedUsersChange(taggedUsers.filter((u) => u.id !== id))
  }

  const openTagPanel = () => {
    setShowTagPanel((prev) => !prev)
    setShowMentionList(false)
    if (!showTagPanel) {
      searchUsers('').then(setTagResults)
    }
  }

  const triggerMention = () => {
    const cursor = textareaRef.current?.selectionStart ?? content.length
    const next = `${content.slice(0, cursor)}@${content.slice(cursor)}`
    onContentChange(next)
    setShowMentionList(true)
    setMentionQuery('')
    textareaRef.current?.focus()
    searchUsers('').then(setMentionResults)
  }

  const renderPaletteTrigger = () => {
    if (!isTextOnly) return null

    return (
      <button
        type="button"
        onClick={() => setShowBackgroundPicker(true)}
        className="absolute bottom-3 right-3 z-10"
        aria-label="Choose background"
      >
        {!backgroundStyle ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-gray-200 bg-white shadow-sm text-gray-500 hover:border-gray-300 hover:bg-gray-50">
            <Palette className="h-4 w-4" />
          </span>
        ) : backgroundStyle.type === 'wallpaper' && backgroundStyle.imageUrl ? (
          <span className="block h-9 w-9 rounded-lg border-2 border-white/80 shadow-md overflow-hidden">
            <img
              src={backgroundStyle.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </span>
        ) : (
          <span
            className="block h-9 w-9 rounded-lg border-2 border-white/80 shadow-md"
            style={
              backgroundStyle.type === 'color'
                ? { backgroundColor: backgroundStyle.gradient }
                : { background: backgroundStyle.gradient }
            }
          />
        )}
      </button>
    )
  }

  const textareaClassName = useStyledPreview
    ? `w-full bg-transparent border-none outline-none resize-none text-center text-xl sm:text-2xl font-semibold placeholder:opacity-70 min-h-[120px] ${backgroundStyle?.textColor || 'text-white'}`
    : 'w-full p-4 pb-12 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg'

  const headerActionButtons = (
    <>
      <button
        type="button"
        onClick={triggerMention}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 whitespace-nowrap"
      >
        <AtSign className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Mention</span>
      </button>
      <button
        type="button"
        onClick={openTagPanel}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm rounded-lg border whitespace-nowrap ${
          showTagPanel
            ? 'border-blue-300 bg-blue-50 text-blue-700'
            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <UserPlus className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Tag people</span>
      </button>
    </>
  )

  return (
    <div className="space-y-4">
      {headerActionsReady &&
        headerActionsRef?.current &&
        createPortal(headerActionButtons, headerActionsRef.current)}

      {taggedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {taggedUsers.map((user) => (
            <span
              key={user.id}
              className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-blue-50 text-blue-800 text-sm border border-blue-100"
            >
              <img
                src={user.avatar || '/images/default-avatar.svg'}
                alt=""
                className="h-6 w-6 rounded-full object-cover"
              />
              <span>@{user.username}</span>
              <button
                type="button"
                onClick={() => removeTaggedUser(user.id)}
                className="p-0.5 hover:bg-blue-100 rounded-full"
                aria-label={`Remove tag ${user.username}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        {useStyledPreview ? (
          <div
            className="relative rounded-xl min-h-[160px] flex items-center justify-center p-6 pb-12 transition-all"
            style={previewStyle}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onClick={(e) =>
                detectMentionQuery(
                  e.currentTarget.value,
                  e.currentTarget.selectionStart ?? 0,
                )
              }
              onKeyUp={(e) =>
                detectMentionQuery(
                  e.currentTarget.value,
                  e.currentTarget.selectionStart ?? 0,
                )
              }
              placeholder="What's on your mind?"
              className={textareaClassName}
              rows={4}
              maxLength={1000}
            />
            {renderPaletteTrigger()}
          </div>
        ) : (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onClick={(e) =>
                detectMentionQuery(
                  e.currentTarget.value,
                  e.currentTarget.selectionStart ?? 0,
                )
              }
              onKeyUp={(e) =>
                detectMentionQuery(
                  e.currentTarget.value,
                  e.currentTarget.selectionStart ?? 0,
                )
              }
              placeholder="What's on your mind?"
              className={textareaClassName}
              rows={4}
              maxLength={1000}
            />
            {renderPaletteTrigger()}
          </div>
        )}

        {showMentionList && (
          <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {loadingMentions ? (
              <p className="p-3 text-sm text-gray-500">Searching...</p>
            ) : mentionResults.length === 0 ? (
              <p className="p-3 text-sm text-gray-500">No users found</p>
            ) : (
              mentionResults.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => insertMention(user)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                >
                  <img
                    src={user.avatar || '/images/default-avatar.svg'}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <PostBackgroundPickerModal
        isOpen={showBackgroundPicker}
        onClose={() => setShowBackgroundPicker(false)}
        selected={backgroundStyle}
        onSelect={onBackgroundChange}
      />

      <div className="text-sm text-gray-500">{content.length}/1000 characters</div>

      {showTagPanel && (
        <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          <input
            type="text"
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            placeholder="Search people to tag..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="max-h-40 overflow-y-auto space-y-1">
            {tagResults.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => addTaggedUser(user)}
                disabled={taggedUsers.some((t) => t.id === user.id)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white disabled:opacity-50 text-left"
              >
                <img
                  src={user.avatar || '/images/default-avatar.svg'}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
