'use client'

import { useState, useEffect } from 'react'
import { 
  Share2, 
  Copy, 
  Mail, 
  Users, 
  Gift, 
  Star, 
  CheckCircle,
  X,
  Plus,
  Minus,
  ArrowRight,
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
  Palette,
  Heart,
  MessageCircle,
  MessageSquare,
  Send,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Settings,
  Edit3,
  Trash2,
  UserPlus,
  UserMinus,
  Bell,
  BellOff,
  Flag,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Hash,
  Info,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Twitch,
  Slack
} from 'lucide-react'
import { users } from '@/data/mockData'

interface ReferralReward {
  id: string
  type: 'credits' | 'premium' | 'badge' | 'feature'
  name: string
  description: string
  value: number
  currency?: string
  icon: any
  color: string
  isUnlocked: boolean
  requiredReferrals: number
}

interface InvitedFriend {
  id: string
  user: typeof users[0]
  email: string
  invitedAt: Date
  joinedAt?: Date
  status: 'pending' | 'joined' | 'active' | 'inactive'
  rewardEarned?: ReferralReward
  isRewarded: boolean
}

interface ReferralStats {
  totalInvites: number
  successfulReferrals: number
  pendingInvites: number
  totalRewardsEarned: number
  currentTier: string
  nextTier: string
  progressToNextTier: number
  referralCode: string
  referralLink: string
}

