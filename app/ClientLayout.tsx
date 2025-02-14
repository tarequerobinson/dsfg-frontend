"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { AnimatedPage } from "./AnimatedPage";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Chatbot from "@/components/Chatbot";

export const ClientLayout = ({ 
  children,
  isLoggedIn
}: { 
  children: ReactNode;
  isLoggedIn: boolean;
}) => {
  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: isLoggedIn ? "var(--bg-color)" : "var(--bg-color-logged-out)"
      }}
      className="flex h-screen bg-gray-100 dark:bg-dark-bg transition-colors duration-200"
    >
      <AnimatePresence mode="wait">
        {isLoggedIn && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100
            }}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="flex-1 flex flex-col overflow-hidden"
        initial={false}
        animate={{
          paddingLeft: isLoggedIn ? "0px" : "0px",
          transition: {
            duration: 0.3,
            type: "spring",
            damping: 20
          }
        }}
      >
        <AnimatePresence mode="wait">
          {isLoggedIn && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100
              }}
            >
              <TopBar />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.main
          className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-dark-bg transition-colors duration-200 ${
            !isLoggedIn ? "w-full" : ""
          }`}
        >
          <AnimatedPage>{children}</AnimatedPage>
        </motion.main>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoggedIn && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100
            }}
          >
            <Chatbot />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};