"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Info, Timer, Wallet, TrendingUp, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/contexts/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"

type Message = {
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

type QuickPrompt = {
  text: string
  category: "portfolio" | "risk" | "recommendation" | "general"
  icon: React.ReactNode
}

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

  const quickPrompts: QuickPrompt[] = [
    {
      text: "Portfolio Analysis",
      category: "portfolio",
      icon: <Wallet size={16} />,
    },
    {
      text: "Risk Assessment",
      category: "risk",
      icon: <AlertTriangle size={16} />,
    },
    {
      text: "Investment Ideas",
      category: "recommendation",
      icon: <TrendingUp size={16} />,
    },
    {
      text: "Market Timing",
      category: "general",
      icon: <Timer size={16} />,
    },
  ]

  const toggleChat = () => setIsOpen(!isOpen)

  const handleSend = () => {
    if (input.trim()) {
      const userMessage: Message = {
        text: input,
        sender: "user",
        timestamp: new Date(),
      }
      setMessages([...messages, userMessage])
      setInput("")
      setIsTyping(true)

      setTimeout(() => {
        const botMessage: Message = {
          text: `You asked: ${input}`,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      }, 1000)
    }
  }

  const handlePromptClick = (prompt: QuickPrompt) => {
    const userMessage: Message = {
      text: prompt.text,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages([...messages, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const botMessage: Message = {
        text: `You asked: ${prompt.text}`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
          <motion.div
            key="chat-window"
            variants={chatContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed bottom-4 right-4 w-84 h-[32rem] rounded-2xl shadow-2xl flex flex-col ${
              darkMode 
                ? "bg-zinc-900/90 backdrop-blur-md border border-zinc-800/50" 
                : "bg-white/90 backdrop-blur-md border border-gray-200/50"
            } z-50 overflow-hidden`}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-emerald-400 to-blue-500 p-4 flex justify-between items-center backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={20} className="text-white" />
                <h3 className="font-bold text-white">Financial Assistant</h3>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </motion.button>
            </motion.div>

            {/* Disclaimer */}
            <AnimatePresence>
              {showDisclaimer && (
                <motion.div
                  key="disclaimer"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mx-2 mt-2"
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
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
                        {message.text}
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

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 border-t ${
                darkMode 
                  ? "border-zinc-800/50 bg-zinc-900/50" 
                  : "border-gray-200/50 bg-white/50"
              } backdrop-blur-sm`}
            >
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
                className="flex flex-wrap gap-2 mb-3"
              >
                {quickPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    variants={promptVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePromptClick(prompt)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                      darkMode 
                        ? "bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-100 border border-zinc-700/50" 
                        : "bg-white/50 hover:bg-white/80 border border-gray-200/50 shadow-sm"
                    }`}
                  >
                    {prompt.icon}
                    {prompt.text}
                  </motion.button>
                ))}
              </motion.div>

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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot