"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Info, Timer, Wallet, TrendingUp, AlertTriangle, Maximize2, Minimize2, File, BookOpen, PieChart, Percent, DollarSign } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/contexts/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from 'react-markdown'
import type React from "react"

type Message = {
  text: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "pdf-upload" | "regular" | "pdf-response" | "goal" | "alert"
  goalData?: {
    title: string
    target: number
    timeframe: string
    description?: string
  }
  alertData?: {
    type: "price" | "market" | "news"
    target: string
    condition: string
    notificationMethod: string[]
  }
}

type QuickPrompt = {
  text: string
  category: "investment" | "planning" | "market" | "retirement" | "tax" | "risk"
  icon: React.ReactNode
}

type PdfContext = {
  fileName: string
  summary: string
  topics: string[]
}

// Animation variants remain the same...
const chatContainerVariants = {
  hidden: { scale: 0.9, opacity: 0, y: 20 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { 
    scale: 0.9, 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.2 } 
  }
}

const fullscreenVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 } 
  }
}

const messageVariants = {
  hidden: (isUser: boolean) => ({ opacity: 0, x: isUser ? 20 : -20 }),
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, scale: 0.95 }
}

const promptVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

const Chatbot = () => {
  const { darkMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentPdf, setCurrentPdf] = useState<File | null>(null)
  const [isPdfAnalyzed, setIsPdfAnalyzed] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activePdfContext, setActivePdfContext] = useState<PdfContext | null>(null)
  const [editingGoal, setEditingGoal] = useState<Message['goalData'] | null>(null)
  const [editingAlert, setEditingAlert] = useState<Message['alertData'] | null>(null)

  // Refined quick prompts for more effective interaction with Gemini
  const quickPrompts: QuickPrompt[] = [
    {
      text: "What are the current best investment opportunities in the Jamaican market for a conservative investor?",
      category: "investment",
      icon: <PieChart size={16} />,
    },
    {
      text: "How can I create a diversified investment portfolio with JSE stocks and government bonds?",
      category: "planning",
      icon: <BookOpen size={16} />,
    },
    {
      text: "What are the tax implications of capital gains from JSE investments?",
      category: "tax",
      icon: <DollarSign size={16} />,
    },
    {
      text: "What are the current interest rates and returns for Jamaican government bonds?",
      category: "market",
      icon: <Percent size={16} />,
    },
    {
      text: "How can I protect my investments against inflation and currency fluctuations in Jamaica?",
      category: "risk",
      icon: <AlertTriangle size={16} />,
    },
  ]

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handlePdfUpload = async (file: File) => {
    setIsTyping(true)
    
    // Add user message for PDF upload
    const userMessage: Message = {
      text: `Uploaded document: ${file.name}`,
      sender: "user",
      timestamp: new Date(),
      type: "pdf-upload"
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze PDF")
      }

      const data = await response.json()

      if (data.analysis.isFinanceRelated === false) {
        const botMessage: Message = {
          text: "I apologize, but this document doesn't appear to contain financial information. I can only assist with financial documents and related queries.",
          sender: "bot",
          timestamp: new Date(),
          type: "pdf-response"
        }
        setMessages(prev => [...prev, botMessage])
        return
      }

      // Set PDF context for future reference
      setActivePdfContext({
        fileName: file.name,
        summary: data.analysis.reason,
        topics: data.analysis.topics
      })

      const botMessage: Message = {
        text: data.analysis.reason,
        sender: "bot",
        timestamp: new Date(),
        type: "pdf-response"
      }
      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I couldn't process the PDF. Please ensure it's a valid financial document and try again.",
        sender: "bot",
        timestamp: new Date(),
        type: "pdf-response"
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      text: input,
      sender: "user",
      timestamp: new Date(),
      type: "regular"
    }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          pdfContext: activePdfContext ? {
            topics: activePdfContext.topics,
            summary: activePdfContext.summary
          } : null
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Handle structured responses
      if (data.type === 'goal') {
        const botMessage: Message = {
          text: data.text,
          sender: "bot",
          timestamp: new Date(),
          type: "goal",
          goalData: {
            title: data.goal.title,
            target: data.goal.target,
            timeframe: data.goal.timeframe,
            description: data.goal.description
          }
        }
        setMessages(prev => [...prev, botMessage])
      } 
      else if (data.type === 'alert') {
        const botMessage: Message = {
          text: data.text,
          sender: "bot",
          timestamp: new Date(),
          type: "alert",
          alertData: {
            type: data.alert.type,
            target: data.alert.target,
            condition: data.alert.condition,
            notificationMethod: data.alert.notificationMethod
          }
        }
        setMessages(prev => [...prev, botMessage])
      }
      else {
        // Handle regular text response
        const botMessage: Message = {
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
          type: activePdfContext ? "pdf-response" : "regular"
        }
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I couldn't process your request at the moment. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        type: "regular"
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handlePromptClick = async (prompt: QuickPrompt) => {
    const userMessage: Message = {
      text: prompt.text,
      sender: "user",
      timestamp: new Date(),
      type: "regular"
    }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt.text,
          pdfContext: activePdfContext ? {
            topics: activePdfContext.topics,
            summary: activePdfContext.summary
          } : null
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Handle structured responses
      if (data.type === 'goal') {
        const botMessage: Message = {
          text: data.text,
          sender: "bot",
          timestamp: new Date(),
          type: "goal",
          goalData: {
            title: data.goal.title,
            target: data.goal.target,
            timeframe: data.goal.timeframe,
            description: data.goal.description
          }
        }
        setMessages(prev => [...prev, botMessage])
      } 
      else if (data.type === 'alert') {
        const botMessage: Message = {
          text: data.text,
          sender: "bot",
          timestamp: new Date(),
          type: "alert",
          alertData: {
            type: data.alert.type,
            target: data.alert.target,
            condition: data.alert.condition,
            notificationMethod: data.alert.notificationMethod
          }
        }
        setMessages(prev => [...prev, botMessage])
      }
      else {
        // Handle regular text response
        const botMessage: Message = {
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
          type: activePdfContext ? "pdf-response" : "regular"
        }
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I couldn't process your request at the moment. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        type: "regular"
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleConfirmGoal = async (goalData: Message['goalData']) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      })

      if (!response.ok) {
        throw new Error('Failed to save goal')
      }

      // Add confirmation message
      const confirmMessage: Message = {
        text: `Your goal "${goalData.title}" has been saved successfully. We'll help track your progress towards reaching $${goalData.target} by ${goalData.timeframe}.`,
        sender: "bot",
        timestamp: new Date(),
        type: "regular"
      }
      setMessages(prev => [...prev, confirmMessage])
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I couldn't save your goal. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        type: "regular"
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleEditGoal = (goalData: Message['goalData']) => {
    setEditingGoal(goalData)
  }

  const handleConfirmAlert = async (alertData: Message['alertData']) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      })

      if (!response.ok) {
        throw new Error('Failed to save alert')
      }

      // Add confirmation message
      const confirmMessage: Message = {
        text: `Your ${alertData.type} alert has been set. You'll be notified via ${alertData.notificationMethod.join(", ")} when ${alertData.target} ${alertData.condition}.`,
        sender: "bot",
        timestamp: new Date(),
        type: "regular"
      }
      setMessages(prev => [...prev, confirmMessage])
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I couldn't save your alert. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        type: "regular"
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleEditAlert = (alertData: Message['alertData']) => {
    setEditingAlert(alertData)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const renderMessage = (message: Message) => {
    if (message.sender === "user") {
      return message.text
    }

    if (message.type === "pdf-response" && activePdfContext) {
      return (
        <div className={`mt-2 p-2 rounded-lg ${
          darkMode ? 'bg-zinc-800/30' : 'bg-blue-50'
        }`}>
          <div className="flex items-center gap-2 text-xs text-violet-400 mb-2">
            <File size={14} />
            <span className="truncate">Context: {activePdfContext.fileName}</span>
          </div>
          <ReactMarkdown className="prose-sm">
            {message.text}
          </ReactMarkdown>
        </div>
      )
    }

    if (message.type === "goal" && message.goalData) {
      return (
        <div className={`mt-2 p-3 rounded-lg ${
          darkMode ? 'bg-emerald-900/30 border border-emerald-800/50' : 'bg-emerald-50 border border-emerald-100'
        }`}>
          <div className="flex items-center gap-2 text-sm text-emerald-500 mb-2">
            <Timer size={16} />
            <span className="font-semibold">Financial Goal Detected</span>
          </div>
          
          <div className="mb-3">
            <h4 className="font-medium mb-1">{message.goalData.title}</h4>
            <p className="text-sm opacity-80">{message.text}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            <div>
              <span className="opacity-70">Target:</span> 
              <span className="ml-1 font-medium">${message.goalData.target.toLocaleString()} JMD</span>
            </div>
            <div>
              <span className="opacity-70">Timeframe:</span> 
              <span className="ml-1 font-medium">{message.goalData.timeframe}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleConfirmGoal(message.goalData!)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
            >
              Confirm Goal
            </button>
            <button
              onClick={() => handleEditGoal(message.goalData!)}
              className="px-3 py-1.5 bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg text-sm transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      )
    }

    if (message.type === "alert" && message.alertData) {
      return (
        <div className={`mt-2 p-3 rounded-lg ${
          darkMode ? 'bg-amber-900/30 border border-amber-800/50' : 'bg-amber-50 border border-amber-100'
        }`}>
          <div className="flex items-center gap-2 text-sm text-amber-600 mb-2">
            <AlertTriangle size={16} />
            <span className="font-semibold">Market Alert Suggestion</span>
          </div>
          
          <div className="mb-3">
            <h4 className="font-medium mb-1">{message.alertData.type.charAt(0).toUpperCase() + message.alertData.type.slice(1)} Alert</h4>
            <p className="text-sm opacity-80">{message.text}</p>
          </div>
          
          <div className="grid grid-cols-1 gap-2 mb-3 text-sm">
            <div>
              <span className="opacity-70">When:</span> 
              <span className="ml-1 font-medium">{message.alertData.target} {message.alertData.condition}</span>
            </div>
            <div>
              <span className="opacity-70">Notify via:</span> 
              <span className="ml-1 font-medium">{message.alertData.notificationMethod.join(", ")}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleConfirmAlert(message.alertData!)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm transition-colors"
            >
              Set Alert
            </button>
            <button
              onClick={() => handleEditAlert(message.alertData!)}
              className="px-3 py-1.5 bg-transparent border border-amber-600 text-amber-600 hover:bg-amber-50 rounded-lg text-sm transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      )
    }

    return (
      <ReactMarkdown 
        components={{
          p: ({node, ...props}) => <p className="my-1" {...props} />,
          ul: ({node, ...props}) => <ul className="my-1 ml-4 list-disc" {...props} />,
          ol: ({node, ...props}) => <ol className="my-1 ml-4 list-decimal" {...props} />,
          li: ({node, ...props}) => <li className="my-0.5" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-lg font-bold my-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-base font-bold my-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-sm font-bold my-1" {...props} />,
          code: ({node, ...props}) => <code className="bg-black/10 dark:bg-white/10 rounded px-1" {...props} />,
          pre: ({node, ...props}) => <pre className="bg-black/10 dark:bg-white/10 p-2 rounded my-2 overflow-x-auto" {...props} />
        }}
      >
        {message.text}
      </ReactMarkdown>
    )
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-toggle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 backdrop-blur-sm"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            {isFullscreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={() => setIsFullscreen(false)}
              />
            )}
            
            <motion.div
              key="chat-window"
              variants={isFullscreen ? fullscreenVariants : chatContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`
                fixed z-50
                ${isFullscreen 
                  ? 'inset-4 md:inset-8 lg:inset-12 max-w-6xl mx-auto'
                  : 'bottom-4 right-4 w-96 h-[32rem]'
                }
                flex flex-col
                rounded-2xl shadow-2xl
                ${darkMode 
                  ? "bg-zinc-900/90 backdrop-blur-md border border-zinc-800/50" 
                  : "bg-white/90 backdrop-blur-md border border-gray-200/50"
                }
              `}
            >
              <div className="flex flex-col h-full">
                {/* Header - Fixed height */}
                <div className="flex-none">
                  <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-4 flex justify-between items-center rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={20} className="text-white" />
                      <h3 className="font-bold text-white">Financial Assistant</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleFullscreen}
                        className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
                      >
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleChat}
                        className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Disclaimer - Conditional render */}
                <AnimatePresence>
                  {showDisclaimer && (
                    <motion.div
                      key="disclaimer"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex-none px-2 pt-2"
                    >
                      <Alert className={`${
                        darkMode 
                          ? "bg-zinc-800/50 border-zinc-700/50" 
                          : "bg-violet-50/50 border-violet-100/50"
                      } backdrop-blur-sm`}>
                        <Info className="h-4 w-4 text-violet-400" />
                        <AlertDescription className="text-xs">
                          This assistant provides general financial information only.
                          <button
                            onClick={() => setShowDisclaimer(false)}
                            className="ml-2 text-violet-400 hover:text-violet-500"
                          >
                            Dismiss
                          </button>
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Messages - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0 px-4">
                  <div className={`space-y-4 py-4 ${isFullscreen ? 'max-w-3xl mx-auto' : ''}`}>
                    <AnimatePresence mode="popLayout">
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          custom={message.sender === "user"}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ duration: 0.2 }}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`max-w-[85%] p-3 rounded-2xl backdrop-blur-sm ${
                              message.sender === "user"
                                ? "bg-gradient-to-r from-violet-500/90 to-indigo-500/90 text-white"
                                : darkMode
                                  ? "bg-zinc-800/50 text-zinc-100"
                                  : "bg-white/50 text-gray-800 border border-gray-200/20"
                            }`}
                          >
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              {renderMessage(message)}
                            </div>
                            <div className={`text-xs mt-1 ${
                              message.sender === "user" 
                                ? "text-white/70" 
                                : darkMode 
                                  ? "text-zinc-400" 
                                  : "text-gray-500"
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-violet-400"
                      >
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="text-sm"
                        >
                          Typing...
                        </motion.span>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className={`flex-none p-4 border-t ${
                  darkMode 
                    ? "border-zinc-800/50 bg-zinc-900/50" 
                    : "border-gray-200/50 bg-white/50"
                } backdrop-blur-sm rounded-b-2xl`}
                >
                  <div className={`${isFullscreen ? 'max-w-3xl mx-auto' : ''}`}>
                    {/* Quick Prompts */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.2
                          }
                        }
                      }}
                      className="overflow-x-auto scrollbar-hide mb-3 -mx-4 px-4"
                    >
                      <div className="flex gap-2 w-max min-w-full">
                        {quickPrompts.map((prompt, index) => (
                          <motion.button
                            key={index}
                            variants={promptVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePromptClick(prompt)}
                            className={`flex-none flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap ${
                              darkMode 
                                ? "bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-100 border border-zinc-700/50" 
                                : "bg-white/50 hover:bg-white/80 border border-gray-200/50 shadow-sm"
                            }`}
                          >
                            {prompt.icon}
                            <span className="truncate">{prompt.text}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    {/* Input and Buttons */}
                    <div className="flex gap-2">
                      <motion.input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type your message..."
                        whileFocus={{ scale: 1.02 }}
                        className={`flex-1 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                          darkMode
                            ? "bg-zinc-800/50 text-zinc-100 placeholder-zinc-500 border border-zinc-700/50"
                            : "bg-white/50 border-gray-200/50 placeholder-gray-500 backdrop-blur-sm"
                        }`}
                      />
                      <motion.button
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.9 }}
onClick={handleSend}
className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white p-2 rounded-xl hover:shadow-lg transition-all"
>
<Send size={20} />
</motion.button>

{!currentPdf && (
<motion.div>
  <input
    type="file"
    ref={fileInputRef}
    accept=".pdf"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (file) handlePdfUpload(file)
    }}
  />
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => fileInputRef.current?.click()}
    className={`p-2 rounded-xl transition-all ${
      darkMode 
        ? "bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-100" 
        : "bg-white/50 hover:bg-white/80 text-gray-700"
    }`}
  >
    <File size={20} />
  </motion.button>
</motion.div>
)}
</div>
</div>
</div>
</div>
</motion.div>
</>
)}
</AnimatePresence>

{/* Goal Editing Modal */}
<AnimatePresence>
{editingGoal && (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
>
<motion.div
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.9, opacity: 0 }}
className={`max-w-md w-full p-6 rounded-xl ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}
>
<h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-zinc-100' : 'text-gray-800'}`}>Edit Goal</h3>

