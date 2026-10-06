'use client'

import { useState } from 'react'
import { 
  Flag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  EyeOff,
  Settings,
  Edit3,
  Trash2,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  MapPin,
  Tag,
  Hash,
  Info,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Grid,
  List,
  MoreHorizontal,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  TrendingUp,
  Award,
  Trophy,
  Crown,
  Zap,
  Sparkles,
  Phone,
  Globe,
  Lock
} from 'lucide-react'
import { users } from '@/data/mockData'

interface ReportedPost {
  id: string
  postId: string
  postTitle: string
  postContent: string
  postImage?: string
  postAuthor: typeof users[0]
  reportReason: string
  reportDetails: string
  reportedAt: Date
  status: 'pending' | 'removed' | 'rejected'
  reviewedAt?: Date
  moderatorNotes?: string
  postStatus: 'active' | 'removed' | 'hidden'
}

export default function ReportsPage() {
  const [reportedPosts, setReportedPosts] = useState<ReportedPost[]>([
    {
      id: '1',
      postId: 'post-123',
      postTitle: 'Inappropriate Content Post',
      postContent: 'This post contained content that violated community guidelines...',
      postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      postAuthor: users[1],
      reportReason: 'Inappropriate Content',
      reportDetails: 'This post contains offensive language and inappropriate images that violate community standards.',
      reportedAt: new Date('2024-04-01T10:30:00'),
      status: 'removed',
      reviewedAt: new Date('2024-04-02T14:15:00'),
      moderatorNotes: 'Post removed for violation of community guidelines. User has been warned.',
      postStatus: 'removed'
    },
    {
      id: '2',
      postId: 'post-456',
      postTitle: 'Spam Advertisement',
      postContent: 'This appears to be a spam post promoting products...',
      postAuthor: users[2],
      reportReason: 'Spam',
      reportDetails: 'This user is posting multiple promotional messages without engaging with the community.',
      reportedAt: new Date('2024-04-05T16:45:00'),
      status: 'pending',
      postStatus: 'active'
    },
    {
      id: '3',
      postId: 'post-789',
      postTitle: 'Misleading Information',
      postContent: 'This post contains false information about current events...',
      postImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
      postAuthor: users[3],
      reportReason: 'Misinformation',
      reportDetails: 'The claims made in this post are factually incorrect and could mislead other users.',
      reportedAt: new Date('2024-04-08T09:20:00'),
      status: 'rejected',
      reviewedAt: new Date('2024-04-09T11:30:00'),
      moderatorNotes: 'Content reviewed and found to be within acceptable bounds. No action taken.',
      postStatus: 'active'
    },
    {
      id: '4',
      postId: 'post-101',
      postTitle: 'Harassment and Bullying',
      postContent: 'This post targets specific users with harmful comments...',
      postAuthor: users[0],
      reportReason: 'Harassment',
      reportDetails: 'The author is making personal attacks and using threatening language toward other users.',
      reportedAt: new Date('2024-04-10T13:15:00'),
      status: 'removed',
      reviewedAt: new Date('2024-04-11T08:45:00'),
      moderatorNotes: 'Post removed for harassment. User account suspended for 7 days.',
      postStatus: 'removed'
    },
    {
      id: '5',
      postId: 'post-202',
      postTitle: 'Copyright Violation',
      postContent: 'This post uses copyrighted material without permission...',
      postImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      postAuthor: users[1],
      reportReason: 'Copyright Violation',
      reportDetails: 'The images and content in this post appear to be used without proper licensing or permission.',
      reportedAt: new Date('2024-04-12T15:30:00'),
      status: 'pending',
      postStatus: 'hidden'
    },
    {
      id: '6',
      postId: 'post-303',
      postTitle: 'Fake News Article',
      postContent: 'This article contains completely fabricated information...',
      postAuthor: users[2],
      reportReason: 'Misinformation',
      reportDetails: 'The article presents false information as fact and could spread confusion.',
      reportedAt: new Date('2024-04-14T12:00:00'),
      status: 'rejected',
      reviewedAt: new Date('2024-04-15T10:20:00'),
      moderatorNotes: 'Content appears to be satire/parody. No violation found.',
      postStatus: 'active'
    },
    {
      id: '7',
      postId: 'post-404',
      postTitle: 'Explicit Content',
      postContent: 'This post contains inappropriate adult content...',
      postAuthor: users[3],
      reportReason: 'Explicit Content',
      reportDetails: 'The images and text in this post are not suitable for a general audience.',
      reportedAt: new Date('2024-04-16T18:20:00'),
      status: 'removed',
      reviewedAt: new Date('2024-04-17T09:15:00'),
      moderatorNotes: 'Post removed for explicit content. User account permanently banned.',
      postStatus: 'removed'
    },
    {
      id: '8',
      postId: 'post-505',
      postTitle: 'Automated Bot Activity',
      postContent: 'This appears to be automated posting behavior...',
      postAuthor: users[0],
      reportReason: 'Spam',
      reportDetails: 'This account is posting identical content repeatedly across multiple threads.',
      reportedAt: new Date('2024-04-18T14:45:00'),
      status: 'pending',
      postStatus: 'active'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedReason, setSelectedReason] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'removed', label: 'Post Removed' },
    { value: 'rejected', label: 'Report Rejected' }
  ]

  const reasonOptions = [
    { value: 'all', label: 'All Reasons' },
    { value: 'Inappropriate Content', label: 'Inappropriate Content' },
    { value: 'Spam', label: 'Spam' },
    { value: 'Misinformation', label: 'Misinformation' },
    { value: 'Harassment', label: 'Harassment' },
    { value: 'Copyright Violation', label: 'Copyright Violation' },
    { value: 'Explicit Content', label: 'Explicit Content' }
  ]

  const filteredReports = reportedPosts.filter(report => {
    const matchesSearch = report.postTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportDetails.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus
    const matchesReason = selectedReason === 'all' || report.reportReason === selectedReason
    
    return matchesSearch && matchesStatus && matchesReason
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'removed':
        return 'bg-red-100 text-red-700'
      case 'rejected':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock
      case 'removed':
        return CheckCircle
      case 'rejected':
        return XCircle
      default:
        return AlertTriangle
    }
  }

  const getPostStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'removed':
        return 'bg-red-100 text-red-700'
      case 'hidden':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStats = () => {
    const total = reportedPosts.length
    const pending = reportedPosts.filter(r => r.status === 'pending').length
    const removed = reportedPosts.filter(r => r.status === 'removed').length
    const rejected = reportedPosts.filter(r => r.status === 'rejected').length

    return { total, pending, removed, rejected }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Flag className="h-8 w-8 text-gray-600" />
              <h1 className="text-3xl font-bold text-gray-900">Report History</h1>
            </div>
            <p className="text-gray-600">
              Track the status of posts you've reported and see how they were handled by our moderation team.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Flag className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posts Removed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.removed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reports Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {reasonOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-l-lg transition-colors duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-r-lg transition-colors duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Grid/List */}
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus !== 'all' || selectedReason !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'You haven\'t reported any posts yet.'
                }
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {filteredReports.map((report) => {
                const StatusIcon = getStatusIcon(report.status)
                return (
                  <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Post Image */}
                    {report.postImage && (
                      <div className="aspect-video bg-gray-200">
                        <img
                          src={report.postImage}
                          alt={report.postTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Report Content */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={report.postAuthor.avatar}
                            alt={report.postAuthor.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{report.postAuthor.name}</p>
                            <p className="text-xs text-gray-500">Reported {formatDate(report.reportedAt)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostStatusColor(report.postStatus)}`}>
                            {report.postStatus.charAt(0).toUpperCase() + report.postStatus.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Post Title and Content */}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{report.postTitle}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{report.postContent}</p>

                      {/* Report Details */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Flag className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{report.reportReason}</span>
                        </div>
                        <p className="text-xs text-gray-600">{report.reportDetails}</p>
                      </div>

                      {/* Status Information */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <StatusIcon className="h-4 w-4" />
                          <span>{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
                        </div>
                        {report.reviewedAt && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Reviewed {formatDate(report.reviewedAt)}</span>
                          </div>
                        )}
                      </div>

                      {/* Moderator Notes */}
                      {report.moderatorNotes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <div className="flex items-start space-x-2">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-blue-800 mb-1">Moderator Notes</p>
                              <p className="text-xs text-blue-700">{report.moderatorNotes}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                          <Eye className="h-4 w-4" />
                          <span>View Post</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                          <Flag className="h-4 w-4" />
                          <span>Report Again</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 