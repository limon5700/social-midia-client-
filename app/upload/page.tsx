'use client'

import { useState, useRef, useCallback } from 'react'
import { 
  Upload, 
  X, 
  Play, 
  Image, 
  File, 
  Globe, 
  Users, 
  Lock, 
  Hash,
  Tag,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Edit3,
  Camera,
  Video,
  Music,
  Settings
} from 'lucide-react'
import { users } from '@/data/mockData'

interface UploadFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
  size: number
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

interface UploadForm {
  title: string
  description: string
  category: string
  privacy: 'public' | 'friends' | 'private'
  hashtags: string[]
  location?: string
  allowComments: boolean
  allowDownloads: boolean
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [form, setForm] = useState<UploadForm>({
    title: '',
    description: '',
    category: '',
    privacy: 'public',
    hashtags: [],
    allowComments: true,
    allowDownloads: false
  })
  const [newHashtag, setNewHashtag] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: 'lifestyle', name: 'Lifestyle', icon: Camera },
    { id: 'travel', name: 'Travel', icon: Globe },
    { id: 'food', name: 'Food & Cooking', icon: Hash },
    { id: 'fitness', name: 'Fitness & Health', icon: Users },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'comedy', name: 'Comedy', icon: Video },
    { id: 'education', name: 'Education', icon: File },
    { id: 'gaming', name: 'Gaming', icon: Play }
  ]

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      const maxSize = 100 * 1024 * 1024 // 100MB
      
      if (!isImage && !isVideo) {
        alert('Please upload only image or video files.')
        return false
      }
      
      if (file.size > maxSize) {
        alert('File size must be less than 100MB.')
        return false
      }
      
      return true
    })

    const newFiles: UploadFile[] = validFiles.map(file => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
      progress: 0,
      status: 'uploading'
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
    simulateUpload(newFiles)
  }

  const simulateUpload = (files: UploadFile[]) => {
    setIsUploading(true)
    setUploadProgress(0)

    files.forEach((file, index) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, progress: 100, status: 'completed' }
              : f
          ))
          
          if (index === files.length - 1) {
            setIsUploading(false)
            setUploadProgress(100)
          }
        } else {
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, progress }
              : f
          ))
          setUploadProgress(progress)
        }
      }, 200)
    })
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const addHashtag = () => {
    if (newHashtag.trim() && !form.hashtags.includes(newHashtag.trim())) {
      setForm(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, newHashtag.trim()]
      }))
      setNewHashtag('')
    }
  }

  const removeHashtag = (hashtag: string) => {
    setForm(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }))
  }

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert('Please enter a title.')
      return
    }
    
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file.')
      return
    }
    
    if (!form.category) {
      alert('Please select a category.')
      return
    }
    
    console.log('Uploading:', { form, files: uploadedFiles })
    // Here you would typically send the data to your backend
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Upload Content</h1>
            <p className="text-gray-600 mt-2">
              Share your photos and videos with the world
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Area */}
            <div className="lg:col-span-2">
              {/* Drag & Drop Zone */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-gray-500 mb-4">
                  or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-sm text-gray-400">
                  Supports images and videos up to 100MB
                </p>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Uploading...</span>
                    <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* File Previews */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Uploaded Files</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* File Preview */}
                        <div className="relative aspect-video bg-gray-100">
                          {file.type === 'image' ? (
                            <img
                              src={file.preview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <video
                                src={file.preview}
                                className="w-full h-full object-cover"
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="h-8 w-8 text-white bg-black bg-opacity-50 rounded-full p-2" />
                              </div>
                            </div>
                          )}
                          
                          {/* File Type Badge */}
                          <div className="absolute top-2 left-2">
                            <div className="bg-white bg-opacity-90 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                              {file.type === 'image' ? (
                                <Image className="h-3 w-3" />
                              ) : (
                                <Video className="h-3 w-3" />
                              )}
                              <span className="capitalize">{file.type}</span>
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFile(file.id)}
                            className="absolute top-2 right-2 p-1 bg-white bg-opacity-90 text-gray-600 hover:text-red-500 rounded-full transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          
                          {/* Upload Status */}
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-white bg-opacity-90 rounded-lg p-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">{formatFileSize(file.size)}</span>
                                <div className="flex items-center space-x-1">
                                  {file.status === 'uploading' && (
                                    <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                                  )}
                                  {file.status === 'completed' && (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  )}
                                  {file.status === 'error' && (
                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                  )}
                                  <span className={file.status === 'completed' ? 'text-green-600' : 'text-gray-600'}>
                                    {file.status === 'completed' ? 'Uploaded' : `${Math.round(file.progress)}%`}
                                  </span>
                                </div>
                              </div>
                              {file.status === 'uploading' && (
                                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                  <div
                                    className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${file.progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Sidebar */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Content Details</h3>
                
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a catchy title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={100}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {form.title.length}/100
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Tell us more about your content..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {form.description.length}/500
                  </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Hashtags */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hashtags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                      placeholder="Add hashtag..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={addHashtag}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {form.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.hashtags.map((hashtag) => (
                        <span
                          key={hashtag}
                          className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          <span>#{hashtag}</span>
                          <button
                            onClick={() => removeHashtag(hashtag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                
                <div className="space-y-3">
                  {[
                    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can see this content' },
                    { value: 'friends', label: 'Friends', icon: Users, description: 'Only your friends can see this' },
                    { value: 'private', label: 'Private', icon: Lock, description: 'Only you can see this content' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="privacy"
                        value={option.value}
                        checked={form.privacy === option.value}
                        onChange={(e) => setForm(prev => ({ ...prev, privacy: e.target.value as any }))}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <option.icon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{option.label}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Advanced Settings</span>
                  </div>
                  {showAdvanced ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                
                {showAdvanced && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={form.allowComments}
                        onChange={(e) => setForm(prev => ({ ...prev, allowComments: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Allow comments</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={form.allowDownloads}
                        onChange={(e) => setForm(prev => ({ ...prev, allowDownloads: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Allow downloads</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isUploading || uploadedFiles.length === 0 || !form.title.trim() || !form.category}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  'Publish Content'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 