<div className="space-y-4">
<div>
<label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
Goal Title
</label>
<input
type="text"
value={editingGoal.title}
onChange={(e) => setEditingGoal({...editingGoal, title: e.target.value})}
className={`w-full p-2 rounded-lg border ${
darkMode 
? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
: 'bg-white border-gray-300'
}`}
/>
</div>

<div>
<label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
Target Amount (JMD)
</label>
<input
type="number"
value={editingGoal.target}
onChange={(e) => setEditingGoal({...editingGoal, target: parseFloat(e.target.value)})}
className={`w-full p-2 rounded-lg border ${
darkMode 
? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
: 'bg-white border-gray-300'
}`}
/>
</div>

<div>
<label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
Timeframe
</label>
<input
type="text"
value={editingGoal.timeframe}
onChange={(e) => setEditingGoal({...editingGoal, timeframe: e.target.value})}
className={`w-full p-2 rounded-lg border ${
darkMode 
? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
: 'bg-white border-gray-300'
}`}
/>
</div>

{editingGoal.description !== undefined && (
<div>
<label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
Description (Optional)
</label>
<textarea
value={editingGoal.description}
onChange={(e) => setEditingGoal({...editingGoal, description: e.target.value})}
className={`w-full p-2 rounded-lg border ${
darkMode 
  ? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
  : 'bg-white border-gray-300'
}`}
rows={3}
/>
</div>
)}
</div>

