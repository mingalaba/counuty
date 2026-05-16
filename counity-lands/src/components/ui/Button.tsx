import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:ring-offset-2";
    
    const variants = {
      primary: "bg-brand-gradient text-white shadow-md hover:shadow-lg hover:opacity-90",
      secondary: "bg-surface-200 text-text-primary hover:bg-surface-300",
      outline: "border border-surface-300 bg-transparent text-text-primary hover:bg-surface-100",
      ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-100",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-sm rounded-full",
      md: "h-11 px-6 text-base rounded-full",
      lg: "h-14 px-8 text-lg rounded-full",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
