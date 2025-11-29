'use client'
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Update imports to use relative paths
const ChatSimulator = dynamic(() => import('./components/ChatSimulator'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-youtube-red mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading Chat Simulator...</p>
      </div>
    </div>
  )
})

const ControlPanel = dynamic(() => import('./components/ControlPanel'), {
  ssr: false,
  loading: () => (
    <div className="p-4 bg-gray-900 rounded-lg animate-pulse">
      <div className="h-10 bg-gray-800 rounded"></div>
    </div>
  )
})

export default function Home() {
  const [isTauri, setIsTauri] = useState(false)
  const [windowTitle, setWindowTitle] = useState('YTLCV2 Simulator')

  useEffect(() => {
    // Initialize Tauri features
    const initTauri = async () => {
      try {
        // Check if running in Tauri
        if (typeof window !== 'undefined' && window.__TAURI__) {
          setIsTauri(true)
          
          // Dynamically import Tauri APIs
          const { appWindow } = await import('@tauri-apps/api/window')
          
          // Set window title
          await appWindow.setTitle('YTLCV2 - YouTube Live Chat Simulator')
          setWindowTitle('YTLCV2 - YouTube Live Chat Simulator')
          
          // Set window to always on top (optional)
          // await appWindow.setAlwaysOnTop(true)
          
          // Focus the window
          await appWindow.setFocus()
          
          console.log('✅ Tauri environment initialized')
        } else {
          console.log('🌐 Running in browser mode')
          // Set browser tab title
          document.title = 'YTLCV2 Simulator (Browser Mode)'
        }
      } catch (error) {
        console.error('❌ Failed to initialize Tauri:', error)
      }
    }

    initTauri()
  }, [])

  // Handle beforeunload to prevent accidental closure
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isTauri) {
        e.preventDefault()
        e.returnValue = 'Are you sure you want to close? Your CSS changes might not be saved.'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isTauri])

  return (
    <motion.main 
      className="h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Bar */}
      <motion.header 
        className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-8 h-8 bg-youtube-red rounded flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-white font-bold text-sm">YT</span>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-youtube-red to-pink-600 bg-clip-text text-transparent">
              YTLCV2 Simulator
            </h1>
            <p className="text-xs text-gray-400">
              {isTauri ? 'Desktop Mode' : 'Browser Mode'} • YouTube Live Chat Simulator
            </p>
          </div>
        </div>

        {/* Environment Badge */}
        <motion.div 
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isTauri 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isTauri ? '🚀 Desktop App' : '🌐 Web Browser'}
        </motion.div>
      </motion.header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Simulator - Takes most space */}
        <div className="flex-1 min-h-0">
          <ChatSimulator />
        </div>
        
        {/* Control Panel - Fixed at bottom */}
        <div className="shrink-0 border-t border-gray-700 bg-gray-900/80 backdrop-blur-sm">
          <ControlPanel />
        </div>
      </div>

      {/* Footer Status Bar */}
      <motion.footer 
        className="flex items-center justify-between px-4 py-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-400"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Chat Items: 0</span>
          <span>CSS: {isTauri ? 'File System' : 'Local Storage'}</span>
          <span>v1.0.0</span>
        </div>
      </motion.footer>
    </motion.main>
  )
}