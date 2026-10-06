import { User, MockFeedPost, Reel, Story, Notification, Hashtag, Advertisement, FriendSuggestion } from '@/types'

export const currentUser: User = {
  id: 'current-user',
  name: 'Alex Johnson',
  username: 'alexjohnson',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  bio: 'Digital creator & tech enthusiast 📱✨',
  followers: 12450,
  following: 892,
  isVerified: true,
  isOnline: true,
}

export const users: User[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    username: 'sarahwilson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Travel blogger & adventure seeker 🌍',
    followers: 8920,
    following: 456,
    isVerified: true,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Mike Chen',
    username: 'mikechen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Food photographer & chef 👨‍🍳',
    followers: 15670,
    following: 234,
    isVerified: true,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Emma Davis',
    username: 'emmadavis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Fitness coach & wellness advocate 💪',
    followers: 23450,
    following: 567,
    isVerified: true,
    isOnline: true,
  },
  {
    id: '4',
    name: 'David Kim',
    username: 'davidkim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Music producer & DJ 🎵',
    followers: 6780,
    following: 123,
    isVerified: false,
    isOnline: true,
  },
]

export const posts: MockFeedPost[] = [
  {
    id: '1',
    user: users[0],
    content: 'Just finished an amazing hike in the mountains! The views were absolutely breathtaking. 🏔️ #adventure #nature #hiking',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=600&h=400&fit=crop',
    ],
    likes: 1247,
    comments: 89,
    shares: 23,
    isLiked: true,
    isSaved: false,
    createdAt: new Date('2024-01-15T08:00:00Z'), // Static timestamp
    location: 'Rocky Mountains, Colorado',
    hashtags: ['adventure', 'nature', 'hiking'],
  },
  {
    id: '2',
    user: users[1],
    content: 'Today\'s special: Homemade ramen with fresh ingredients! The broth took 8 hours to make, but it was totally worth it. 🍜',
    images: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop',
    ],
    likes: 892,
    comments: 45,
    shares: 12,
    isLiked: false,
    isSaved: true,
    createdAt: new Date('2024-01-15T06:00:00Z'), // Static timestamp
    hashtags: ['food', 'ramen', 'homemade'],
  },
  {
    id: '3',
    user: users[2],
    content: 'Morning workout complete! 💪 Remember, consistency is key. What\'s your fitness goal for this week?',
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    likes: 2156,
    comments: 123,
    shares: 45,
    isLiked: true,
    isSaved: false,
    createdAt: new Date('2024-01-15T04:00:00Z'), // Static timestamp
    hashtags: ['fitness', 'workout', 'motivation'],
  },
  {
    id: '4',
    user: users[3],
    content: 'New track dropping soon! 🎵 Can\'t wait to share this one with you all. #music #newrelease',
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    ],
    likes: 567,
    comments: 34,
    shares: 8,
    isLiked: false,
    isSaved: false,
    createdAt: new Date('2024-01-15T02:00:00Z'), // Static timestamp
    hashtags: ['music', 'newrelease', 'artist'],
  },
  {
    id: '5',
    user: currentUser,
    content: 'Just launched my new website! Check it out and let me know what you think. 🚀 #webdev #portfolio',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    ],
    likes: 789,
    comments: 56,
    shares: 23,
    isLiked: false,
    isSaved: true,
    createdAt: new Date('2024-01-15T01:00:00Z'), // Static timestamp
    hashtags: ['webdev', 'portfolio', 'launch'],
  },
  {
    id: '6',
    user: users[0],
    content: 'Sunset vibes at the beach today 🌅 Perfect end to a perfect day! #sunset #beach #peaceful',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    ],
    likes: 1456,
    comments: 78,
    shares: 34,
    isLiked: true,
    isSaved: false,
    createdAt: new Date('2024-01-14T22:00:00Z'), // Static timestamp
    hashtags: ['sunset', 'beach', 'peaceful'],
  },
  {
    id: '7',
    user: users[1],
    content: 'Cooking class today! Teaching everyone how to make the perfect pasta from scratch 🍝 #cooking #pasta #class',
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop',
    ],
    likes: 923,
    comments: 67,
    shares: 19,
    isLiked: false,
    isSaved: true,
    createdAt: new Date('2024-01-14T20:00:00Z'), // Static timestamp
    hashtags: ['cooking', 'pasta', 'class'],
  },
  {
    id: '8',
    user: users[2],
    content: 'Yoga session in the park this morning 🧘‍♀️ Nothing beats starting the day with some mindfulness #yoga #mindfulness #morning',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
    ],
    likes: 678,
    comments: 45,
    shares: 12,
    isLiked: true,
    isSaved: false,
    createdAt: new Date('2024-01-14T18:00:00Z'), // Static timestamp
    hashtags: ['yoga', 'mindfulness', 'morning'],
  },
  {
    id: '9',
    user: users[3],
    content: 'Studio session today! Working on some new beats 🎧 #studio #music #producer',
    images: [
      'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=600&h=400&fit=crop',
    ],
    likes: 445,
    comments: 23,
    shares: 7,
    isLiked: false,
    isSaved: false,
    createdAt: new Date('2024-01-14T16:00:00Z'), // Static timestamp
    hashtags: ['studio', 'music', 'producer'],
  },
  {
    id: '10',
    user: currentUser,
    content: 'Coffee and coding ☕️ Perfect combination for a productive day! #coding #coffee #productivity',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
    ],
    likes: 567,
    comments: 34,
    shares: 15,
    isLiked: true,
    isSaved: false,
    createdAt: new Date('2024-01-14T14:00:00Z'), // Static timestamp
    hashtags: ['coding', 'coffee', 'productivity'],
  },
]

