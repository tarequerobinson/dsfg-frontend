"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import StockCard, { type StockData } from "./StockCard"

interface StockSwiperProps {
  stocks: StockData[]
}

export default function StockSwiper({ stocks }: StockSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsPerView = 2 // Number of cards visible at once on desktop

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setContainerWidth(width)
        // Calculate card width based on container width and desired cards per view
        // Include gap in calculation (16px gap)
        const calculatedCardWidth = (width - (cardsPerView - 1) * 16) / cardsPerView
        setCardWidth(calculatedCardWidth)
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const nextSlide = () => {
    if (currentIndex < stocks.length - cardsPerView) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Loop back to the beginning
      setCurrentIndex(0)
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      // Loop to the end
      setCurrentIndex(stocks.length - cardsPerView)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative">
      <h2 className="mb-4 text-xl font-bold">Your Investments</h2>

      {/* Navigation buttons */}
      <div className="absolute right-0 top-0 flex gap-2">
        <button
          onClick={prevSlide}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="Previous stock"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="Next stock"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Stock cards container */}
      <div ref={containerRef} className="relative h-[220px] overflow-hidden">
        <motion.div
          className="absolute flex h-full gap-4"
          animate={{
            x: -currentIndex * (cardWidth + 16), // 16px is the gap
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ width: stocks.length * (cardWidth + 16) - 16 }} // Subtract the last gap
        >
          {stocks.map((stock, index) => (
            <div key={stock.symbol} style={{ width: cardWidth }}>
              <StockCard stock={stock} index={index} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pagination dots */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: Math.max(1, stocks.length - cardsPerView + 1) }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full ${
              currentIndex === index
                ? "bg-blue-500 dark:bg-blue-400"
                : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentIndex === index ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  )
}
