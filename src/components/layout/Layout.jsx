import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 relative">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [-50, 50, -50], y: [-30, 30, -30] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-800/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [40, -40, 40], y: [20, -20, 20] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-pink-400/20 dark:bg-pink-800/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [-20, 20, -20], y: [50, -50, 50] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-indigo-400/20 dark:bg-indigo-800/20 rounded-full blur-3xl"
        />
      </div>
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 pt-24 pb-12">{children}</main>
      <Footer />
    </div>
  );
}