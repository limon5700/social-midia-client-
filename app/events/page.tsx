'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Share2, 
  Bookmark,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit3,
  Trash2,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  Camera,
  Music,
  Gamepad2,
  Palette,
  Utensils,
  Plane,
  Dumbbell,
  GraduationCap,
  Laugh,
  Zap,
  Sparkles,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Tag,
  Hash,
  Award,
  Trophy,
  Gift,
  Crown,
  Settings,
  Download,
  Upload,
  RefreshCw,
  TrendingUp
} from 'lucide-react'
import { users } from '@/data/mockData'

interface Event {
  id: string
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  location: string
  address: string
  coordinates: { lat: number; lng: number }
  category: string
  organizer: typeof users[0]
  coverImage: string
  attendees: typeof users[0][]
  maxAttendees?: number
  isOnline: boolean
  onlineLink?: string
  price: number
  currency: string
  tags: string[]
  isPrivate: boolean
  isFeatured: boolean
  isUserCreated: boolean
  rsvpStatus: 'going' | 'maybe' | 'not_going' | null
  isBookmarked: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Tech Meetup 2024',
      description: 'Join us for an exciting evening of networking, tech talks, and innovation discussions. Meet fellow developers, entrepreneurs, and tech enthusiasts. Free food and drinks provided!',
      date: new Date('2024-04-15'),
      startTime: '18:00',
      endTime: '21:00',
      location: 'Tech Hub Downtown',
      address: '123 Innovation Street, Downtown, City',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      category: 'technology',
      organizer: users[0],
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=300&fit=crop',
      attendees: [users[0], users[1], users[2], users[3]],
      maxAttendees: 100,
      isOnline: false,
      price: 0,
      currency: 'USD',
      tags: ['Technology', 'Networking', 'Innovation'],
      isPrivate: false,
      isFeatured: true,
      isUserCreated: false,
      rsvpStatus: null,
      isBookmarked: false
    },
    {
      id: '2',
      title: 'Art Gallery Opening',
      description: 'Experience the latest contemporary art exhibition featuring local and international artists. Live music, refreshments, and guided tours available.',
      date: new Date('2024-04-20'),
      startTime: '19:00',
      endTime: '22:00',
      location: 'Modern Art Gallery',
      address: '456 Creative Avenue, Arts District',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      category: 'art',
      organizer: users[1],
      coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=300&fit=crop',
      attendees: [users[1], users[4], users[5]],
      maxAttendees: 50,
      isOnline: false,
      price: 25,
      currency: 'USD',
      tags: ['Art', 'Culture', 'Exhibition'],
      isPrivate: false,
      isFeatured: false,
      isUserCreated: true,
      rsvpStatus: 'going',
      isBookmarked: true
    },
    {
      id: '3',
      title: 'Virtual Gaming Tournament',
      description: 'Compete in our online gaming tournament! Multiple games, prizes, and fun for all skill levels. Join from anywhere in the world!',
      date: new Date('2024-04-25'),
      startTime: '14:00',
      endTime: '18:00',
      location: 'Online Event',
      address: 'Virtual Event',
      coordinates: { lat: 0, lng: 0 },
      category: 'gaming',
      organizer: users[2],
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=300&fit=crop',
      attendees: [users[2], users[6], users[7]],
      maxAttendees: 200,
      isOnline: true,
      onlineLink: 'https://zoom.us/j/123456789',
      price: 10,
      currency: 'USD',
      tags: ['Gaming', 'Tournament', 'Online'],
      isPrivate: false,
      isFeatured: true,
      isUserCreated: false,
      rsvpStatus: 'maybe',
      isBookmarked: false
    },
    {
      id: '4',
      title: 'Food Festival 2024',
      description: 'A celebration of local cuisine featuring food trucks, live cooking demonstrations, and tastings from the city\'s best restaurants.',
      date: new Date('2024-05-01'),
      startTime: '12:00',
      endTime: '20:00',
      location: 'Central Park',
      address: 'Central Park, New York, NY',
      coordinates: { lat: 40.7829, lng: -73.9654 },
      category: 'food',
      organizer: users[3],
      coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=300&fit=crop',
      attendees: [users[3], users[0], users[1], users[4], users[5]],
      maxAttendees: 500,
      isOnline: false,
      price: 15,
      currency: 'USD',
      tags: ['Food', 'Festival', 'Local'],
      isPrivate: false,
      isFeatured: false,
      isUserCreated: true,
      rsvpStatus: 'going',
      isBookmarked: true
    },
    {
      id: '5',
      title: 'Fitness Bootcamp',
      description: 'High-intensity workout session for all fitness levels. Professional trainers, equipment provided, and a supportive community atmosphere.',
      date: new Date('2024-05-05'),
      startTime: '07:00',
      endTime: '08:30',
      location: 'Fitness Center',
      address: '789 Health Street, Fitness District',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      category: 'fitness',
      organizer: users[4],
      coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop',
      attendees: [users[4], users[6]],
      maxAttendees: 30,
      isOnline: false,
      price: 20,
      currency: 'USD',
      tags: ['Fitness', 'Workout', 'Health'],
      isPrivate: false,
      isFeatured: false,
      isUserCreated: false,
      rsvpStatus: null,
      isBookmarked: false
    },
    {
      id: '6',
      title: 'Music Concert in the Park',
      description: 'Live outdoor concert featuring local bands and musicians. Bring your own blanket and enjoy an evening of great music under the stars.',
      date: new Date('2024-05-10'),
      startTime: '18:30',
      endTime: '22:00',
      location: 'Riverside Park',
      address: 'Riverside Park, New York, NY',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      category: 'music',
      organizer: users[5],
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=300&fit=crop',
      attendees: [users[5], users[0], users[2], users[7]],
      maxAttendees: 300,
      isOnline: false,
      price: 0,
      currency: 'USD',
      tags: ['Music', 'Concert', 'Outdoor'],
      isPrivate: false,
      isFeatured: true,
      isUserCreated: true,
      rsvpStatus: 'not_going',
      isBookmarked: false
    }
  ])

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const categories = [
    { id: 'all', name: 'All Events', icon: Calendar, color: 'bg-gray-100 text-gray-700' },
    { id: 'technology', name: 'Technology', icon: Zap, color: 'bg-blue-100 text-blue-700' },
    { id: 'art', name: 'Art', icon: Palette, color: 'bg-purple-100 text-purple-700' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-green-100 text-green-700' },
    { id: 'food', name: 'Food', icon: Utensils, color: 'bg-orange-100 text-orange-700' },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'bg-red-100 text-red-700' },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-pink-100 text-pink-700' },
    { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-cyan-100 text-cyan-700' }
  ]

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      const matchesDate = !selectedDate || event.date.toDateString() === selectedDate.toDateString()
      return matchesSearch && matchesCategory && matchesDate
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category)
    return categoryData ? categoryData.icon : Calendar
  }

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(c => c.id === category)
    return categoryData ? categoryData.color : 'bg-gray-100 text-gray-700'
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free'
    return `${currency} ${price}`
  }

  const handleRSVP = (eventId: string, status: 'going' | 'maybe' | 'not_going') => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, rsvpStatus: event.rsvpStatus === status ? null : status }
        : event
    ))
  }

  const handleBookmark = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isBookmarked: !event.isBookmarked }
        : event
    ))
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Events</h1>
                <p className="text-gray-600 mt-2">
                  Discover and join amazing events in your area
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Create Event</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-2 transition-colors duration-200 ${
                    viewMode === 'calendar' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Events Content */}
          {viewMode === 'calendar' ? (
            // Calendar View
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                  const isToday = date.toDateString() === new Date().toDateString()
                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
                  const dayEvents = getEventsForDate(date)

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`p-2 min-h-[80px] text-left border border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                        !isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
                      } ${isToday ? 'bg-blue-50 border-blue-200' : ''} ${
                        isSelected ? 'bg-blue-100 border-blue-300' : ''
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                      {dayEvents.length > 0 && (
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs p-1 rounded bg-blue-100 text-blue-700 truncate"
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            // Grid/List View
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredEvents.map((event) => {
                const CategoryIcon = getCategoryIcon(event.category)
                
                return viewMode === 'grid' ? (
                  // Grid View
                  <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Event Cover Image */}
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                          </div>
                        </div>
                      )}
                      {event.isOnline && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Online
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => handleBookmark(event.id)}
                        className={`absolute top-2 right-2 p-1 rounded-full transition-colors duration-200 ${
                          event.isBookmarked 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
                        }`}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Event Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{event.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees.length} attending</span>
                          {event.maxAttendees && (
                            <span className="text-gray-400">/ {event.maxAttendees}</span>
                          )}
                        </div>
                      </div>

                      {/* Category and Price */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                          {categories.find(c => c.id === event.category)?.name}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(event.price, event.currency)}
                        </span>
                      </div>

                      {/* RSVP Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRSVP(event.id, 'going')}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            event.rsvpStatus === 'going'
                              ? 'bg-green-500 text-white'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          Going
                        </button>
                        <button
                          onClick={() => handleRSVP(event.id, 'maybe')}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            event.rsvpStatus === 'maybe'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          Maybe
                        </button>
                        <button
                          onClick={() => handleRSVP(event.id, 'not_going')}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            event.rsvpStatus === 'not_going'
                              ? 'bg-red-500 text-white'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          Not Going
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex space-x-4">
                      {/* Event Image */}
                      <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        {event.isFeatured && (
                          <div className="absolute top-1 left-1">
                            <div className="bg-yellow-500 text-white px-1 py-0.5 rounded text-xs">
                              Featured
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Event Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleBookmark(event.id)}
                              className={`p-1 rounded-full transition-colors duration-200 ${
                                event.isBookmarked 
                                  ? 'text-yellow-500' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{event.attendees.length} attending</span>
                          </div>
                        </div>

                        {/* Category, Price, and RSVP */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                              {categories.find(c => c.id === event.category)?.name}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatPrice(event.price, event.currency)}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRSVP(event.id, 'going')}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                                event.rsvpStatus === 'going'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              Going
                            </button>
                            <button
                              onClick={() => handleRSVP(event.id, 'maybe')}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
                                event.rsvpStatus === 'maybe'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              }`}
                            >
                              Maybe
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No events scheduled at the moment'
                }
              </p>
              {!searchQuery && selectedCategory === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 