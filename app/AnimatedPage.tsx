"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

export const AnimatedPage = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          transition: {
            duration: 0.4,
            type: "spring",
            damping: 25,
            stiffness: 100
          }
        }}
        exit={{ 
          opacity: 0, 
          x: -20,
          transition: {
            duration: 0.3
          }
        }}
        className="flex-1 w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};