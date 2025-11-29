'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Interface untuk chat items
interface ChatItem {
  id: string
  type: 'owner' | 'mod' | 'member' | 'viewer' | 'superchat' | 'membership' | 'sticker'
  author: string
  message?: string
  timestamp: Date
  amount?: number
  tier?: number
  color?: string
  badge?: string
  duration?: number
}

// Sample data generators
const generateSampleChats = (type: 'owner' | 'mod' | 'member' | 'viewer'): ChatItem => {
  const messages = {
    owner: [
      "Welcome to the stream everyone! 🎉",
      "Thanks for joining us today!",
      "Don't forget to like and subscribe!",
      "We've got some great content today!",
      "Appreciate all the support! 🙏"
    ],
    mod: [
      "Please keep chat respectful everyone",
      "Use !commands to see available commands",
      "Welcome new viewers!",
      "Reminder: No self-promotion in chat",
      "Timeouts will be given for rule breaking"
    ],
    member: [
      "Love your content! 💖",
      "This stream is amazing!",
      "Been here since the beginning!",
      "Can't wait for the next stream!",
      "The member perks are awesome!"
    ],
    viewer: [
      "Hello from Indonesia! 🇮🇩",
      "First time watching, great stream!",
      "How is everyone doing?",
      "This is so entertaining!",
      "LOL that was funny!"
    ]
  }

  const authors = {
    owner: ["ChannelOwner", "StreamerPro"],
    mod: ["AwesomeMod", "ChatGuardian", "StreamHelper"],
    member: ["LoyalMember", "SuperFan", "VIPViewer"],
    viewer: ["RandomViewer", "CuriousCat", "Traveler", "NewViewer"]
  }

  const colors = {
    owner: '#FF0000',
    mod: '#5e84f1', 
    member: '#29a13e',
    viewer: '#FFFFFF'
  }

  const badges = {
    owner: 'OWNER',
    mod: 'MOD',
    member: 'MEMBER',
    viewer: ''
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    author: authors[type][Math.floor(Math.random() * authors[type].length)],
    message: messages[type][Math.floor(Math.random() * messages[type].length)],
    timestamp: new Date(),
    color: colors[type],
    badge: badges[type]
  }
}

const generateSuperChat = (tier: number = 1): ChatItem => {
  const tiers = {
    1: { color: '#1E88E5', amount: Math.floor(Math.random() * 10) + 1 },
    2: { color: '#00E5FF', amount: Math.floor(Math.random() * 10) + 10 },
    3: { color: '#1DE9B6', amount: Math.floor(Math.random() * 30) + 20 },
    4: { color: '#FFCA28', amount: Math.floor(Math.random() * 50) + 50 },
    5: { color: '#FF9800', amount: Math.floor(Math.random() * 100) + 100 },
    6: { color: '#E91E63', amount: Math.floor(Math.random() * 300) + 200 },
    7: { color: '#E62117', amount: Math.floor(Math.random() * 500) + 500 }
  }

  const tierData = tiers[tier as keyof typeof tiers] || tiers[1]
  const superChatMessages = [
    "Amazing content! Keep it up!",
    "Thanks for the great stream!",
    "You deserve this!",
    "This stream is awesome!",
    "Worth every penny!"
  ]

  const superChatAuthors = ["SuperSupporter", "BigFan", "LoyalViewer"]

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: 'superchat',
    author: superChatAuthors[Math.floor(Math.random() * superChatAuthors.length)],
    message: superChatMessages[Math.floor(Math.random() * superChatMessages.length)],
    timestamp: new Date(),
    amount: tierData.amount,
    tier: tier,
    color: tierData.color
  }
}

const generateMembership = (): ChatItem => {
  const membershipMessages = [
    "Just became a member! Excited to be part of the community!",
    "Happy to support the channel as a new member!",
    "Member perks here I come! So excited!",
    "Finally decided to become a member! Worth it!"
  ]

  return {
    id: Math.random().toString(36).substr(2, 9),
    type: 'membership',
    author: "NewMember",
    message: membershipMessages[Math.floor(Math.random() * membershipMessages.length)],
    timestamp: new Date(),
    color: '#29a13e',
    badge: 'MEMBER'
  }
}

