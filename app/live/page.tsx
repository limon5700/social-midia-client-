'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  Heart,
  ThumbsUp,
  MessageCircle,
  Share2,
  Users,
  Eye,
  Clock,
  Calendar,
  Plus,
  Send,
  Smile,
  Gift,
  Crown,
  Star,
  Zap,
  Sparkles,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MoreHorizontal,
  Flag,
  UserPlus,
  Bell,
  BellOff,
  ChevronDown,
  ChevronUp,
  Radio,
  Wifi,
  WifiOff
} from 'lucide-react'
import { users } from '@/data/mockData'

interface LiveStream {
  id: string
  title: string
  streamer: typeof users[0]
  isLive: boolean
  viewerCount: number
  startedAt: Date
  scheduledFor?: Date
  thumbnail?: string
  description: string
  category: string
}

interface ChatMessage {
  id: string
  user: typeof users[0]
  message: string
  timestamp: Date
  isModerator?: boolean
  isSubscriber?: boolean
  isGift?: boolean
}

interface Reaction {
  id: string
  type: 'heart' | 'thumbsUp' | 'fire' | 'sparkles' | 'zap'
  count: number
  userCount: number
}

export default function LiveStreamPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(50)
  const [showChat, setShowChat] = useState(true)
  const [chatMessage, setChatMessage] = useState('')
  const [showReactions, setShowReactions] = useState(false)
  const [isLive, setIsLive] = useState(true)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showGoLive, setShowGoLive] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isNotified, setIsNotified] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  // Mock live stream data
  const [liveStream] = useState<LiveStream>({
    id: '1',
    title: 'Late Night Gaming Session 🎮',
    streamer: users[0],
    isLive: true,
    viewerCount: 1247,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    description: 'Playing some awesome games tonight! Join the fun and let\'s have a great time together. Don\'t forget to like and subscribe! 🎮🔥',
    category: 'Gaming'
  })

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: users[1],
      message: 'Great stream tonight! 🔥',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isSubscriber: true
    },
    {
      id: '2',
      user: users[2],
      message: 'Love the energy! Keep it up!',
      timestamp: new Date(Date.now() - 4 * 60 * 1000)
    },
    {
      id: '3',
      user: users[3],
      message: 'What game are we playing next?',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      isModerator: true
    },
    {
      id: '4',
      user: users[0],
      message: 'Thanks everyone for watching! ❤️',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isModerator: true
    }
  ])

  // Mock reactions
  const [reactions, setReactions] = useState<Reaction[]>([
    { id: '1', type: 'heart', count: 1247, userCount: 89 },
    { id: '2', type: 'thumbsUp', count: 892, userCount: 67 },
    { id: '3', type: 'fire', count: 456, userCount: 34 },
    { id: '4', type: 'sparkles', count: 234, userCount: 23 },
    { id: '5', type: 'zap', count: 123, userCount: 12 }
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update viewer count
      const change = Math.floor(Math.random() * 10) - 5
      liveStream.viewerCount = Math.max(0, liveStream.viewerCount + change)
      
      // Add random chat messages
      if (Math.random() < 0.3) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          user: users[Math.floor(Math.random() * users.length)],
          message: ['Amazing!', 'Love this!', 'Keep going!', '🔥🔥🔥', 'Great content!', 'Subscribed!', 'Awesome stream!', 'Can\'t wait for more!', 'You\'re killing it!', 'Best streamer ever!'][Math.floor(Math.random() * 10)],
          timestamp: new Date(),
          isSubscriber: Math.random() < 0.3,
          isModerator: Math.random() < 0.1
        }
        setChatMessages(prev => [...prev, newMessage])
      }
      
      // Update reactions
      setReactions(prev => prev.map(reaction => ({
        ...reaction,
        count: reaction.count + Math.floor(Math.random() * 5),
        userCount: reaction.userCount + Math.floor(Math.random() * 2)
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [liveStream])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: users[0], // Current user
        message: chatMessage,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, newMessage])
      setChatMessage('')
    }
  }

  const handleReaction = (type: Reaction['type']) => {
    setReactions(prev => prev.map(reaction => 
      reaction.type === type 
        ? { ...reaction, count: reaction.count + 1, userCount: reaction.userCount + 1 }
        : reaction
    ))
    setShowReactions(false)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatDuration = (startedAt: Date) => {
    const now = new Date()
    const diff = now.getTime() - startedAt.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const formatViewerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-3">
              <div className="bg-black rounded-xl overflow-hidden relative">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  className="w-full aspect-video bg-black"
                  poster="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop"
                  autoPlay
                  muted={isMuted}
                >
                  <source src="/sample-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Live Indicator */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                    <Eye className="h-3 w-3" />
                    <span>{formatViewerCount(liveStream.viewerCount)} watching</span>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlay}
                        className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors duration-200"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors duration-200"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="w-20 h-1 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs">{volume}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors duration-200">
                        <Maximize className="h-5 w-5" />
                      </button>
                      <button className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors duration-200">
                        <Settings className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stream Info */}
              <div className="mt-4 bg-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-white mb-2">{liveStream.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                      <span>{formatViewerCount(liveStream.viewerCount)} viewers</span>
                      <span>•</span>
                      <span>Live for {formatDuration(liveStream.startedAt)}</span>
                      <span>•</span>
                      <span>{liveStream.category}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{liveStream.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setIsSubscribed(!isSubscribed)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        isSubscribed
                          ? 'bg-gray-600 text-white'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </button>
                    <button
                      onClick={() => setIsNotified(!isNotified)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                    >
                      {isNotified ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Streamer Info */}
              <div className="mt-4 bg-gray-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={liveStream.streamer.avatar}
                    alt={liveStream.streamer.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{liveStream.streamer.name}</h3>
                    <p className="text-sm text-gray-400">Live Streamer</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors duration-200">
                      Follow
                    </button>
                    <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl h-[600px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">Live Chat</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowChat(!showChat)}
                        className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {showChat ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                {showChat && (
                  <>
                    <div
                      ref={chatRef}
                      className="flex-1 overflow-y-auto p-4 space-y-3"
                    >
                      {chatMessages.map((message) => (
                        <div key={message.id} className="flex space-x-2">
                          <img
                            src={message.user.avatar}
                            alt={message.user.name}
                            className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-white">{message.user.name}</span>
                              {message.isModerator && (
                                <Crown className="h-3 w-3 text-yellow-500" />
                              )}
                              {message.isSubscriber && (
                                <Star className="h-3 w-3 text-purple-500" />
                              )}
                              {message.isGift && (
                                <Gift className="h-3 w-3 text-pink-500" />
                              )}
                              <span className="text-xs text-gray-400">
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-700">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => setShowReactions(!showReactions)}
                          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                        >
                          <Smile className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleSendMessage}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Reactions */}
              <div className="mt-4 bg-gray-800 rounded-xl p-4">
                <h3 className="font-medium text-white mb-3">Reactions</h3>
                <div className="grid grid-cols-5 gap-2">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction.id}
                      onClick={() => handleReaction(reaction.type)}
                      className="flex flex-col items-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                    >
                      <div className="text-lg mb-1">
                        {reaction.type === 'heart' && '❤️'}
                        {reaction.type === 'thumbsUp' && '👍'}
                        {reaction.type === 'fire' && '🔥'}
                        {reaction.type === 'sparkles' && '✨'}
                        {reaction.type === 'zap' && '⚡'}
                      </div>
                      <span className="text-xs text-gray-300">{reaction.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 bg-gray-800 rounded-xl p-4">
                <h3 className="font-medium text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm">Share Stream</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                    <Flag className="h-4 w-4" />
                    <span className="text-sm">Report</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                    <UserPlus className="h-4 w-4" />
                    <span className="text-sm">Invite Friends</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Go Live & Schedule Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Go Live */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Go Live</h3>
                <button
                  onClick={() => setShowGoLive(!showGoLive)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  {showGoLive ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
              
              {showGoLive && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors duration-200">
                      <Radio className="h-4 w-4" />
                      <span>Start Streaming</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200">
                      <Settings className="h-4 w-4" />
                      <span>Stream Settings</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Start your own live stream and connect with your audience in real-time.
                  </p>
                </div>
              )}
            </div>

            {/* Schedule Live Streams */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Scheduled Streams</h3>
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  {showSchedule ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
              
              {showSchedule && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors duration-200">
                      <Calendar className="h-4 w-4" />
                      <span>Schedule Stream</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200">
                      <Clock className="h-4 w-4" />
                      <span>View Schedule</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Schedule your next live stream and notify your followers in advance.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 