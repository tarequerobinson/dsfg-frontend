"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Info, Timer, Wallet, TrendingUp, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/contexts/ThemeContext"
import type React from "react" // Added import for React

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
  }, [messagesEndRef]) // Fixed useEffect dependency

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-200"
        >
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 w-84 h-[32rem] rounded-lg shadow-xl flex flex-col ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          } border`}
        >
          <div className="bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-bold">Financial Assistant</h3>
            </div>
            <button onClick={toggleChat} className="hover:bg-green-600 p-1 rounded transition-colors">
              <X size={20} />
            </button>
          </div>

          {showDisclaimer && (
            <Alert
              className={`m-2 ${
                darkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-green-50 border-green-100 text-gray-700"
              }`}
            >
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
          )}

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? darkMode
                          ? "bg-gray-800 text-gray-100"
                          : "bg-green-100 text-gray-800"
                        : darkMode
                          ? "bg-gray-700 text-gray-100"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.text}
                    <div className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={`flex items-center gap-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <div className="animate-pulse">typing...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className={`p-4 border-t ${darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    darkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {prompt.icon}
                  {prompt.text}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-400"
                    : "bg-white border-gray-200 placeholder-gray-500"
                }`}
              />
              <button
                onClick={handleSend}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot

