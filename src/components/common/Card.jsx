import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) {
  const Comp = onClick ? motion.button : motion.div;
  return (
    <Comp
      className={`glass-card p-6 ${hoverable ? 'cursor-pointer hover:shadow-glass-lg hover:-translate-y-0.5' : ''} ${className}`}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.02 } : undefined}
      whileTap={hoverable ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </Comp>
  );
}