export const reels: Reel[] = [
  {
    id: '1',
    user: users[0],
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    caption: 'Amazing sunset timelapse! 🌅 #sunset #timelapse #nature',
    likes: 2340,
    comments: 156,
    shares: 89,
    views: 12500,
    isLiked: true,
    createdAt: new Date('2024-01-15T09:00:00Z'), // Static timestamp
    duration: 15,
    music: 'Sunset Vibes - Chill Beats',
  },
  {
    id: '2',
    user: users[1],
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    caption: 'Cooking tutorial: Perfect pasta! 🍝 #cooking #pasta #tutorial',
    likes: 1890,
    comments: 123,
    shares: 67,
    views: 8900,
    isLiked: false,
    createdAt: new Date('2024-01-15T07:00:00Z'), // Static timestamp
    duration: 30,
    music: 'Kitchen Sounds - Cooking Music',
  },
  {
    id: '3',
    user: users[2],
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    caption: 'Quick workout routine 💪 #fitness #workout #routine',
    likes: 3456,
    comments: 234,
    shares: 123,
    views: 18700,
    isLiked: true,
    createdAt: new Date('2024-01-15T05:00:00Z'), // Static timestamp
    duration: 45,
    music: 'Workout Mix - Energy Boost',
  },
  {
    id: '4',
    user: users[3],
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    caption: 'New beat preview 🎵 #music #beat #preview',
    likes: 1234,
    comments: 89,
    shares: 45,
    views: 6700,
    isLiked: false,
    createdAt: new Date('2024-01-15T03:00:00Z'), // Static timestamp
    duration: 20,
    music: 'Original Beat - David Kim',
  },
]

export const stories: Story[] = [
  {
    id: '1',
    user: users[0],
    media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    type: 'image',
    isViewed: false,
    createdAt: new Date('2024-01-15T10:30:00Z'), // Static timestamp
  },
  {
    id: '2',
    user: users[1],
    media: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=600&fit=crop',
    type: 'image',
    isViewed: true,
    createdAt: new Date('2024-01-15T10:15:00Z'), // Static timestamp
  },
  {
    id: '3',
    user: users[2],
    media: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    type: 'video',
    isViewed: false,
    createdAt: new Date('2024-01-15T10:00:00Z'), // Static timestamp
    duration: 15,
  },
]

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: users[0],
    content: 'liked your post',
    postId: '1',
    isRead: false,
    createdAt: new Date('2024-01-15T10:50:00Z'), // Static timestamp
  },
  {
    id: '2',
    type: 'comment',
    user: users[1],
    content: 'commented: "Amazing shot! Where is this?"',
    postId: '1',
    isRead: false,
    createdAt: new Date('2024-01-15T10:35:00Z'), // Static timestamp
  },
  {
    id: '3',
    type: 'follow',
    user: users[2],
    content: 'started following you',
    isRead: true,
    createdAt: new Date('2024-01-15T08:00:00Z'), // Static timestamp
  },
]

export const hashtags: Hashtag[] = [
  { id: '1', name: '#adventure', posts: 125000, isTrending: true },
  { id: '2', name: '#food', posts: 890000, isTrending: true },
  { id: '3', name: '#fitness', posts: 567000, isTrending: false },
  { id: '4', name: '#nature', posts: 234000, isTrending: true },
  { id: '5', name: '#travel', posts: 456000, isTrending: false },
  { id: '6', name: '#music', posts: 123000, isTrending: false },
]

