import { redirect } from 'next/navigation'

/** Former standalone privacy hub now lives under Settings (same UI). */
export default function PrivacyPage() {
  redirect('/settings?tab=privacy')
}
