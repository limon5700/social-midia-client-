import {
  User,
  Shield,
  Bell,
  Palette,
  Lock,
} from 'lucide-react'
import { currentUser } from '@/data/mockData'

export type SettingsSection = 'account' | 'privacy' | 'notifications' | 'theme' | 'security'
export type SettingsFormSection = Exclude<SettingsSection, 'privacy'>

export interface SettingItem {
  id: string
  label: string
  description: string
  type: 'toggle' | 'dropdown' | 'input' | 'textarea' | 'button'
  value?: unknown
  options?: { label: string; value: string }[]
  placeholder?: string
  icon?: React.ComponentType<{ className?: string }>
}

export const settingsData: Record<SettingsFormSection, SettingItem[]> = {
  account: [
    {
      id: 'display-name',
      label: 'Display Name',
      description: 'Your name as it appears to other users',
      type: 'input',
      value: currentUser.name,
      placeholder: 'Enter your display name',
    },
    {
      id: 'username',
      label: 'Username',
      description: 'Your unique username for the platform',
      type: 'input',
      value: currentUser.username,
      placeholder: 'Enter username',
    },
    {
      id: 'bio',
      label: 'Bio',
      description: 'Tell others about yourself',
      type: 'textarea',
      value: currentUser.bio,
      placeholder: 'Write something about yourself...',
    },
    {
      id: 'email',
      label: 'Email Address',
      description: 'Your email for account notifications',
      type: 'input',
      value: 'user@example.com',
      placeholder: 'Enter your email',
    },
    {
      id: 'phone',
      label: 'Phone Number',
      description: 'Your phone number for security',
      type: 'input',
      value: '+1 (555) 123-4567',
      placeholder: 'Enter phone number',
    },
    {
      id: 'language',
      label: 'Language',
      description: 'Choose your preferred language',
      type: 'dropdown',
      value: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Chinese', value: 'zh' },
      ],
    },
    {
      id: 'timezone',
      label: 'Time Zone',
      description: 'Your local time zone',
      type: 'dropdown',
      value: 'UTC-5',
      options: [
        { label: 'UTC-8 (Pacific)', value: 'UTC-8' },
        { label: 'UTC-7 (Mountain)', value: 'UTC-7' },
        { label: 'UTC-6 (Central)', value: 'UTC-6' },
        { label: 'UTC-5 (Eastern)', value: 'UTC-5' },
        { label: 'UTC+0 (GMT)', value: 'UTC+0' },
        { label: 'UTC+1 (Central Europe)', value: 'UTC+1' },
      ],
    },
  ],
  notifications: [
    { id: 'push-notifications', label: 'Push Notifications', description: 'Receive notifications on your device', type: 'toggle', value: true },
    { id: 'email-notifications', label: 'Email Notifications', description: 'Receive notifications via email', type: 'toggle', value: true },
    { id: 'new-followers', label: 'New Followers', description: 'When someone follows you', type: 'toggle', value: true },
    { id: 'likes-comments', label: 'Likes & Comments', description: 'When someone likes or comments on your posts', type: 'toggle', value: true },
    { id: 'mentions', label: 'Mentions', description: 'When someone mentions you', type: 'toggle', value: true },
    { id: 'messages', label: 'Messages', description: 'When you receive new messages', type: 'toggle', value: true },
    { id: 'friend-requests', label: 'Friend Requests', description: 'When you receive friend requests', type: 'toggle', value: true },
    { id: 'live-streams', label: 'Live Streams', description: 'When friends go live', type: 'toggle', value: false },
    { id: 'newsletter', label: 'Newsletter', description: 'Receive platform updates and news', type: 'toggle', value: false },
  ],
  theme: [
    {
      id: 'theme-mode',
      label: 'Theme Mode',
      description: 'Choose your preferred theme',
      type: 'dropdown',
      value: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Auto', value: 'auto' },
      ],
    },
    {
      id: 'accent-color',
      label: 'Accent Color',
      description: 'Choose your accent color',
      type: 'dropdown',
      value: 'blue',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Purple', value: 'purple' },
        { label: 'Green', value: 'green' },
        { label: 'Pink', value: 'pink' },
        { label: 'Orange', value: 'orange' },
      ],
    },
    {
      id: 'font-size',
      label: 'Font Size',
      description: 'Adjust the text size',
      type: 'dropdown',
      value: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
    { id: 'reduced-motion', label: 'Reduced Motion', description: 'Reduce animations and motion', type: 'toggle', value: false },
    { id: 'high-contrast', label: 'High Contrast', description: 'Increase contrast for better visibility', type: 'toggle', value: false },
  ],
  security: [
    { id: 'two-factor', label: 'Two-Factor Authentication', description: 'Add an extra layer of security', type: 'toggle', value: false },
    { id: 'login-alerts', label: 'Login Alerts', description: 'Get notified of new login attempts', type: 'toggle', value: true },
    {
      id: 'session-timeout',
      label: 'Session Timeout',
      description: 'Auto-logout after inactivity',
      type: 'dropdown',
      value: '30',
      options: [
        { label: '15 minutes', value: '15' },
        { label: '30 minutes', value: '30' },
        { label: '1 hour', value: '60' },
        { label: 'Never', value: 'never' },
      ],
    },
    { id: 'password-change', label: 'Change Password', description: 'Update your account password', type: 'button', value: 'Change Password' },
    { id: 'active-sessions', label: 'Active Sessions', description: 'Manage your active login sessions', type: 'button', value: 'View Sessions' },
    { id: 'data-export', label: 'Export Data', description: 'Download a copy of your data', type: 'button', value: 'Export Data' },
    { id: 'delete-account', label: 'Delete Account', description: 'Permanently delete your account', type: 'button', value: 'Delete Account' },
  ],
}

export const sidebarItems = [
  { id: 'account' as const, label: 'Account', icon: User },
  { id: 'privacy' as const, label: 'Privacy & Security', icon: Shield },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  { id: 'theme' as const, label: 'Theme', icon: Palette },
  { id: 'security' as const, label: 'Security', icon: Lock },
]

export const SETTINGS_SECTIONS: SettingsSection[] = [
  'account',
  'privacy',
  'notifications',
  'theme',
  'security',
]

export function isSettingsSection(value: string): value is SettingsSection {
  return SETTINGS_SECTIONS.includes(value as SettingsSection)
}

export function settingsSectionHref(id: SettingsSection) {
  return `/settings/${id}`
}