export const advertisements: Advertisement[] = [
  {
    id: '1',
    title: 'Premium Fitness App',
    description: 'Get personalized workout plans and track your progress',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    link: '#',
    sponsor: 'FitLife Pro',
  },
  {
    id: '2',
    title: 'Travel Deals',
    description: 'Save up to 50% on your next adventure',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop',
    link: '#',
    sponsor: 'Wanderlust Travel',
  },
]

export const friendSuggestions: FriendSuggestion[] = [
  {
    user: {
      id: '5',
      name: 'Lisa Park',
      username: 'lisapark',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Art director & creative designer 🎨',
      followers: 8900,
      following: 234,
      isVerified: false,
      isOnline: false,
    },
    mutualFriends: 12,
    reason: 'Followed by 12 people you know',
  },
  {
    user: {
      id: '6',
      name: 'Tom Anderson',
      username: 'tomanderson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Software engineer & tech blogger 💻',
      followers: 5670,
      following: 123,
      isVerified: true,
      isOnline: true,
    },
    mutualFriends: 8,
    reason: 'Followed by 8 people you know',
  },
]

// Messages data
export const conversations = [
  {
    id: 'conv-1',
    participants: [currentUser, users[0]],
    lastMessage: {
      id: 'msg-1',
      sender: users[0],
      content: 'Hey! How was your weekend? 😊',
      type: 'text',
      isRead: true,
      createdAt: new Date('2024-01-15T10:45:00Z'), // Static timestamp
    },
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        sender: users[0],
        content: 'Hey! How was your weekend? 😊',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T10:45:00Z'),
      },
      {
        id: 'msg-2',
        sender: currentUser,
        content: 'It was amazing! Went hiking in the mountains 🏔️',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T10:40:00Z'),
      },
      {
        id: 'msg-3',
        sender: users[0],
        content: 'That sounds incredible! I need to plan a trip there soon',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T10:35:00Z'),
      },
      {
        id: 'msg-4',
        sender: currentUser,
        content: 'You definitely should! The views are breathtaking',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T10:30:00Z'),
      },
    ],
  },
  {
    id: 'conv-2',
    participants: [currentUser, users[1]],
    lastMessage: {
      id: 'msg-5',
      sender: users[1],
      content: 'Check out this new recipe I tried! 🍜',
      type: 'text',
      isRead: false,
      createdAt: new Date('2024-01-15T10:25:00Z'), // Static timestamp
    },
    unreadCount: 1,
    messages: [
      {
        id: 'msg-5',
        sender: users[1],
        content: 'Check out this new recipe I tried! 🍜',
        type: 'text',
        isRead: false,
        createdAt: new Date('2024-01-15T10:25:00Z'),
      },
      {
        id: 'msg-6',
        sender: currentUser,
        content: 'That looks delicious! Can you share the recipe?',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T10:20:00Z'),
      },
      {
        id: 'msg-7',
        sender: users[1],
        content: 'Of course! I\'ll send it to you later',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T10:15:00Z'),
      },
    ],
  },
  {
    id: 'conv-3',
    participants: [currentUser, users[2]],
    lastMessage: {
      id: 'msg-8',
      sender: currentUser,
      content: 'Thanks for the workout tips! 💪',
      type: 'text',
      isRead: true,
      createdAt: new Date('2024-01-15T10:10:00Z'), // Static timestamp
    },
    unreadCount: 0,
    messages: [
      {
        id: 'msg-8',
        sender: currentUser,
        content: 'Thanks for the workout tips! 💪',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T10:10:00Z'),
      },
      {
        id: 'msg-9',
        sender: users[2],
        content: 'You\'re welcome! Keep up the great work',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T10:05:00Z'),
      },
      {
        id: 'msg-10',
        sender: currentUser,
        content: 'I\'ve been following your routine and feeling stronger already',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T10:00:00Z'),
      },
    ],
  },
  {
    id: 'conv-4',
    participants: [currentUser, users[3]],
    lastMessage: {
      id: 'msg-11',
      sender: users[3],
      content: 'New track dropping next week! 🎵',
      type: 'text',
      isRead: false,
      createdAt: new Date('2024-01-15T08:00:00Z'), // Static timestamp
    },
    unreadCount: 2,
    messages: [
      {
        id: 'msg-11',
        sender: users[3],
        content: 'New track dropping next week! 🎵',
        type: 'text',
        isRead: false,
        createdAt: new Date('2024-01-15T08:00:00Z'),
      },
      {
        id: 'msg-12',
        sender: users[3],
        content: 'Can\'t wait for you to hear it!',
        type: 'text',
        isRead: false,
        createdAt: new Date('2024-01-15T07:55:00Z'),
      },
      {
        id: 'msg-13',
        sender: currentUser,
        content: 'Excited to hear it! Your last track was fire 🔥',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T07:50:00Z'),
      },
    ],
  },
  {
    id: 'conv-5',
    participants: [currentUser, {
      id: '5',
      name: 'Lisa Park',
      username: 'lisapark',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      bio: 'Art director & creative designer 🎨',
      followers: 8900,
      following: 234,
      isVerified: false,
      isOnline: true,
    }],
    lastMessage: {
      id: 'msg-14',
      sender: currentUser,
      content: 'Love your latest artwork! 🎨',
      type: 'text',
      isRead: true,
      createdAt: new Date('2024-01-15T04:00:00Z'), // Static timestamp
    },
    unreadCount: 0,
    messages: [
      {
        id: 'msg-14',
        sender: currentUser,
        content: 'Love your latest artwork! 🎨',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T04:00:00Z'),
      },
      {
        id: 'msg-15',
        sender: {
          id: '5',
          name: 'Lisa Park',
          username: 'lisapark',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          bio: 'Art director & creative designer 🎨',
          followers: 8900,
          following: 234,
          isVerified: false,
          isOnline: true,
        },
        content: 'Thank you so much! It took me weeks to complete',
        type: 'text',
        isRead: true,
        createdAt: new Date('2024-01-15T03:55:00Z'),
      },
    ],
  },
]

