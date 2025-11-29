'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, RotateCcw, Copy, Check, Download, Upload } from 'lucide-react'

interface CssEditorProps {
  isOpen: boolean
  onClose: () => void
  onCssChange: (css: string) => void
}

// Default CSS template
const defaultCssTemplate = `/* Custom CSS untuk YouTube Live Chat Simulator */

/* Container utama chat */
.yt-live-chat-item-list-renderer {
  background: transparent !important;
  padding: 10px;
}

/* Pesan chat biasa */
.yt-live-chat-text-message-renderer {
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px;
  margin: 6px 0;
  padding: 10px 14px;
  border-left: 4px solid #4285f4;
  backdrop-filter: blur(10px);
}

/* Chat Owner */
.yt-live-chat-text-message-renderer[author-is-owner] {
  background: linear-gradient(135deg, #ff4444, #ff6666) !important;
  border-left: 4px solid #ff0000;
  color: white;
}

/* Moderator */
.yt-live-chat-text-message-renderer[author-is-chat-owner] {
  background: linear-gradient(135deg, #44ff44, #66ff66) !important;
  border-left: 4px solid #00ff00;
  color: black;
}

/* Super Chat */
.yt-live-chat-paid-message-renderer {
  background: linear-gradient(135deg, #ffff44, #ffff66) !important;
  border: 2px solid gold;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
}

/* Membership */
.yt-live-chat-membership-item-renderer {
  background: linear-gradient(135deg, #29a13e, #34a853) !important;
  border-radius: 16px;
  color: white;
}

/* Animasi untuk new messages */
@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.yt-live-chat-text-message-renderer {
  animation: messageSlideIn 0.3s ease-out;
}

/* Custom scrollbar */
.chat-container::-webkit-scrollbar {
  width: 8px;
}

.chat-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
`

export default function CssEditor({ isOpen, onClose, onCssChange }: CssEditorProps) {
  const [cssCode, setCssCode] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Load saved CSS on open
  useEffect(() => {
    if (isOpen) {
      const savedCss = localStorage.getItem('ytlcv2-custom-css') || defaultCssTemplate
      setCssCode(savedCss)
      setIsSaved(true)
      // Apply immediately for preview
      onCssChange(savedCss)
    }
  }, [isOpen, onCssChange])

  const handleSave = () => {
    localStorage.setItem('ytlcv2-custom-css', cssCode)
    onCssChange(cssCode)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleReset = () => {
    setCssCode(defaultCssTemplate)
    setIsSaved(false)
    onCssChange(defaultCssTemplate)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([cssCode], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'youtube-chat-widget.css'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCssCode(content)
        setIsSaved(false)
        onCssChange(content)
      }
      reader.readAsText(file)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
          <div>
            <h2 className="text-2xl font-bold text-white">CSS Editor</h2>
            <p className="text-sm text-gray-400 mt-1">
              Edit custom CSS untuk YouTube Live Chat Widget. Perubahan langsung terlihat di preview.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {isSaved && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-400 text-sm flex items-center bg-green-400/10 px-3 py-1 rounded-full"
              >
                <Check size={16} className="mr-1" />
                Tersimpan
              </motion.span>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X size={24} />
            </motion.button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Save size={16} />
                <span>Simpan CSS</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <RotateCcw size={16} />
                <span>Reset Default</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                <span>{isCopied ? 'Tersalin!' : 'Salin CSS'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Download size={16} />
                <span>Download</span>
              </motion.button>

              <label className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                <Upload size={16} />
                <span>Upload CSS</span>
                <input
                  type="file"
                  accept=".css"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-xs text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
              Real-time Preview
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex min-h-0">
            {/* Line Numbers */}
            <div className="w-12 bg-gray-800 text-gray-500 text-right font-mono text-sm overflow-hidden flex-shrink-0 border-r border-gray-700">
              {cssCode.split('\n').map((_, i) => (
                <div key={i} className="pr-2 py-0.5 leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Text Area */}
            <textarea
              value={cssCode}
              onChange={(e) => {
                setCssCode(e.target.value)
                setIsSaved(false)
                // Real-time preview
                onCssChange(e.target.value)
              }}
              placeholder="/* Paste CSS widget Anda di sini... */"
              className="flex-1 bg-gray-950 text-green-400 font-mono text-sm p-6 resize-none focus:outline-none border-none leading-6"
              spellCheck="false"
              style={{ 
                tabSize: 2,
                fontFamily: 'Monaco, "JetBrains Mono", "Fira Code", monospace'
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-400">
              <span className="text-green-400 font-mono">Tip:</span> Gunakan CSS selector seperti{' '}
              <code className="bg-gray-700 px-2 py-1 rounded text-green-300">.yt-live-chat-text-message-renderer</code>
              {' '}untuk styling chat
            </div>
            <div className="text-gray-400 font-mono">
              {cssCode.length} chars • {cssCode.split('\n').length} lines
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}