export default function ReferralsPage() {
  const [referralStats] = useState<ReferralStats>({
    totalInvites: 24,
    successfulReferrals: 8,
    pendingInvites: 16,
    totalRewardsEarned: 1250,
    currentTier: 'Bronze',
    nextTier: 'Silver',
    progressToNextTier: 60,
    referralCode: 'FRIEND2024',
    referralLink: 'https://socialapp.com/ref/FRIEND2024'
  })

  const [rewards] = useState<ReferralReward[]>([
    {
      id: '1',
      type: 'credits',
      name: '500 Credits',
      description: 'Earn 500 platform credits for each successful referral',
      value: 500,
      currency: 'credits',
      icon: Gift,
      color: 'bg-blue-100 text-blue-700',
      isUnlocked: true,
      requiredReferrals: 1
    },
    {
      id: '2',
      type: 'premium',
      name: '1 Month Premium',
      description: 'Get 1 month of premium features for 3 referrals',
      value: 1,
      icon: Crown,
      color: 'bg-purple-100 text-purple-700',
      isUnlocked: true,
      requiredReferrals: 3
    },
    {
      id: '3',
      type: 'badge',
      name: 'Referral Master Badge',
      description: 'Exclusive badge for referring 5 friends',
      value: 0,
      icon: Award,
      color: 'bg-yellow-100 text-yellow-700',
      isUnlocked: true,
      requiredReferrals: 5
    },
    {
      id: '4',
      type: 'feature',
      name: 'Custom Profile Themes',
      description: 'Unlock custom profile themes for 10 referrals',
      value: 0,
      icon: Palette,
      color: 'bg-green-100 text-green-700',
      isUnlocked: false,
      requiredReferrals: 10
    },
    {
      id: '5',
      type: 'credits',
      name: '2000 Credits',
      description: 'Earn 2000 platform credits for 15 referrals',
      value: 2000,
      currency: 'credits',
      icon: Gift,
      color: 'bg-blue-100 text-blue-700',
      isUnlocked: false,
      requiredReferrals: 15
    },
    {
      id: '6',
      type: 'premium',
      name: '3 Months Premium',
      description: 'Get 3 months of premium features for 20 referrals',
      value: 3,
      icon: Crown,
      color: 'bg-purple-100 text-purple-700',
      isUnlocked: false,
      requiredReferrals: 20
    }
  ])

  const [invitedFriends] = useState<InvitedFriend[]>([
    {
      id: '1',
      user: users[1],
      email: 'john.doe@email.com',
      invitedAt: new Date('2024-03-15'),
      joinedAt: new Date('2024-03-18'),
      status: 'active',
      rewardEarned: rewards[0],
      isRewarded: true
    },
    {
      id: '2',
      user: users[2],
      email: 'sarah.smith@email.com',
      invitedAt: new Date('2024-03-20'),
      joinedAt: new Date('2024-03-22'),
      status: 'active',
      rewardEarned: rewards[0],
      isRewarded: true
    },
    {
      id: '3',
      user: users[3],
      email: 'mike.johnson@email.com',
      invitedAt: new Date('2024-03-25'),
      status: 'pending',
      isRewarded: false
    },
    {
      id: '4',
      user: users[4],
      email: 'emma.wilson@email.com',
      invitedAt: new Date('2024-03-28'),
      joinedAt: new Date('2024-03-30'),
      status: 'active',
      rewardEarned: rewards[0],
      isRewarded: true
    },
    {
      id: '5',
      user: users[5],
      email: 'alex.brown@email.com',
      invitedAt: new Date('2024-04-01'),
      status: 'pending',
      isRewarded: false
    },
    {
      id: '6',
      user: users[6],
      email: 'lisa.davis@email.com',
      invitedAt: new Date('2024-04-05'),
      joinedAt: new Date('2024-04-07'),
      status: 'active',
      rewardEarned: rewards[0],
      isRewarded: true
    }
  ])

  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailInvites, setEmailInvites] = useState<string[]>([''])
  const [copiedLink, setCopiedLink] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'history'>('overview')

  const socialPlatforms = [
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Twitter', icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600' },
    { name: 'Instagram', icon: Instagram, color: 'bg-pink-600 hover:bg-pink-700' },
    { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800' },
    { name: 'WhatsApp', icon: Phone, color: 'bg-green-500 hover:bg-green-600' },
    { name: 'Telegram', icon: Send, color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Discord', icon: MessageSquare, color: 'bg-indigo-600 hover:bg-indigo-700' },
    { name: 'Email', icon: Mail, color: 'bg-gray-600 hover:bg-gray-700' }
  ]

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralStats.referralLink)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const addEmailField = () => {
    setEmailInvites([...emailInvites, ''])
  }

  const removeEmailField = (index: number) => {
    if (emailInvites.length > 1) {
      setEmailInvites(emailInvites.filter((_, i) => i !== index))
    }
  }

  const updateEmailField = (index: number, value: string) => {
    const newEmails = [...emailInvites]
    newEmails[index] = value
    setEmailInvites(newEmails)
  }

  const sendEmailInvites = () => {
    const validEmails = emailInvites.filter(email => email.trim() !== '')
    if (validEmails.length > 0) {
      console.log('Sending invites to:', validEmails)
      setShowEmailModal(false)
      setEmailInvites([''])
      // Here you would typically send the invites via API
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'joined':
        return 'bg-blue-100 text-blue-700'
      case 'inactive':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getUnlockedRewards = () => rewards.filter(reward => reward.isUnlocked)
  const getLockedRewards = () => rewards.filter(reward => !reward.isUnlocked)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Refer Friends</h1>
            <p className="text-gray-600 mt-2">
              Invite friends and earn amazing rewards
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Invites</p>
                  <p className="text-2xl font-bold text-gray-900">{referralStats.totalInvites}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Successful Referrals</p>
                  <p className="text-2xl font-bold text-gray-900">{referralStats.successfulReferrals}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Invites</p>
                  <p className="text-2xl font-bold text-gray-900">{referralStats.pendingInvites}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rewards Earned</p>
                  <p className="text-2xl font-bold text-gray-900">{referralStats.totalRewardsEarned}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'overview', label: 'Overview', count: null },
                { id: 'rewards', label: 'Rewards', count: getUnlockedRewards().length },
                { id: 'history', label: 'Invite History', count: invitedFriends.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Referral Link Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 p-3 bg-white border border-gray-300 rounded-lg">
                          <input
                            type="text"
                            value={referralStats.referralLink}
                            readOnly
                            className="flex-1 text-sm text-gray-600 bg-transparent outline-none"
                          />
                          <button
                            onClick={copyReferralLink}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              copiedLink 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {copiedLink ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Share this link with friends to earn rewards
                        </p>
                      </div>
                      <button
                        onClick={() => setShowEmailModal(true)}
                        className="flex items-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Invite by Email</span>
                      </button>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Share on Social Media</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                      {socialPlatforms.map((platform) => {
                        const Icon = platform.icon
                        return (
                          <button
                            key={platform.name}
                            className={`flex flex-col items-center space-y-2 p-4 rounded-xl text-white transition-colors duration-200 ${platform.color}`}
                          >
                            <Icon className="h-6 w-6" />
                            <span className="text-xs font-medium">{platform.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Progress to Next Tier */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Progress to Next Tier</h3>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Current: {referralStats.currentTier}</p>
                        <p className="text-sm font-medium text-gray-900">Next: {referralStats.nextTier}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${referralStats.progressToNextTier}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {referralStats.progressToNextTier}% complete - {referralStats.successfulReferrals}/10 referrals
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'rewards' && (
                <div className="space-y-6">
                  {/* Unlocked Rewards */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Unlocked Rewards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getUnlockedRewards().map((reward) => {
                        const Icon = reward.icon
                        return (
                          <div key={reward.id} className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`p-2 rounded-lg ${reward.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                                <p className="text-sm text-gray-600">{reward.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-green-600 font-medium">✓ Unlocked</span>
                              <span className="text-xs text-gray-500">{reward.requiredReferrals} referrals</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Locked Rewards */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Rewards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getLockedRewards().map((reward) => {
                        const Icon = reward.icon
                        return (
                          <div key={reward.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`p-2 rounded-lg ${reward.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                                <p className="text-sm text-gray-600">{reward.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-medium">🔒 Locked</span>
                              <span className="text-xs text-gray-500">{reward.requiredReferrals} referrals</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <div className="space-y-4">
                    {invitedFriends.map((friend) => (
                      <div key={friend.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={friend.user.avatar}
                            alt={friend.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{friend.user.name}</h4>
                            <p className="text-sm text-gray-500">{friend.email}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span>Invited {formatDate(friend.invitedAt)}</span>
                              {friend.joinedAt && (
                                <span>Joined {formatDate(friend.joinedAt)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(friend.status)}`}>
                            {friend.status}
                          </span>
                          {friend.isRewarded && friend.rewardEarned && (
                            <div className="flex items-center space-x-1 text-xs text-green-600">
                              <Gift className="h-3 w-3" />
                              <span>Rewarded</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Invite Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Invite Friends by Email</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {emailInvites.map((email, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmailField(index, e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {emailInvites.length > 1 && (
                    <button
                      onClick={() => removeEmailField(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={addEmailField}
                className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add another email</span>
              </button>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={sendEmailInvites}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Send Invites
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 