// Explore page data
export const explorePosts = [
  {
    id: 'explore-1',
    type: 'photos' as const,
    media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
    caption: 'Mountain adventure! 🏔️ #nature #hiking #adventure',
    user: {
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    likes: 1247,
    comments: 89,
  },
  {
    id: 'explore-2',
    type: 'videos' as const,
    media: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    caption: 'Cooking process: From ingredients to masterpiece 👨‍🍳',
    user: {
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    likes: 892,
    comments: 45,
    isVideo: true,
  },
  {
    id: 'explore-3',
    type: 'reels' as const,
    media: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
    caption: 'Morning workout complete! 💪 #fitness #workout',
    user: {
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    likes: 2156,
    comments: 156,
  },
  {
    id: 'explore-4',
    type: 'trending' as const,
    media: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop',
    caption: 'Travel vibes ✈️ #travel #wanderlust #adventure',
    user: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    likes: 3456,
    comments: 234,
  },
  {
    id: 'explore-5',
    type: 'photos' as const,
    media: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=500&fit=crop',
    caption: 'Homemade ramen with fresh ingredients! 🍜 #food #cooking',
    user: {
      name: 'Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    likes: 2789,
    comments: 167,
  },
  {
    id: 'explore-6',
    type: 'videos' as const,
    media: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    caption: 'Quick ab workout you can do anywhere! 💪',
    user: {
      name: 'Tom Anderson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    likes: 4567,
    comments: 289,
    isVideo: true,
  },
  {
    id: 'explore-7',
    type: 'reels' as const,
    media: 'https://images.unsplash.com/photo-1464822759844-d150baec0134?w=400&h=600&fit=crop',
    caption: 'Sunset vibes 🌅 #sunset #nature #peaceful',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    likes: 1890,
    comments: 123,
  },
  {
    id: 'explore-8',
    type: 'trending' as const,
    media: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    caption: 'New track dropping next week! 🎵 #music #newmusic',
    user: {
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    likes: 567,
    comments: 34,
  },
  {
    id: 'explore-9',
    type: 'photos' as const,
    media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    caption: 'Art studio vibes 🎨 #art #creative #design',
    user: {
      name: 'Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    likes: 1234,
    comments: 78,
  },
  {
    id: 'explore-10',
    type: 'videos' as const,
    media: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    caption: 'Tech setup tour 💻 #tech #setup #desk',
    user: {
      name: 'Tom Anderson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    likes: 890,
    comments: 56,
    isVideo: true,
  },
  {
    id: 'explore-11',
    type: 'reels' as const,
    media: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=500&fit=crop',
    caption: 'Coffee and coding ☕ #coffee #coding #morning',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    likes: 2345,
    comments: 145,
  },
  {
    id: 'explore-12',
    type: 'trending' as const,
    media: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop',
    caption: 'Weekend brunch 🥞 #brunch #food #weekend',
    user: {
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    likes: 1789,
    comments: 98,
  },
] 