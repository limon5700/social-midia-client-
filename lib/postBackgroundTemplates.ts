import type { CSSProperties } from 'react'

export type PostBackgroundType = 'color' | 'gradient' | 'wallpaper'

export interface PostBackgroundStyle {
  id: string
  type: PostBackgroundType
  gradient: string
  imageUrl?: string
  textColor: string
  label?: string
}

export interface ColorOption {
  id: string
  label: string
  value: string
  type: 'color' | 'gradient'
  textColor: string
  previewClass?: string
}

export interface WallpaperOption {
  id: string
  label: string
  imageUrl: string
  textColor: string
}

export const POST_SOLID_COLORS: ColorOption[] = [
  { id: 'solid-white', label: 'White', value: '#ffffff', type: 'color', textColor: 'text-gray-900' },
  { id: 'solid-black', label: 'Black', value: '#111827', type: 'color', textColor: 'text-white' },
  { id: 'solid-red', label: 'Red', value: '#ef4444', type: 'color', textColor: 'text-white' },
  { id: 'solid-orange', label: 'Orange', value: '#f97316', type: 'color', textColor: 'text-white' },
  { id: 'solid-amber', label: 'Amber', value: '#f59e0b', type: 'color', textColor: 'text-gray-900' },
  { id: 'solid-yellow', label: 'Yellow', value: '#eab308', type: 'color', textColor: 'text-gray-900' },
  { id: 'solid-lime', label: 'Lime', value: '#84cc16', type: 'color', textColor: 'text-gray-900' },
  { id: 'solid-green', label: 'Green', value: '#22c55e', type: 'color', textColor: 'text-white' },
  { id: 'solid-teal', label: 'Teal', value: '#14b8a6', type: 'color', textColor: 'text-white' },
  { id: 'solid-cyan', label: 'Cyan', value: '#06b6d4', type: 'color', textColor: 'text-white' },
  { id: 'solid-blue', label: 'Blue', value: '#3b82f6', type: 'color', textColor: 'text-white' },
  { id: 'solid-indigo', label: 'Indigo', value: '#6366f1', type: 'color', textColor: 'text-white' },
  { id: 'solid-purple', label: 'Purple', value: '#a855f7', type: 'color', textColor: 'text-white' },
  { id: 'solid-pink', label: 'Pink', value: '#ec4899', type: 'color', textColor: 'text-white' },
  { id: 'solid-rose', label: 'Rose', value: '#f43f5e', type: 'color', textColor: 'text-white' },
  { id: 'solid-slate', label: 'Slate', value: '#64748b', type: 'color', textColor: 'text-white' },
]

export const POST_GRADIENT_COLORS: ColorOption[] = [
  {
    id: 'gradient-ocean',
    label: 'Ocean',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    type: 'gradient',
    textColor: 'text-white',
    previewClass: 'bg-gradient-to-br from-indigo-500 to-purple-700',
  },
  {
    id: 'gradient-sunset',
    label: 'Sunset',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    type: 'gradient',
    textColor: 'text-white',
    previewClass: 'bg-gradient-to-br from-pink-400 to-rose-500',
  },
  {
    id: 'gradient-forest',
    label: 'Forest',
    value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    type: 'gradient',
    textColor: 'text-white',
    previewClass: 'bg-gradient-to-br from-teal-600 to-green-400',
  },
  {
    id: 'gradient-midnight',
    label: 'Midnight',
    value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    type: 'gradient',
    textColor: 'text-white',
    previewClass: 'bg-gradient-to-br from-slate-900 to-cyan-900',
  },
  {
    id: 'gradient-warm',
    label: 'Warm',
    value: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 50%, #ff99ac 100%)',
    type: 'gradient',
    textColor: 'text-white',
    previewClass: 'bg-gradient-to-br from-orange-400 to-pink-400',
  },
  {
    id: 'gradient-sky',
    label: 'Sky',
    value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    type: 'gradient',
    textColor: 'text-gray-900',
    previewClass: 'bg-gradient-to-br from-cyan-200 to-blue-400',
  },
  {
    id: 'gradient-berry',
    label: 'Berry',
    value: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    type: 'gradient',
    textColor: 'text-white',
    previewClass: 'bg-gradient-to-br from-purple-500 to-pink-400',
  },
  {
    id: 'gradient-fire',
    label: 'Fire',
    value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    type: 'gradient',
    textColor: 'text-white',
    previewClass: 'bg-gradient-to-br from-red-600 to-yellow-500',
  },
]

export const POST_WALLPAPERS: WallpaperOption[] = [
  {
    id: 'wp-mountains',
    label: 'Mountains',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-beach',
    label: 'Beach',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-forest',
    label: 'Forest',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-city',
    label: 'City',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-stars',
    label: 'Stars',
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-flowers',
    label: 'Flowers',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-desert',
    label: 'Desert',
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-ocean',
    label: 'Ocean',
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-aurora',
    label: 'Aurora',
    imageUrl: 'https://images.unsplash.com/photo-1531366937137-7a568e371e9c?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-abstract',
    label: 'Abstract',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4a853?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-rain',
    label: 'Rain',
    imageUrl: 'https://images.unsplash.com/photo-1428597721931-65d404322042?w=800&q=80',
    textColor: 'text-white',
  },
  {
    id: 'wp-sunset',
    label: 'Sunset',
    imageUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80',
    textColor: 'text-white',
  },
]

export const ALL_COLOR_OPTIONS = [...POST_SOLID_COLORS, ...POST_GRADIENT_COLORS]

export function colorOptionToStyle(option: ColorOption): PostBackgroundStyle {
  return {
    id: option.id,
    type: option.type,
    gradient: option.value,
    textColor: option.textColor,
    label: option.label,
  }
}

export function wallpaperToStyle(option: WallpaperOption): PostBackgroundStyle {
  return {
    id: option.id,
    type: 'wallpaper',
    gradient: '',
    imageUrl: option.imageUrl,
    textColor: option.textColor,
    label: option.label,
  }
}

export function getBackgroundPreviewStyle(
  style: PostBackgroundStyle | null | undefined,
): CSSProperties {
  if (!style || style.id === 'none') return {}

  if (style.type === 'wallpaper' && style.imageUrl) {
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${style.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  return { background: style.gradient }
}

export function resolveBackgroundStyle(
  id: string | null | undefined,
  stored?: Partial<PostBackgroundStyle> | null,
): PostBackgroundStyle | null {
  if (!id || id === 'none') return null

  if (stored?.gradient || stored?.imageUrl) {
    return {
      id: stored.id || id,
      type: (stored.type as PostBackgroundType) || 'gradient',
      gradient: stored.gradient || '',
      imageUrl: stored.imageUrl,
      textColor: stored.textColor || 'text-white',
      label: stored.label,
    }
  }

  const color = ALL_COLOR_OPTIONS.find((c) => c.id === id)
  if (color) return colorOptionToStyle(color)

  const wallpaper = POST_WALLPAPERS.find((w) => w.id === id)
  if (wallpaper) return wallpaperToStyle(wallpaper)

  return null
}

/** @deprecated use resolveBackgroundStyle */
export function getBackgroundTemplate(id: string | null | undefined) {
  return resolveBackgroundStyle(id)
}
