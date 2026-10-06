'use client'

import { useRef } from 'react'
import { Camera, Loader2, ImageIcon } from 'lucide-react'

interface ProfileCoverProps {
  coverPhoto?: string
  avatar: string
  name: string
  canEdit?: boolean
  uploadingCover?: boolean
  onCoverChange?: (file: File) => void
  onAvatarClick?: () => void
}

export default function ProfileCover({
  coverPhoto,
  avatar,
  name,
  canEdit = false,
  uploadingCover = false,
  onCoverChange,
  onAvatarClick,
}: ProfileCoverProps) {
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onCoverChange) {
      onCoverChange(file)
    }
    e.target.value = ''
  }

  return (
    <div className="w-full">
      {/* Cover photo */}
      <div className="relative h-36 sm:h-44 md:h-52 w-full overflow-hidden bg-gray-100">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={`${name} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600" />
        )}

        {canEdit && (
          <>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/60 text-white text-xs sm:text-sm rounded-lg backdrop-blur-sm transition-colors disabled:opacity-60"
            >
              {uploadingCover ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {coverPhoto ? 'Change Cover' : 'Add Cover'}
              </span>
              <span className="sm:hidden">
                {coverPhoto ? 'Cover' : 'Add'}
              </span>
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleCoverSelect}
            />
          </>
        )}

        {!coverPhoto && !canEdit && (
          <div className="absolute inset-0 flex items-center justify-center text-white/40">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Avatar overlapping cover */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="relative -mt-12 sm:-mt-14 md:-mt-16 mb-4">
          <div className="relative inline-block">
            <img
              src={avatar}
              alt={name}
              className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
            />
            {canEdit && onAvatarClick && (
              <button
                type="button"
                onClick={onAvatarClick}
                className="absolute bottom-1 right-1 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors shadow-md"
                aria-label="Change profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
