import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

const icons = { light: '☀️', dark: '🌙', system: '💻' };

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="glass w-10 h-10 flex items-center justify-center rounded-full text-xl"
      aria-label="Toggle theme"
    >
      {icons[theme]}
    </motion.button>
  );
}