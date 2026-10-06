'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Image, Video, Loader2, Send, Globe, Users, UserPlus, ChevronDown } from 'lucide-react'

type StoryPrivacy = 'public' | 'friends' | 'friends_of_friends'

const privacyOptions: {
  value: StoryPrivacy
  label: string
  icon: typeof Globe
  description: string
}[] = [
  { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can see this story' },
  { value: 'friends', label: 'Friends', icon: Users, description: 'Only your friends can see this story' },
  {
    value: 'friends_of_friends',
    label: 'Friends of friends',
    icon: UserPlus,
    description: 'Your friends and their friends can see this story',
  },
]

interface CreateStoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateStoryModal({ isOpen, onClose, onSuccess }: CreateStoryModalProps) {
  const [mounted, setMounted] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [privacy, setPrivacy] = useState<StoryPrivacy>('public')
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedPrivacy = privacyOptions.find((o) => o.value === privacy)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const resetForm = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setMediaFile(null)
    setMediaType(null)
    setError('')
    setIsSubmitting(false)
    setPrivacy('public')
    setShowPrivacyMenu(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      setError('Please select an image or video file')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File size must be less than 15MB')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setMediaFile(file)
    setMediaType(isImage ? 'image' : 'video')
    setPreviewUrl(URL.createObjectURL(file))
    setError('')
  }

  const handleSubmit = async () => {
    if (!mediaFile || !mediaType) {
      setError('Please select a photo or video')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('media', mediaFile)
      formData.append('mediaType', mediaType)
      formData.append('privacy', privacy)

      const response = await fetch('/api/stories/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        resetForm()
        onSuccess()
        onClose()
      } else {
        setError(data.message || 'Failed to post story')
      }
    } catch {
      setError('Failed to post story. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[120] bg-black flex flex-col h-[100dvh]">
      <div className="flex items-center justify-between px-4 py-3 shrink-0 safe-top">
        <h2 className="text-lg font-semibold text-white">Create Story</h2>
        <button
          type="button"
          onClick={handleClose}
          className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-4">
        {error && (
          <div className="w-full max-w-md mb-4 p-3 bg-red-500/20 border border-red-400/50 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {previewUrl ? (
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900">
            {mediaType === 'image' ? (
              <img src={previewUrl} alt="Story preview" className="w-full h-full object-cover" />
            ) : (
              <video src={previewUrl} className="w-full h-full object-cover" controls muted />
            )}
            <button
              type="button"
              onClick={resetForm}
              className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              aria-label="Remove media"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'image/*'
                  fileInputRef.current.click()
                }
              }}
              className="w-full flex items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-white/30 text-white hover:border-white/50 hover:bg-white/5 transition-colors"
            >
              <Image className="h-8 w-8" />
              <span className="font-medium">Add Photo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'video/*'
                  fileInputRef.current.click()
                }
              }}
              className="w-full flex items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-white/30 text-white hover:border-white/50 hover:bg-white/5 transition-colors"
            >
              <Video className="h-8 w-8" />
              <span className="font-medium">Add Video</span>
            </button>
            <p className="text-center text-sm text-white/50">Stories disappear after 24 hours</p>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="px-4 py-4 border-t border-white/10 shrink-0 safe-bottom space-y-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPrivacyMenu((prev) => !prev)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-2">
                {selectedPrivacy && <selectedPrivacy.icon className="h-4 w-4" />}
                <span className="text-sm font-medium">{selectedPrivacy?.label}</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${showPrivacyMenu ? 'rotate-180' : ''}`} />
            </button>

            {showPrivacyMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-10">
                {privacyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setPrivacy(option.value)
                      setShowPrivacyMenu(false)
                    }}
                    className={`w-full flex items-start gap-3 px-3 py-3 text-left hover:bg-white/10 transition-colors ${
                      privacy === option.value ? 'bg-white/10' : ''
                    }`}
                  >
                    <option.icon className="h-4 w-4 text-white/80 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white">{option.label}</div>
                      <div className="text-xs text-white/50">{option.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Share to Story
              </>
            )}
          </button>
        </div>
      )}
    </div>,
    document.body,
  )
}
