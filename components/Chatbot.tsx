"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Info, Timer, Wallet, TrendingUp, AlertTriangle, Maximize2, Minimize2, File } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/contexts/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from 'react-markdown'
import type React from "react"

type Message = {
  text: string
  sender: "user" | "bot"
  timestamp: Date
  isPdfResponse?: boolean
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

  const quickPrompts: QuickPrompt[] = [
    {
      text: "How can I build a diversified investment portfolio in Jamaica?",
      category: "portfolio",
      icon: <Wallet size={16} />,
    },
    {
      text: "What are the main financial risks for Jamaican investors and how can I mitigate them?",
      category: "risk",
      icon: <AlertTriangle size={16} />,
    },
    {
      text: "What are the best investment opportunities in Jamaica right now?",
      category: "recommendation",
      icon: <TrendingUp size={16} />,
    },
    {
      text: "Is now a good time to invest in Jamaican real estate or the stock market?",
      category: "general",
      icon: <Timer size={16} />,
    },
  ]
  
  const toggleChat = () => setIsOpen(!isOpen)
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  const handlePdfUpload = async (file: File) => {
    setIsTyping(true)
    setCurrentPdf(file)

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze PDF")
      }

      const data = await response.json()
      console.log("PDF analysis response:", data)

      if (data.analysis.isFinanceRelated === false) {
        const botMessage: Message = {
          text: "I apologize, but this document doesn't appear to contain financial information. I can only assist with financial documents and related queries.",
          sender: "bot",
          timestamp: new Date(),
          isPdfResponse: true,
        }
        setMessages((prev) => [...prev, botMessage])
        setCurrentPdf(null)
      } else {
        const dynamicMessage =
          data.analysis.reason ||
          `This financial document contains information about ${data.analysis.topics.join(", ")}. ` +
            "I can help analyze and answer questions about these topics."

        const botMessage: Message = {
          text: dynamicMessage,
          sender: "bot",
          timestamp: new Date(),
          isPdfResponse: true,
        }
        setMessages((prev) => [...prev, botMessage])
        setIsPdfAnalyzed(true)
      }
    } catch (error) {
      console.error("PDF upload error:", error)
      const errorMessage: Message = {
        text:
          error instanceof Error
            ? `Error: ${error.message}`
            : "Sorry, I couldn't process the PDF. Please ensure it's a valid financial document and try again.",
        sender: "bot",
        timestamp: new Date(),
        isPdfResponse: true,
      }
      setMessages((prev) => [...prev, errorMessage])
      setCurrentPdf(null)
    } finally {
      setIsTyping(false)
    }
  }


  
  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        text: input,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, userMessage]);
      setInput("");
      setIsTyping(true);
  
      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input, // Removed the static prefix to avoid duplication
            pdfContext: currentPdf && isPdfAnalyzed ? {
              topics: analysis?.topics || [],
              summary: analysis?.reason || "Financial document analysis"
            } : null,
            isPdfAnalyzed
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to get response');
        }
  
        const data = await response.json();
        
        const botMessage: Message = {
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
          isPdfResponse: !!currentPdf
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        const errorMessage: Message = {
          text: "Sorry, I couldn't process your request at the moment. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };


  const handlePromptClick = async (prompt: QuickPrompt) => {
    const userMessage: Message = {
      text: prompt.text,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages([...messages, userMessage])
    setIsTyping(true)
  
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt.text,
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }
  
      const data = await response.json()
      
      const botMessage: Message = {
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        text: error instanceof Error 
          ? `Error: ${error.message}` 
          : "Sorry, I couldn't process your request at the moment. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
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
                          {message.sender === "user" ? (
  message.text
) : (
  <>
    {message.isPdfResponse ? (
      <div className={`mt-2 p-2 rounded-lg ${
        darkMode ? 'bg-zinc-800/30' : 'bg-blue-50'
      }`}>
        <p className="text-xs font-medium mb-1 text-violet-400">
          Document Analysis Summary
        </p>
        <ReactMarkdown className="prose-xs">
          {message.text}
        </ReactMarkdown>
        {currentPdf && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <File size={14} />
            <span className="truncate">{currentPdf.name}</span>
          </div>
        )}
      </div>
    ) : (
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
    )}
  </>
)}
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
  </>
)
}

export default Chatbot