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
            className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50"
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
            className={`fixed bottom-4 right-4 w-84 h-[32rem] rounded-lg shadow-xl flex flex-col ${
              darkMode ? "bg-black border-zinc-800" : "bg-white border-gray-200"
            } border z-50`}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <h3 className="font-bold">Financial Assistant</h3>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                className="hover:bg-green-600 p-1 rounded transition-colors"
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
                  className="mx-2"
                >
                  <Alert className={`${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-green-50 border-green-100"}`}>
                    <Info className={`h-4 w-4 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                    <AlertDescription className="text-xs">
                      This assistant provides general financial information only.
                      <button
                        onClick={() => setShowDisclaimer(false)}
                        className={`ml-2 ${darkMode ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-700"}`}
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
                        className={`max-w-[85%] p-3 rounded-lg ${
                          message.sender === "user"
                            ? darkMode
                              ? "bg-zinc-800 text-zinc-100"
                              : "bg-green-100 text-gray-800"
                            : darkMode
                              ? "bg-zinc-900 text-zinc-100"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {message.text}
                        <div className={`text-xs mt-1 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>
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
                    className={`flex items-center gap-2 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
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
              className={`p-4 border-t ${darkMode ? "border-zinc-800 bg-black" : "border-gray-200 bg-white"}`}
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
                        ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800" 
                        : "bg-gray-100 hover:bg-gray-200"
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
                  className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    darkMode
                      ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500"
                      : "bg-white border-gray-200 placeholder-gray-500"
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
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