const generateSticker = (): ChatItem => {
  const stickerUrls = ["🎉", "🔥", "❤️", "😂", "😍"]
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: 'sticker',
    author: "StickerLover",
    message: stickerUrls[Math.floor(Math.random() * stickerUrls.length)],
    timestamp: new Date(),
    color: '#FFD700'
  }
}

// CSS Converter Utility - FIXED VERSION
const convertYouTubeCssToSimulator = (youtubeCss: string): string => {
  console.log('🎨 Converting YouTube CSS for simulator...')
  
  // Basic direct replacement - no complex logic
  let convertedCss = youtubeCss
    // Replace YouTube-specific selectors with our classes
    .replace(/yt-live-chat-text-message-renderer/g, '.yt-live-chat-message')
    .replace(/yt-live-chat-renderer/g, '.chat-simulator-container')
    .replace(/yt-live-chat-item-list-renderer/g, '.messages-container')
    .replace(/#contents/g, '.messages-container')
    .replace(/#items/g, '.messages-container')
    
    // Author type selectors
    .replace(/\[author-type="owner"\]/g, '.message-owner')
    .replace(/\[author-type="moderator"\]/g, '.message-mod')
    .replace(/\[author-type="member"\]/g, '.message-member')
    
    // Content selectors
    .replace(/#content/g, '.message-content')
    .replace(/#author-name/g, '.author-name')
    .replace(/#message/g, '.message-text')
    .replace(/#author-photo/g, '.author-photo')

  // Add our base simulator styles
  convertedCss += `
    /* === SIMULATOR BASE STYLES === */
    .chat-simulator-container {
      background: transparent !important;
      height: 100vh;
      padding: 20px;
      font-family: 'Roboto', Arial, sans-serif;
    }
    
    .messages-container {
      display: flex;
      flex-direction: column-reverse;
      gap: 12px;
      height: 100%;
      overflow-y: auto;
      padding: 10px;
    }
    
    .yt-live-chat-message {
      position: relative;
      margin: 0;
      animation: slideIn 0.3s ease-out;
    }
    
    .message-content {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 12px;
      background: rgba(30, 30, 30, 0.8);
      border: 2px solid transparent;
      position: relative;
    }
    
    .author-photo {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: bold;
    }
    
    .message-main {
      flex: 1;
      min-width: 0;
    }
    
    .author-line {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    
    .author-name {
      font-weight: 700;
      font-size: 14px;
      color: #ffffff;
    }
    
    .author-badge {
      font-size: 10px;
      padding: 2px 8px;
      background: #666;
      color: white;
      border-radius: 12px;
      font-weight: bold;
    }
    
    .message-text {
      color: #e0e0e0;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }
    
    .super-chat {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding: 6px 10px;
      background: rgba(255, 215, 0, 0.2);
      border-radius: 6px;
      border-left: 3px solid gold;
    }
    
    .amount {
      font-weight: bold;
      color: #FFD700;
      font-size: 16px;
    }
    
    .tier {
      font-size: 11px;
      color: #FFA000;
      background: rgba(255, 160, 0, 0.2);
      padding: 2px 6px;
      border-radius: 4px;
    }
    
    .message-timestamp {
      font-size: 10px;
      color: #888;
      text-align: right;
      margin-top: 4px;
    }
    
    /* Author type specific base colors */
    .message-owner .author-name { color: #FF0000 !important; }
    .message-mod .author-name { color: #5e84f1 !important; }
    .message-member .author-name { color: #29a13e !important; }
    
    .message-owner .author-badge { background: #FF0000 !important; }
    .message-mod .author-badge { background: #5e84f1 !important; }
    .message-member .author-badge { background: #29a13e !important; }
    
    /* Animation */
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Debug border - will be visible if CSS is applied */
    .yt-live-chat-message {
      border-left: 3px solid #00ff00 !important;
    }
  `

  console.log('✅ CSS conversion completed')
  return convertedCss
}

// Chat Bubble Component
function ChatBubble({ item }: { item: ChatItem }) {
  const getAuthorTypeClass = () => {
    switch (item.type) {
      case 'owner': return 'message-owner'
      case 'mod': return 'message-mod'
      case 'member': return 'message-member'
      default: return 'message-viewer'
    }
  }

  // Get initial for avatar
  const getAuthorInitial = () => {
    return item.author.charAt(0).toUpperCase()
  }

  return (
    <div className={`yt-live-chat-message ${getAuthorTypeClass()}`}>
      <div className="message-content">
        {/* Author Photo with initial */}
        <div className="author-photo">
          {getAuthorInitial()}
        </div>
        
        {/* Message Content */}
        <div className="message-main">
          <div className="author-line">
            <span className="author-name">
              {item.author}
            </span>
            {item.badge && (
              <span className="author-badge">{item.badge}</span>
            )}
          </div>
          
          <div className="message-text">
            {item.message}
          </div>

          {/* Super Chat */}
          {item.amount && (
            <div className="super-chat">
              <span className="amount">${item.amount}</span>
              {item.tier && (
                <span className="tier">Tier {item.tier}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="message-timestamp">
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}

// Main Chat Simulator Component
export default function ChatSimulator() {
  const [chatItems, setChatItems] = useState<ChatItem[]>([])
  const [customCss, setCustomCss] = useState('')
  const [convertedCss, setConvertedCss] = useState('')
  const [isCssApplied, setIsCssApplied] = useState(false)

  // Initialize with demo messages
  useEffect(() => {
    const demoMessages = [
      generateSampleChats('owner'),
      generateSampleChats('mod'),
      generateSampleChats('member'),
      generateSampleChats('viewer')
    ]

    const timer = setTimeout(() => {
      setChatItems(demoMessages)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Load and convert CSS from localStorage
  useEffect(() => {
    const savedCss = localStorage.getItem('ytlcv2-custom-css')
    console.log('💾 Loading CSS from storage:', savedCss ? 'Found' : 'Not found')
    
    if (savedCss) {
      setCustomCss(savedCss)
      const converted = convertYouTubeCssToSimulator(savedCss)
      setConvertedCss(converted)
    }
  }, [])

  // Apply CSS to document - FIXED VERSION
  useEffect(() => {
    if (!convertedCss) return

    console.log('🚀 Applying CSS to document...')

    // Remove existing style elements
    const existingStyles = document.querySelectorAll('#custom-chat-styles, #custom-chat-styles-backup')
    existingStyles.forEach(style => style.remove())

    // Method 1: Create style element in head
    const styleElement = document.createElement('style')
    styleElement.id = 'custom-chat-styles'
    styleElement.innerHTML = convertedCss
    document.head.appendChild(styleElement)

    // Method 2: Backup style element in body
    const backupStyle = document.createElement('style')
    backupStyle.id = 'custom-chat-styles-backup'
    backupStyle.innerHTML = convertedCss
    document.body.appendChild(backupStyle)

    console.log('✅ CSS applied successfully!')
    setIsCssApplied(true)

    // Force re-render to ensure styles are applied
    setTimeout(() => {
      setChatItems(prev => [...prev])
    }, 100)

  }, [convertedCss])

  // Chat functions
  const addRandomChat = useCallback(() => {
    const types: ('owner' | 'mod' | 'member' | 'viewer')[] = 
      ['viewer', 'viewer', 'viewer', 'member', 'member', 'mod', 'owner']
    const randomType = types[Math.floor(Math.random() * types.length)]
    const newChat = generateSampleChats(randomType)
    setChatItems(prev => [newChat, ...prev].slice(0, 50))
  }, [])

  const addSpecificChat = useCallback((type: 'owner' | 'mod' | 'member' | 'viewer') => {
    const newChat = generateSampleChats(type)
    setChatItems(prev => [newChat, ...prev].slice(0, 50))
  }, [])

  const addSuperChat = useCallback((tier?: number) => {
    const newChat = generateSuperChat(tier)
    setChatItems(prev => [newChat, ...prev].slice(0, 50))
  }, [])

  const addMembership = useCallback(() => {
    const newChat = generateMembership()
    setChatItems(prev => [newChat, ...prev].slice(0, 50))
  }, [])

  const addSticker = useCallback(() => {
    const newChat = generateSticker()
    setChatItems(prev => [newChat, ...prev].slice(0, 50))
  }, [])

  const clearChat = useCallback(() => {
    setChatItems([])
  }, [])

  const addTestChats = useCallback(() => {
    const testItems = [
      generateSampleChats('owner'),
      generateSampleChats('mod'),
      generateSampleChats('member'),
      generateSampleChats('viewer'),
      generateSuperChat(3),
      generateMembership(),
      generateSticker()
    ]

    testItems.forEach((item, index) => {
      setTimeout(() => {
        setChatItems(prev => [item, ...prev].slice(0, 50))
      }, index * 300)
    })
  }, [])

  // Expose functions to window
  useEffect(() => {
    // @ts-ignore
    window.chatSimulator = {
      addRandomChat,
      addSpecificChat,
      addSuperChat,
      addMembership,
      addSticker,
      clearChat,
      debugInfo: () => {
        console.log('=== CHAT SIMULATOR DEBUG INFO ===')
        console.log('Chat items:', chatItems.length)
        console.log('Custom CSS loaded:', !!customCss)
        console.log('Converted CSS:', !!convertedCss)
        console.log('CSS Applied:', isCssApplied)
        
        const styleEl = document.getElementById('custom-chat-styles')
        console.log('Style element exists:', !!styleEl)
        console.log('Style content length:', styleEl?.innerHTML?.length || 0)
        
        const messages = document.querySelectorAll('.yt-live-chat-message')
        console.log('Visible messages:', messages.length)
        
        // Check if debug border is visible (green left border)
        if (messages.length > 0) {
          const firstMsg = messages[0] as HTMLElement
          const borderColor = window.getComputedStyle(firstMsg).borderLeftColor
          console.log('Debug border color:', borderColor)
        }
      },
      reloadCss: () => {
        const savedCss = localStorage.getItem('ytlcv2-custom-css')
        if (savedCss) {
          const converted = convertYouTubeCssToSimulator(savedCss)
          setConvertedCss(converted)
          console.log('🔁 CSS reloaded')
        }
      }
    }
  }, [chatItems.length, customCss, convertedCss, isCssApplied, addRandomChat, addSpecificChat, addSuperChat, addMembership, addSticker, clearChat])

  return (
    <div className="chat-simulator-container h-full bg-gradient-to-br from-gray-900 to-black">
      <div className="messages-container">
        <AnimatePresence initial={false}>
          {chatItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <ChatBubble item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={addTestChats}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          Test All Types
        </button>
        <button
          onClick={clearChat}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          Clear Chat
        </button>
        <button
          onClick={() => {
            // @ts-ignore
            window.chatSimulator?.debugInfo?.()
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          Debug Info
        </button>
        <button
          onClick={() => {
            // @ts-ignore
            window.chatSimulator?.reloadCss?.()
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
        >
          Reload CSS
        </button>
      </div>

      {/* Status Panel */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 text-sm border border-gray-700">
        <div className="text-white space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isCssApplied ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span>CSS: <strong>{isCssApplied ? 'APPLIED' : 'NOT APPLIED'}</strong></span>
          </div>
          <div>Messages: <strong>{chatItems.length}</strong></div>
          <div>Custom CSS: <strong>{customCss ? 'LOADED' : 'NOT LOADED'}</strong></div>
        </div>
      </div>

      {/* Empty State */}
      {chatItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-gray-400 bg-black/40 backdrop-blur-sm rounded-2xl p-8 max-w-md border border-gray-700"
          >
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-white mb-2">YouTube Chat Simulator</h3>
            <p className="text-sm mb-2">Paste your YouTube Live Chat CSS in the editor</p>
            <p className="text-xs text-gray-500 mb-4">Look for green left border to verify CSS is applied</p>
            <button
              onClick={addTestChats}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
            >
              Start Demo
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}