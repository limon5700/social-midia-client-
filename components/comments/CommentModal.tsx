'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, MessageCircle } from 'lucide-react'
import CommentSection from './CommentSection'

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  commentCount?: number
}

export default function CommentModal({
  isOpen,
  onClose,
  postId,
  commentCount,
}: CommentModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('comment-modal-open')

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('comment-modal-open')
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !postId || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-white flex flex-col h-[100dvh] max-h-[100dvh]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0 safe-top">
        <div className="flex items-center gap-2 min-w-0">
          <MessageCircle className="h-5 w-5 text-gray-700 shrink-0" />
          <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
          {commentCount !== undefined && (
            <span className="text-sm text-gray-500">({commentCount})</span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close comments"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <CommentSection postId={postId} fullScreen />
      </div>
    </div>,
    document.body,
  )
}
