'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Ban } from 'lucide-react'
import {
  ALL_COLOR_OPTIONS,
  POST_WALLPAPERS,
  colorOptionToStyle,
  wallpaperToStyle,
  type PostBackgroundStyle,
} from '@/lib/postBackgroundTemplates'

interface PostBackgroundPickerModalProps {
  isOpen: boolean
  onClose: () => void
  selected: PostBackgroundStyle | null
  onSelect: (style: PostBackgroundStyle | null) => void
}

export default function PostBackgroundPickerModal({
  isOpen,
  onClose,
  selected,
  onSelect,
}: PostBackgroundPickerModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  const handleColorSelect = (option: (typeof ALL_COLOR_OPTIONS)[number]) => {
    onSelect(colorOptionToStyle(option))
    onClose()
  }

  const handleWallpaperSelect = (option: (typeof POST_WALLPAPERS)[number]) => {
    onSelect(wallpaperToStyle(option))
    onClose()
  }

  const handleClear = () => {
    onSelect(null)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[130] bg-white flex flex-col h-[100dvh]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0 safe-top">
        <h2 className="text-lg font-semibold text-gray-900">Choose Background</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 -mr-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          aria-label="Close background picker"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 sm:p-6 space-y-8 max-w-2xl mx-auto w-full">
          {/* Colors */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Colors</h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5">
              <button
                type="button"
                onClick={handleClear}
                title="No background"
                className={`aspect-square rounded-xl border-2 flex items-center justify-center bg-gray-50 transition-all ${
                  !selected
                    ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label="No background"
              >
                <Ban className="h-5 w-5 text-gray-400" />
              </button>

              {ALL_COLOR_OPTIONS.map((option) => {
                const isActive = selected?.id === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleColorSelect(option)}
                    title={option.label}
                    className={`aspect-square rounded-xl border-2 transition-all ${
                      option.previewClass || ''
                    } ${
                      isActive
                        ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                        : 'border-transparent hover:border-gray-300 hover:scale-105'
                    }`}
                    style={
                      option.type === 'color'
                        ? { backgroundColor: option.value }
                        : { background: option.value }
                    }
                    aria-label={option.label}
                  />
                )
              })}
            </div>
          </section>

          {/* Wallpapers */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Wallpapers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {POST_WALLPAPERS.map((wallpaper) => {
                const isActive = selected?.id === wallpaper.id
                return (
                  <button
                    key={wallpaper.id}
                    type="button"
                    onClick={() => handleWallpaperSelect(wallpaper)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                      isActive
                        ? 'border-blue-500 ring-2 ring-blue-200 scale-[1.02]'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    aria-label={wallpaper.label}
                  >
                    <img
                      src={wallpaper.imageUrl}
                      alt={wallpaper.label}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-xs font-medium text-white bg-gradient-to-t from-black/60 to-transparent">
                      {wallpaper.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  )
}
