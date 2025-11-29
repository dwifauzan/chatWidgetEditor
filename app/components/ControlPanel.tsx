'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Star, 
  Code, 
  Zap,
  Gift,
  Sticker,
  ChevronRight,
  Settings,
  Users,
  DollarSign,
  Crown,
  Sparkles,
  Trash2,
  Play,
  Square
} from 'lucide-react'
import CssEditor from './CssEditor'

// Types untuk chat simulator functions
interface ChatSimulatorFunctions {
  addRandomChat: () => void
  addSpecificChat: (type: 'owner' | 'mod' | 'member' | 'viewer') => void
  addSuperChat: (tier?: number) => void
  addMembership: () => void
  addSticker: () => void
  clearChat: () => void
}

export default function ControlPanel() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isCssEditorOpen, setIsCssEditorOpen] = useState(false)
  const [customCss, setCustomCss] = useState('')
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [autoInterval, setAutoInterval] = useState<NodeJS.Timeout | null>(null)
  const [chatStats, setChatStats] = useState({
    total: 0,
    lastType: 'none'
  })

  // Chat simulator functions dari window
  const [chatFunctions, setChatFunctions] = useState<ChatSimulatorFunctions>({
    addRandomChat: () => {},
    addSpecificChat: () => {},
    addSuperChat: () => {},
    addMembership: () => {},
    addSticker: () => {},
    clearChat: () => {}
  })

  // Load chat functions dari window
  useEffect(() => {
    const checkChatFunctions = () => {
      // @ts-ignore
      if (window.chatSimulator) {
        // @ts-ignore
        setChatFunctions(window.chatSimulator)
      } else {
        // Retry setelah 1 detik jika belum tersedia
        setTimeout(checkChatFunctions, 1000)
      }
    }

    checkChatFunctions()
  }, [])

  // Update stats periodically
  useEffect(() => {
    const updateStats = () => {
      const chatContainer = document.querySelector('.chat-container')
      if (chatContainer) {
        const chatItems = chatContainer.querySelectorAll('.chat-container > div')
        setChatStats(prev => ({
          ...prev,
          total: chatItems.length
        }))
      }
    }

    const statsInterval = setInterval(updateStats, 1000)
    return () => clearInterval(statsInterval)
  }, [])

  // Auto mode functionality
  useEffect(() => {
    if (isAutoMode) {
      const interval = setInterval(() => {
        const actions = [
          () => chatFunctions.addRandomChat(),
          () => chatFunctions.addSuperChat(Math.floor(Math.random() * 7) + 1),
          () => chatFunctions.addMembership(),
          () => chatFunctions.addSticker()
        ]
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        randomAction()
      }, 2000) // Add new item every 2 seconds

      setAutoInterval(interval)
    } else {
      if (autoInterval) {
        clearInterval(autoInterval)
        setAutoInterval(null)
      }
    }

    return () => {
      if (autoInterval) {
        clearInterval(autoInterval)
      }
    }
  }, [isAutoMode, chatFunctions])

  const menuItems = [
    {
      id: 'chat',
      icon: MessageCircle,
      label: 'Random Chat',
      action: () => {
        chatFunctions.addRandomChat()
        setActiveMenu(null)
      },
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      submenu: [
        { 
          label: 'Owner Chat', 
          action: () => chatFunctions.addSpecificChat('owner'),
          icon: Crown,
          color: 'text-red-400',
          description: 'Channel owner message'
        },
        { 
          label: 'Moderator Chat', 
          action: () => chatFunctions.addSpecificChat('mod'),
          icon: Settings,
          color: 'text-blue-400',
          description: 'Moderator message'
        },
        { 
          label: 'Member Chat', 
          action: () => chatFunctions.addSpecificChat('member'),
          icon: Star,
          color: 'text-green-400',
          description: 'Member message'
        },
        { 
          label: 'Viewer Chat', 
          action: () => chatFunctions.addSpecificChat('viewer'),
          icon: Users,
          color: 'text-gray-400',
          description: 'Regular viewer message'
        },
      ]
    },
    {
      id: 'superchat',
      icon: Zap,
      label: 'Super Chat',
      action: () => {
        chatFunctions.addSuperChat()
        setActiveMenu(null)
      },
      color: 'from-yellow-500 to-orange-500',
      hoverColor: 'hover:from-yellow-600 hover:to-orange-600',
      submenu: [1,2,3,4,5,6,7].map(tier => ({
        label: `Tier ${tier}`,
        action: () => chatFunctions.addSuperChat(tier),
        icon: DollarSign,
        color: `text-yellow-${300 + tier * 100}`,
        badge: `$${tier * 10 + 5}`,
        description: `$${tier * 10}-${tier * 20}`
      }))
    },
    {
      id: 'membership',
      icon: Sparkles,
      label: 'Membership',
      action: () => {
        chatFunctions.addMembership()
        setActiveMenu(null)
      },
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-600 hover:to-emerald-700',
      submenu: [
        { 
          label: 'Join Member', 
          action: chatFunctions.addMembership,
          icon: Star,
          color: 'text-green-400',
          description: 'New membership'
        },
        { 
          label: 'Member Gift', 
          action: chatFunctions.addSticker,
          icon: Gift,
          color: 'text-purple-400',
          description: 'Gift membership'
        },
      ]
    },
    {
      id: 'sticker',
      icon: Sticker,
      label: 'Sticker',
      action: () => {
        chatFunctions.addSticker()
        setActiveMenu(null)
      },
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      id: 'auto',
      icon: isAutoMode ? Square : Play,
      label: isAutoMode ? 'Stop Auto' : 'Auto Mode',
      action: () => {
        setIsAutoMode(!isAutoMode)
        setActiveMenu(null)
      },
      color: isAutoMode 
        ? 'from-red-500 to-pink-600' 
        : 'from-green-500 to-teal-600',
      hoverColor: isAutoMode 
        ? 'hover:from-red-600 hover:to-pink-700'
        : 'hover:from-green-600 hover:to-teal-700'
    },
    {
      id: 'clear',
      icon: Trash2,
      label: 'Clear Chat',
      action: () => {
        chatFunctions.clearChat()
        setActiveMenu(null)
      },
      color: 'from-gray-600 to-gray-700',
      hoverColor: 'hover:from-gray-700 hover:to-gray-800'
    },
    {
      id: 'css',
      icon: Code,
      label: 'CSS Editor',
      action: () => {
        setIsCssEditorOpen(true)
        setActiveMenu(null)
      },
      color: 'from-indigo-500 to-purple-600',
      hoverColor: 'hover:from-indigo-600 hover:to-purple-700'
    }
  ]

  const handleMenuClick = (itemId: string) => {
    if (activeMenu === itemId) {
      setActiveMenu(null)
    } else {
      setActiveMenu(itemId)
    }
  }

  const handleCssChange = (css: string) => {
    setCustomCss(css)
  }

  const quickActions = [
    {
      label: 'Quick Demo',
      action: () => {
        // Add multiple chat types quickly
        chatFunctions.addSpecificChat('owner')
        setTimeout(() => chatFunctions.addSpecificChat('mod'), 300)
        setTimeout(() => chatFunctions.addSuperChat(3), 600)
        setTimeout(() => chatFunctions.addMembership(), 900)
        setTimeout(() => chatFunctions.addSticker(), 1200)
      },
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      label: 'Mass Chat',
      action: () => {
        for (let i = 0; i < 10; i++) {
          setTimeout(() => chatFunctions.addRandomChat(), i * 200)
        }
      },
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    }
  ]

  return (
    <>
      <div className="bg-gray-900 border-t border-gray-700">
        {/* Main Control Panel */}
        <div className="p-4">
          <div className="flex items-center justify-center space-x-3 flex-wrap gap-3">
            {menuItems.map((item) => (
              <div key={item.id} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => item.id === 'css' || item.id === 'auto' || item.id === 'clear' ? item.action() : handleMenuClick(item.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 bg-gradient-to-r ${item.color} ${item.hoverColor} text-white font-medium min-w-[140px] justify-center shadow-lg`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                  {item.submenu && (
                    <ChevronRight 
                      size={16} 
                      className={`transform transition-transform ${
                        activeMenu === item.id ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </motion.button>

                {/* Submenu */}
                {item.submenu && activeMenu === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-2 min-w-[200px] z-10 backdrop-blur-sm"
                  >
                    <div className="text-xs text-gray-400 px-3 py-2 border-b border-gray-700">
                      {item.label} Options
                    </div>
                    {item.submenu.map((subItem, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={subItem.action}
                        className="w-full text-left px-3 py-2 rounded-md text-sm flex items-center space-x-2 group transition-colors"
                      >
                        {subItem.icon && (
                          <subItem.icon size={16} className={subItem.color} />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span>{subItem.label}</span>
                            {subItem.badge && (
                              <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                                {subItem.badge}
                              </span>
                            )}
                          </div>
                          {subItem.description && (
                            <div className="text-xs text-gray-400 mt-1">
                              {subItem.description}
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions & Stats */}
          <div className="flex items-center justify-between mt-4 px-4">
            {/* Quick Actions */}
            <div className="flex space-x-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.action}
                  className={`${action.color} text-white px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-lg`}
                >
                  {action.label}
                </motion.button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isAutoMode ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                }`}></div>
                <span>Auto: {isAutoMode ? 'ON' : 'OFF'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle size={14} />
                <span>Messages: <strong>{chatStats.total}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Code size={14} />
                <span>CSS: <strong>{customCss ? 'Active' : 'Default'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>YTLCV2 Simulator v1.0</span>
              <span>•</span>
              <span>Ready</span>
              {isAutoMode && (
                <>
                  <span>•</span>
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-green-400 font-medium"
                  >
                    Auto Mode Active
                  </motion.span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span>Next.js + Tauri</span>
              <span>•</span>
              <span>YouTube Live Chat</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Editor Modal */}
      <CssEditor 
        isOpen={isCssEditorOpen}
        onClose={() => setIsCssEditorOpen(false)}
        onCssChange={handleCssChange}
      />

      {/* Auto Mode Overlay */}
      <AnimatePresence>
        {isAutoMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap size={16} />
            </motion.div>
            <span className="font-medium">Auto Mode Active</span>
            <button
              onClick={() => setIsAutoMode(false)}
              className="ml-2 hover:bg-red-600 rounded-full p-1 transition-colors"
            >
              <Square size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}