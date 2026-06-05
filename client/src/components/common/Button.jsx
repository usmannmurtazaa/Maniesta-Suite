import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Button = forwardRef(function Button(
  { children, variant = 'primary', className = '', ...props },
  ref
) {
  const base = 'btn-primary';
  const secondary = 'btn-secondary';
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`${variant === 'secondary' ? secondary : base} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
});
export default Button;