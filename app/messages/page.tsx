'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Phone,
  Video,
  Image,
  File,
  X,
  Check,
  CheckCheck,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react'
import { conversations, currentUser } from '@/data/mockData'
import { formatTimeAgo } from '@/lib/utils'

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileShowChat, setMobileShowChat] = useState(false)

  const filteredConversations = conversations.filter(conv => 
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message)
      setMessage('')
      setShowEmojiPicker(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const simulateTyping = () => {
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-[calc(100dvh-8rem)] lg:min-h-[calc(100dvh-4rem)]">
        <div className="flex h-full min-h-[inherit]">
          {/* Conversations list */}
          <div
            className={`${
              mobileShowChat ? 'hidden' : 'flex'
            } lg:flex flex-col w-full lg:w-80 xl:w-96 bg-white border-r border-gray-200`}
          >
            <div className="p-3 sm:p-4 border-b border-gray-100">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => {
                const otherParticipant = conversation.participants.find((p) => p.id !== currentUser.id)
                const isActive = selectedConversation.id === conversation.id

                return (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation)
                      setMobileShowChat(true)
                    }}
                    className={`flex items-center gap-3 p-3 sm:p-4 cursor-pointer transition-colors ${
                      isActive ? 'bg-primary-50 border-r-2 border-primary-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Profile Picture */}
                    <div className="relative">
                      <img
                        src={otherParticipant?.avatar}
                        alt={otherParticipant?.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {otherParticipant?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {otherParticipant?.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(conversation.lastMessage.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Main Chat Window */}
          <div
            className={`${
              mobileShowChat ? 'flex' : 'hidden'
            } lg:flex flex-1 flex-col bg-white min-w-0`}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileShowChat(false)}
                      className="lg:hidden p-2 -ml-1 text-gray-600 hover:bg-gray-100 rounded-lg shrink-0"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <img
                      src={selectedConversation.participants.find((p) => p.id !== currentUser.id)?.avatar}
                      alt="Profile"
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h2 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {selectedConversation.participants.find((p) => p.id !== currentUser.id)?.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {selectedConversation.participants.find((p) => p.id !== currentUser.id)?.isOnline
                          ? 'Online'
                          : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" className="hidden sm:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button type="button" className="hidden sm:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <Video className="h-5 w-5" />
                    </button>
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((msg, index) => {
                    const isOwnMessage = msg.sender.id === currentUser.id
                    
                    return (
                      <div
                        key={index}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? 'bg-primary-500 text-white rounded-br-md'
                                : 'bg-gray-100 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <div className={`flex items-center space-x-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(msg.createdAt)}
                            </span>
                            {isOwnMessage && (
                              <span className="text-xs text-gray-500">
                                {msg.isRead ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3" />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end space-x-3">
                    {/* Attachment Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      
                      {showAttachmentMenu && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors duration-200">
                            <Image className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Photo</span>
                          </button>
                          <button className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-50 rounded transition-colors duration-200">
                            <File className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">Document</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="flex-1 relative">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={simulateTyping}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                      />
                    </div>

                    {/* Emoji Picker */}
                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Smile className="h-5 w-5" />
                      </button>
                      
                      {showEmojiPicker && (
                        <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                          <div className="grid grid-cols-8 gap-1">
                            {['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '❤️', '🔥', '💯', '✨', '🎉', '🙏', '👏', '💪', '🤝'].map((emoji, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setMessage(prev => prev + emoji)
                                  setShowEmojiPicker(false)
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <MessageCircle className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 