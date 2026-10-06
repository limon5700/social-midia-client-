'use client'

import { Story } from '@/types'
import { Play } from 'lucide-react'
import Link from 'next/link'

interface StoryCardProps {
  story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="flex-shrink-0">
      <Link href={`/profile/${story.user.id}`}>
      <div className="relative">
        <div className={`w-16 h-16 rounded-full p-0.5 ${
          story.isViewed 
            ? 'bg-gray-300' 
            : 'bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400'
        }`}>
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={story.media}
              alt={story.user.name}
              className="w-full h-full object-cover"
            />
            {story.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
            )}
          </div>
        </div>
        {story.isViewed && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-20" />
        )}
      </div>
        <p className="text-xs text-center mt-1 text-gray-600 truncate w-16 hover:text-gray-900">
        {story.user.name}
      </p>
      </Link>
    </div>
  )
} 