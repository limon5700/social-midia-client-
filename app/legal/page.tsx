'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface LegalSection {
  id: string
  title: string
  content: string[]
  isExpanded: boolean
}

interface AnchorLink {
  id: string
  title: string
  section: 'terms' | 'privacy'
}

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState<'terms' | 'privacy'>('terms')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['terms-1', 'privacy-1']))
  const [isSticky, setIsSticky] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const termsSections: LegalSection[] = [
    {
      id: 'terms-1',
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
        'These terms of service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.',
        'Any new features or tools which are added to the current store shall also be subject to the Terms of Service.'
      ],
      isExpanded: true
    },
    {
      id: 'terms-2',
      title: 'Use License',
      content: [
        'Permission is granted to temporarily download one copy of the materials (information or software) on this website for personal, non-commercial transitory viewing only.',
        'This is the grant of a license, not a transfer of title, and under this license you may not:',
        '• Modify or copy the materials',
        '• Use the materials for any commercial purpose or for any public display (commercial or non-commercial)',
        '• Attempt to decompile or reverse engineer any software contained on this website',
        '• Remove any copyright or other proprietary notations from the materials',
        '• Transfer the materials to another person or "mirror" the materials on any other server'
      ],
      isExpanded: false
    },
    {
      id: 'terms-3',
      title: 'User Account',
      content: [
        'If you create an account on the website, you are responsible for maintaining the security of your account, and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.',
        'You must immediately notify us of any unauthorized uses of your account or any other breaches of security. We will not be liable for any acts or omissions by you, including any damages of any kind incurred as a result of such acts or omissions.',
        'You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you without appropriate authorization, or a name that is otherwise offensive, vulgar or obscene.'
      ],
      isExpanded: false
    },
    {
      id: 'terms-4',
      title: 'Intellectual Property',
      content: [
        'The Service and its original content, features, and functionality are and will remain the exclusive property of the Company and its licensors. The Service is protected by copyright, trademark, and other laws.',
        'Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Company.',
        'You retain ownership of any intellectual property rights that you hold in that content. In short, what\'s yours stays yours.',
        'When you upload, submit, store, send or receive content to or through our Services, you give us a worldwide license to use, host, store, reproduce, modify, create derivative works, communicate, publish, publicly perform, publicly display and distribute such content.'
      ],
      isExpanded: false
    },
    {
      id: 'terms-5',
      title: 'Limitation of Liability',
      content: [
        'In no event shall the Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:',
        '• Your use or inability to use the Service',
        '• Any unauthorized access to or use of our servers and/or any personal information stored therein',
        '• Any interruption or cessation of transmission to or from the Service',
        '• Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service by any third party',
        '• Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, transmitted, or otherwise made available via the Service'
      ],
      isExpanded: false
    },
    {
      id: 'terms-6',
      title: 'Termination',
      content: [
        'We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.',
        'If you wish to terminate your account, you may simply discontinue using the Service.',
        'All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.',
        'Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service.'
      ],
      isExpanded: false
    }
  ]

  const privacySections: LegalSection[] = [
    {
      id: 'privacy-1',
      title: 'Information We Collect',
      content: [
        'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.',
        'Personal information we may collect includes:',
        '• Name and contact information (email address, phone number)',
        '• Account credentials and profile information',
        '• Payment and billing information',
        '• Communications with us',
        '• Information about your use of our services',
        'We also automatically collect certain information when you use our services, including:',
        '• Device information (IP address, browser type, operating system)',
        '• Usage data (pages visited, features used, time spent)',
        '• Location information (if you enable location services)'
      ],
      isExpanded: true
    },
    {
      id: 'privacy-2',
      title: 'How We Use Your Information',
      content: [
        'We use the information we collect to:',
        '• Provide, maintain, and improve our services',
        '• Process transactions and send related information',
        '• Send you technical notices, updates, security alerts, and support messages',
        '• Respond to your comments, questions, and customer service requests',
        '• Communicate with you about products, services, offers, and events',
        '• Monitor and analyze trends, usage, and activities in connection with our services',
        '• Detect, investigate, and prevent fraudulent transactions and other illegal activities',
        '• Personalize and improve your experience',
        '• Comply with legal obligations'
      ],
      isExpanded: false
    },
    {
      id: 'privacy-3',
      title: 'Information Sharing',
      content: [
        'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:',
        '• With your consent or at your direction',
        '• With service providers who perform services on our behalf',
        '• To comply with legal obligations or protect our rights',
        '• In connection with a business transfer (merger, acquisition, or sale of assets)',
        '• To protect the safety and security of our users and services',
        'We may share aggregated or de-identified information that does not identify you personally.',
        'We require our service providers to use your information only as directed by us and in accordance with this Privacy Policy.'
      ],
      isExpanded: false
    },
    {
      id: 'privacy-4',
      title: 'Data Security',
      content: [
        'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
        'These measures include:',
        '• Encryption of data in transit and at rest',
        '• Regular security assessments and updates',
        '• Access controls and authentication',
        '• Secure data centers and infrastructure',
        '• Employee training on data protection',
        'However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.',
        'If you have reason to believe that your interaction with us is no longer secure, please contact us immediately.'
      ],
      isExpanded: false
    },
    {
      id: 'privacy-5',
      title: 'Your Rights and Choices',
      content: [
        'You have certain rights regarding your personal information, including:',
        '• Access: You can request access to the personal information we hold about you',
        '• Correction: You can request that we correct inaccurate or incomplete information',
        '• Deletion: You can request that we delete your personal information',
        '• Portability: You can request a copy of your data in a portable format',
        '• Objection: You can object to certain processing of your personal information',
        '• Restriction: You can request that we restrict processing of your information',
        'To exercise these rights, please contact us using the information provided below.',
        'You can also control your information through your account settings and opt out of certain communications.'
      ],
      isExpanded: false
    },
    {
      id: 'privacy-6',
      title: 'Cookies and Tracking',
      content: [
        'We use cookies and similar tracking technologies to collect information about your browsing activities and to remember your preferences.',
        'Types of cookies we use:',
        '• Essential cookies: Required for basic site functionality',
        '• Performance cookies: Help us understand how visitors interact with our site',
        '• Functional cookies: Remember your preferences and settings',
        '• Marketing cookies: Used to deliver relevant advertisements',
        'You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our services.',
        'We may also use third-party analytics services that collect information about your use of our services.',
        'For more information about our use of cookies, please see our Cookie Policy.'
      ],
      isExpanded: false
    },
    {
      id: 'privacy-7',
      title: 'Children\'s Privacy',
      content: [
        'Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.',
        'If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.',
        'If we become aware that we have collected personal information from children without verification of parental consent, we take steps to remove that information from our servers.',
        'For users between the ages of 13 and 18, we recommend parental guidance when using our services.',
        'We comply with applicable laws regarding the protection of children\'s privacy, including the Children\'s Online Privacy Protection Act (COPPA).'
      ],
      isExpanded: false
    },
    {
      id: 'privacy-8',
      title: 'International Transfers',
      content: [
        'Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws than your country.',
        'When we transfer your information internationally, we ensure appropriate safeguards are in place to protect your information.',
        'These safeguards may include:',
        '• Standard contractual clauses approved by relevant authorities',
        '• Adequacy decisions by relevant authorities',
        '• Other appropriate safeguards as required by law',
        'By using our services, you consent to the transfer of your information to countries outside your country of residence.',
        'We will continue to protect your information in accordance with this Privacy Policy regardless of where it is processed.'
      ],
      isExpanded: false
    }
  ]

  const anchorLinks: AnchorLink[] = [
    // Terms of Service anchors
    { id: 'terms-1', title: 'Acceptance of Terms', section: 'terms' },
    { id: 'terms-2', title: 'Use License', section: 'terms' },
    { id: 'terms-3', title: 'User Account', section: 'terms' },
    { id: 'terms-4', title: 'Intellectual Property', section: 'terms' },
    { id: 'terms-5', title: 'Limitation of Liability', section: 'terms' },
    { id: 'terms-6', title: 'Termination', section: 'terms' },
    // Privacy Policy anchors
    { id: 'privacy-1', title: 'Information We Collect', section: 'privacy' },
    { id: 'privacy-2', title: 'How We Use Your Information', section: 'privacy' },
    { id: 'privacy-3', title: 'Information Sharing', section: 'privacy' },
    { id: 'privacy-4', title: 'Data Security', section: 'privacy' },
    { id: 'privacy-5', title: 'Your Rights and Choices', section: 'privacy' },
    { id: 'privacy-6', title: 'Cookies and Tracking', section: 'privacy' },
    { id: 'privacy-7', title: 'Children\'s Privacy', section: 'privacy' },
    { id: 'privacy-8', title: 'International Transfers', section: 'privacy' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        setIsSticky(rect.bottom <= 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight || 0
      const elementPosition = element.offsetTop - headerHeight - 20
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  const currentSections = activeSection === 'terms' ? termsSections : privacySections
  const currentAnchorLinks = anchorLinks.filter(link => link.section === activeSection)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div ref={headerRef} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Legal Information</h1>
            <p className="text-gray-600 mt-2">
              Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveSection('terms')}
                className={`flex-1 px-6 py-4 font-medium transition-colors duration-200 ${
                  activeSection === 'terms'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveSection('privacy')}
                className={`flex-1 px-6 py-4 font-medium transition-colors duration-200 ${
                  activeSection === 'privacy'
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Privacy Policy
              </button>
            </div>

            <div className="p-6">
              {/* Anchor Navigation */}
              <div className={`mb-6 transition-all duration-300 ${isSticky ? 'sticky top-20 z-10 bg-white border-b border-gray-200 pb-4' : ''}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Navigation</h3>
                <div className="flex flex-wrap gap-2">
                  {currentAnchorLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      {link.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-6">
                {currentSections.map((section) => (
                  <div key={section.id} id={section.id} className="bg-gray-50 rounded-xl p-6">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      {expandedSections.has(section.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSections.has(section.id) && (
                      <div className="mt-4 space-y-3 text-gray-700 leading-relaxed">
                        {section.content.map((paragraph, index) => (
                          <p key={index} className="text-sm">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-500">
                  <p>Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p className="mt-2">
                    For questions about these terms, please contact us at{' '}
                    <a href="mailto:legal@socialapp.com" className="text-blue-500 hover:text-blue-600">
                      legal@socialapp.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 