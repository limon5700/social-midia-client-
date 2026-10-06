'use client'

import { useState, useRef, useCallback } from 'react'
import { 
  Image, 
  Video, 
  X, 
  Smile, 
  Hash, 
  UserPlus, 
  Globe, 
  Users, 
  Lock, 
  Send,
  Upload,
  Trash2,
  Plus,
  AtSign,
  Camera,
  Music,
  MapPin,
  Calendar,
  Settings
} from 'lucide-react'
import { users } from '@/data/mockData'

interface MediaFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
}

interface TaggedUser {
  id: string
  name: string
  avatar: string
}

interface Hashtag {
  id: string
  tag: string
}

export default function CreatePostPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState<Hashtag[]>([])
  const [taggedUsers, setTaggedUsers] = useState<TaggedUser[]>([])
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showHashtagInput, setShowHashtagInput] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [hashtagInput, setHashtagInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const captionRef = useRef<HTMLTextAreaElement>(null)

  // Emoji data
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢',
    '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩', '👻', '💀',
    '☠️', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽'
  ]

  // Handle file upload
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return

    const newFiles: MediaFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }))

    setMediaFiles(prev => [...prev, ...newFiles])
  }, [])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }, [handleFileUpload])

  // Remove media file
  const removeMediaFile = (id: string) => {
    setMediaFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  // Add emoji to caption
  const addEmoji = (emoji: string) => {
    setCaption(prev => prev + emoji)
    setShowEmojiPicker(false)
    captionRef.current?.focus()
  }

  // Add hashtag
  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.find(h => h.tag === hashtagInput.trim())) {
      setHashtags(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        tag: hashtagInput.trim()
      }])
      setHashtagInput('')
      setShowHashtagInput(false)
    }
  }

  // Remove hashtag
  const removeHashtag = (id: string) => {
    setHashtags(prev => prev.filter(h => h.id !== id))
  }

  // Add tagged user
  const addTaggedUser = () => {
    const user = users.find(u => 
      u.name.toLowerCase().includes(tagInput.toLowerCase()) ||
      u.username?.toLowerCase().includes(tagInput.toLowerCase())
    )
    
    if (user && !taggedUsers.find(t => t.id === user.id)) {
      setTaggedUsers(prev => [...prev, {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }])
      setTagInput('')
      setShowTagInput(false)
    }
  }

  // Remove tagged user
  const removeTaggedUser = (id: string) => {
    setTaggedUsers(prev => prev.filter(t => t.id !== id))
  }

  // Handle post creation
  const handleCreatePost = async () => {
    if (!mediaFiles.length && !caption.trim()) return

    setIsPosting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Creating post:', {
      mediaFiles,
      caption,
      hashtags,
      taggedUsers,
      privacy
    })

    setIsPosting(false)
    // In a real app, you would navigate back or show success message
    window.location.href = '/'
  }

  // Filter users for tagging
  const filteredUsers = users.filter(user => 
    (user.name.toLowerCase().includes(tagInput.toLowerCase()) ||
     user.username?.toLowerCase().includes(tagInput.toLowerCase())) &&
    !taggedUsers.find(t => t.id === user.id)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
            <button
              onClick={() => window.location.href = '/'}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Create Post Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Media Upload Area */}
            <div className="p-6 border-b border-gray-100">
              {mediaFiles.length === 0 ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Upload Photos or Videos
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Drag and drop files here, or click to browse
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                  >
                    Choose Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Media ({mediaFiles.length})
                    </h3>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Add More</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {mediaFiles.map((file) => (
                      <div key={file.id} className="relative group">
                        {file.type === 'image' ? (
                          <img
                            src={file.preview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={file.preview}
                            className="w-full h-32 object-cover rounded-lg"
                            muted
                          />
                        )}
                        
                        {/* Remove button */}
                        <button
                          onClick={() => removeMediaFile(file.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        
                        {/* Type indicator */}
                        <div className="absolute bottom-2 left-2">
                          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                            {file.type === 'image' ? (
                              <Image className="h-3 w-3" />
                            ) : (
                              <Video className="h-3 w-3" />
                            )}
                            <span className="capitalize">{file.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Caption Input */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start space-x-3">
                <img
                  src={users[0].avatar}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <textarea
                    ref={captionRef}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full resize-none border-none outline-none text-gray-900 placeholder-gray-500 text-lg"
                    rows={4}
                  />
                  
                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Smile className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowHashtagInput(!showHashtagInput)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Hash className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowTagInput(!showTagInput)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <UserPlus className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <MapPin className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <Music className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="grid grid-cols-10 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="p-2 text-xl hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtag Input */}
            {showHashtagInput && (
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    placeholder="Add hashtag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                  />
                  <button
                    onClick={addHashtag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Tag Input */}
            {showTagInput && (
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Tag people..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addTaggedUser()}
                    />
                    <button
                      onClick={addTaggedUser}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                  
                  {filteredUsers.length > 0 && (
                    <div className="space-y-1">
                      {filteredUsers.slice(0, 5).map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            setTaggedUsers(prev => [...prev, {
                              id: user.id,
                              name: user.name,
                              avatar: user.avatar
                            }])
                            setTagInput('')
                          }}
                          className="flex items-center space-x-3 w-full p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="text-sm text-gray-900">{user.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hashtags Display */}
            {hashtags.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((hashtag) => (
                    <div
                      key={hashtag.id}
                      className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>#{hashtag.tag}</span>
                      <button
                        onClick={() => removeHashtag(hashtag.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tagged Users Display */}
            {taggedUsers.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Tagged People</h4>
                <div className="flex flex-wrap gap-2">
                  {taggedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-4 w-4 rounded-full object-cover"
                      />
                      <span>{user.name}</span>
                      <button
                        onClick={() => removeTaggedUser(user.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {privacy === 'public' && <Globe className="h-5 w-5 text-gray-600" />}
                    {privacy === 'friends' && <Users className="h-5 w-5 text-gray-600" />}
                    {privacy === 'private' && <Lock className="h-5 w-5 text-gray-600" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {privacy === 'public' && 'Public'}
                      {privacy === 'friends' && 'Friends'}
                      {privacy === 'private' && 'Private'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {privacy === 'public' && 'Anyone can see this post'}
                      {privacy === 'friends' && 'Only your friends can see this post'}
                      {privacy === 'private' && 'Only you can see this post'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const options = ['public', 'friends', 'private']
                    const currentIndex = options.indexOf(privacy)
                    const nextIndex = (currentIndex + 1) % options.length
                    setPrivacy(options[nextIndex] as any)
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Post Button */}
            <div className="p-6">
              <button
                onClick={handleCreatePost}
                disabled={(!mediaFiles.length && !caption.trim()) || isPosting}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                  (!mediaFiles.length && !caption.trim()) || isPosting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isPosting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 