<div className="flex justify-end gap-2 mt-6">
<motion.button 
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
onClick={() => setEditingGoal(null)}
className={`px-4 py-2 rounded-lg border ${
darkMode 
? 'border-zinc-600 text-zinc-300 hover:bg-zinc-700' 
: 'border-gray-300 text-gray-700 hover:bg-gray-50'
}`}
>
Cancel
</motion.button>
<motion.button 
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
onClick={() => {
handleConfirmGoal(editingGoal)
setEditingGoal(null)
}}
className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
>
Save Changes
</motion.button>
</div>
</motion.div>
</motion.div>
)}
</AnimatePresence>

{/* Alert Editing Modal */}
<AnimatePresence>
{editingAlert && (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
>
<motion.div
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.9, opacity: 0 }}
className={`max-w-md w-full p-6 rounded-xl ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}
>
<h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-zinc-100' : 'text-gray-800'}`}>Edit Alert</h3>

<div className="space-y-4">
<div>
<label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
Alert Type
</label>
<select
value={editingAlert.type}
onChange={(e) => setEditingAlert({...editingAlert, type: e.target.value as any})}
className={`w-full p-2 rounded-lg border ${
darkMode 
? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
: 'bg-white border-gray-300'
}`}
>
<option value="price">Price Alert</option>
<option value="market">Market Alert</option>
<option value="news">News Alert</option>
</select>
</div>

