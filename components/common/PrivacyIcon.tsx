import { Globe, Users, UserPlus, Lock } from 'lucide-react'

export type PrivacyLevel = 'public' | 'friends' | 'friends_of_friends' | 'private'

const privacyConfig: Record<
  PrivacyLevel,
  { icon: typeof Globe; label: string }
> = {
  public: { icon: Globe, label: 'Public' },
  friends: { icon: Users, label: 'Friends only' },
  friends_of_friends: { icon: UserPlus, label: 'Friends of friends' },
  private: { icon: Lock, label: 'Private' },
}

interface PrivacyIconProps {
  privacy?: PrivacyLevel | string | null
  className?: string
  size?: 'sm' | 'md'
}

export default function PrivacyIcon({
  privacy = 'public',
  className = '',
  size = 'sm',
}: PrivacyIconProps) {
  const key = (privacy as PrivacyLevel) in privacyConfig ? (privacy as PrivacyLevel) : 'public'
  const { icon: Icon, label } = privacyConfig[key]
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <span title={label} aria-label={label} className="inline-flex shrink-0">
      <Icon className={`${sizeClass} ${className}`} />
    </span>
  )
}
