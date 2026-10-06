'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ArrowLeft, 
  Camera, 
  Save, 
  Loader2, 
  X, 
  User, 
  Briefcase, 
  GraduationCap, 
  Phone, 
  Globe, 
  Linkedin, 
  Twitter, 
  Github, 
  Instagram,
  Building2,
  Award,
  Code,
  FileText
} from 'lucide-react'

interface UserProfile {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  bio: string
  location?: string
  website?: string
  isPrivate: boolean
  interests: string[]
  // Professional fields
  profession?: string
  company?: string
  jobTitle?: string
  education?: string
  skills?: string[]
  experience?: string
  phone?: string
  socialLinks?: {
    linkedin: string
    twitter: string
    github: string
    instagram: string
  }
}

export default function EditProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, updateUser } = useAuth()
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'basic' | 'professional' | 'social'>('basic')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    website: '',
    isPrivate: false,
    interests: '',
    // Professional fields
    profession: '',
    company: '',
    jobTitle: '',
    education: '',
    skills: '',
    experience: '',
    phone: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      instagram: ''
    }
  })
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile()
    } else if (!isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, user, router])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const userData = data.data.user
          const profileData = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar || '/images/default-avatar.svg',
            bio: userData.bio || '',
            location: userData.location || '',
            website: userData.website || '',
            isPrivate: userData.isPrivate || false,
            interests: userData.interests || [],
            // Professional fields
            profession: userData.profession || '',
            company: userData.company || '',
            jobTitle: userData.jobTitle || '',
            education: userData.education || '',
            skills: userData.skills || [],
            experience: userData.experience || '',
            phone: userData.phone || '',
            socialLinks: userData.socialLinks || {
              linkedin: '',
              twitter: '',
              github: '',
              instagram: ''
            }
          }
          
          setProfileUser(profileData)
          setFormData({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            bio: profileData.bio,
            location: profileData.location,
            website: profileData.website,
            isPrivate: profileData.isPrivate,
            interests: profileData.interests.join(', '),
            // Professional fields
            profession: profileData.profession || '',
            company: profileData.company || '',
            jobTitle: profileData.jobTitle || '',
            education: profileData.education || '',
            skills: profileData.skills?.join(', ') || '',
            experience: profileData.experience || '',
            phone: profileData.phone || '',
            socialLinks: {
              linkedin: profileData.socialLinks?.linkedin || '',
              twitter: profileData.socialLinks?.twitter || '',
              github: profileData.socialLinks?.github || '',
              instagram: profileData.socialLinks?.instagram || ''
            }
          })
          setAvatar(profileData.avatar)
          setHasUnsavedChanges(false)
          setSuccess('')
          setError('')
          setLoading(false)
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    // Handle nested socialLinks
    if (name.startsWith('socialLinks.')) {
      const socialField = name.split('.')[1] as keyof typeof formData.socialLinks
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }))
    }
    
    // Mark as having unsaved changes
    setHasUnsavedChanges(true)
    setError('')
    setSuccess('')
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatar(e.target?.result as string)
        setHasUnsavedChanges(true)
        setError('')
        setSuccess('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const interestsArray = formData.interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0)

      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)

      const updateData = {
        ...formData,
        interests: interestsArray,
        skills: skillsArray,
        avatar: avatar // Add avatar to update data
      }

      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Profile updated successfully!')
        setHasUnsavedChanges(false)
        
        // Update the user data in AuthContext
        if (data.data && data.data.user) {
          updateUser(data.data.user)
        }
        
        // Refresh the profile page to show updated data
        setTimeout(() => {
          router.refresh()
                          window.location.reload() // Force full page reload to update all avatars
        }, 1500)
      } else {
        setError(data.message || 'Failed to update profile')
      }
    } catch (error) {
      setError('An error occurred while updating profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Please login to edit your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/profile')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                  <p className="text-gray-600">Update your personal and professional information</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/profile')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-blue-100"
                    />
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all duration-200 cursor-pointer shadow-lg">
                        <Camera className="h-5 w-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {avatar !== profileUser?.avatar && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Changed
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">Click the camera icon to change your profile picture</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended: Square image, 400x400px or larger</p>
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-600 text-sm font-medium">{success}</p>
              </div>
            )}
            {hasUnsavedChanges && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-700 text-sm font-medium">
                  You have unsaved changes. Click "Save Changes" to update your profile.
                </p>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-2">
              <div className="flex space-x-2">
                {[
                  { id: 'basic', label: 'Basic Info', icon: User },
                  { id: 'professional', label: 'Professional', icon: Briefcase },
                  { id: 'social', label: 'Social Links', icon: Globe }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id as any)
                        // Clear success message when switching tabs
                        setSuccess('')
                      }}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex-1 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                      placeholder="Tell us about yourself..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>

                  {/* Location & Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label htmlFor="interests" className="block text-sm font-semibold text-gray-700 mb-2">
                      Interests
                    </label>
                    <input
                      type="text"
                      id="interests"
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Technology, Design, Photography (separate with commas)"
                    />
                  </div>

                  {/* Privacy Setting */}
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      name="isPrivate"
                      checked={formData.isPrivate}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
                      Make my profile private
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Information Tab */}
            {activeTab === 'professional' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="space-y-6">
                  {/* Profession & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="profession" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                        Profession
                      </label>
                      <input
                        type="text"
                        id="profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., Google"
                      />
                    </div>
                  </div>

                  {/* Job Title */}
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-blue-600" />
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  {/* Education */}
                  <div>
                    <label htmlFor="education" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2 text-blue-600" />
                      Education
                    </label>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., BSc Computer Science, University of Dhaka"
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2 text-blue-600" />
                      Skills
                    </label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="JavaScript, React, Node.js, MongoDB (separate with commas)"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-600" />
                      Experience
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows={4}
                      maxLength={1000}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                      placeholder="Describe your work experience..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.experience.length}/1000 characters
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-blue-600" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+880 1234 567890"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="socialLinks.linkedin" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        id="socialLinks.linkedin"
                        name="socialLinks.linkedin"
                        value={formData.socialLinks.linkedin}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label htmlFor="socialLinks.twitter" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                        Twitter
                      </label>
                      <input
                        type="url"
                        id="socialLinks.twitter"
                        name="socialLinks.twitter"
                        value={formData.socialLinks.twitter}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div>
                      <label htmlFor="socialLinks.github" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Github className="h-4 w-4 mr-2 text-gray-800" />
                        GitHub
                      </label>
                      <input
                        type="url"
                        id="socialLinks.github"
                        name="socialLinks.github"
                        value={formData.socialLinks.github}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label htmlFor="socialLinks.instagram" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                        Instagram
                      </label>
                      <input
                        type="url"
                        id="socialLinks.instagram"
                        name="socialLinks.instagram"
                        value={formData.socialLinks.instagram}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 