<div>
<label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
Target
</label>
<input
type="text"
value={editingAlert.target}
onChange={(e) => setEditingAlert({...editingAlert, target: e.target.value})}
className={`w-full p-2 rounded-lg border ${
darkMode 
? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
: 'bg-white border-gray-300'
}`}
/>
</div>

<div>
<label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
Condition
</label>
<input
type="text"
value={editingAlert.condition}
onChange={(e) => setEditingAlert({...editingAlert, condition: e.target.value})}
className={`w-full p-2 rounded-lg border ${
darkMode 
? 'bg-zinc-700 border-zinc-600 text-zinc-100' 
: 'bg-white border-gray-300'
}`}
/>
</div>

<div>
<label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
Notification Methods
</label>
<div className={`space-y-2 p-3 rounded-lg border ${
darkMode ? 'bg-zinc-700/50 border-zinc-600' : 'bg-gray-50 border-gray-200'
}`}>
{['email', 'sms', 'push', 'in-app'].map(method => (
<div key={method} className="flex items-center">
<input
  type="checkbox"
  id={`method-${method}`}
  checked={editingAlert.notificationMethod.includes(method)}
  onChange={(e) => {
    if (e.target.checked) {
      setEditingAlert({
        ...editingAlert, 
        notificationMethod: [...editingAlert.notificationMethod, method]
      })
    } else {
      setEditingAlert({
        ...editingAlert,
        notificationMethod: editingAlert.notificationMethod.filter(m => m !== method)
      })
    }
  }}
  className="mr-2"
/>
<label 
  htmlFor={`method-${method}`}
  className={darkMode ? 'text-zinc-300' : 'text-gray-700'}
>
  {method.charAt(0).toUpperCase() + method.slice(1)}
</label>
</div>
))}
</div>
</div>
</div>

<div className="flex justify-end gap-2 mt-6">
<motion.button 
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
onClick={() => setEditingAlert(null)}
className={`px-4 py-2 rounded-lg border ${
darkMode 
? 'border-zinc-600 text-zinc-300 hover:bg-zinc-700' 
: 'border-gray-300 text-gray-700 hover:bg-gray-50'
}`}
>
Cancel
</motion.button>
<motion.button 
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
onClick={() => {
handleConfirmAlert(editingAlert)
setEditingAlert(null)
}}
className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
>
Save Changes
</motion.button>
</div>
</motion.div>
</motion.div>
)}
</AnimatePresence>
</>
)
}

export default Chatbot