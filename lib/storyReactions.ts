export type StoryReactionType = 'love' | 'care' | 'wow' | 'angry' | 'haha'

export interface StoryReactionCounts {
  love: number
  care: number
  wow: number
  angry: number
  haha: number
}

export const STORY_REACTIONS: {
  type: StoryReactionType
  emoji: string
  label: string
}[] = [
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'care', emoji: '🤗', label: 'Care' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'angry', emoji: '😠', label: 'Angry' },
  { type: 'haha', emoji: '😂', label: 'Haha' },
]

export const EMPTY_REACTION_COUNTS: StoryReactionCounts = {
  love: 0,
  care: 0,
  wow: 0,
  angry: 0,
  haha: 0,
}
