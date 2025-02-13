"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([])
  const [input, setInput] = useState("")

  const toggleChat = () => setIsOpen(!isOpen)

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }])
      setInput("")
      // Here you would typically send the message to your backend for processing
      // For now, we'll just echo the message back as if it were from the bot
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: `You asked: ${input}`, sender: "bot" }])
      }, 1000)
    }
  }

  const handlePromptClick = (prompt: string) => {
    setMessages([...messages, { text: prompt, sender: "user" }])
    // Here you would typically send the prompt to your backend for processing
    // For now, we'll just echo the prompt back as if it were from the bot
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: `You asked: ${prompt}`, sender: "bot" }])
    }, 1000)
  }

  const prompts = [
    "What's my current portfolio value?",
    "How is my risk level?",
    "What's my best performing asset?",
    "Any investment recommendations?",
  ]

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200"
        >
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white dark:bg-dark-surface rounded-lg shadow-xl flex flex-col">
          <div className="bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">Financial Assistant</h3>
            <button onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-3/4 p-2 rounded ${message.sender === "user" ? "bg-green-100 dark:bg-green-800" : "bg-gray-100 dark:bg-gray-700"}`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex space-x-2 mb-2">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-l dark:bg-dark-surface-2 dark:border-gray-700"
              />
              <button
                onClick={handleSend}
                className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600 transition-colors duration-200"
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

