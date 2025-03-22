import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { cva, type VariantProps } from "class-variance-authority";

const animatedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        glowing: "relative overflow-hidden bg-gradient-to-r from-farm-green-500 to-fresh-blue-500 text-white shadow-lg",
        neon: "relative bg-transparent border-2 border-harvest-gold-500 text-harvest-gold-500 shadow-[0_0_15px_rgba(250,204,21,0.5)]",
        liquid: "bg-black text-white relative overflow-hidden z-0",
        pulse: "relative overflow-hidden bg-white text-gray-800 border border-gray-300",
        shockwave: "bg-gray-800 text-white relative overflow-hidden",
        magnetic: "bg-fresh-blue-500 text-white shadow-lg hover:shadow-xl",
        gradient: "relative bg-gradient-to-r from-farm-green-500 via-fresh-blue-500 to-harvest-gold-500 text-white bg-size-200 bg-pos-0 hover:bg-pos-100",
        morphing: "bg-farm-green-500 text-white hover:animate-morph",
        elastic: "bg-soil-brown-500 text-white transform transition-transform duration-200 hover:scale-110 active:scale-90"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "glowing",
      size: "default",
    },
  }
);

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
  asChild?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    
    const renderButtonContent = () => {
      if (variant === "glowing") {
        return (
          <>
            <span className="absolute inset-0 bg-gradient-to-r from-farm-green-400 to-fresh-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-farm-green-500 to-fresh-blue-500 opacity-30 blur group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative">{children}</span>
          </>
        );
      }
      
      if (variant === "neon") {
        return (
          <>
            <span className="absolute inset-0 border-2 border-harvest-gold-500 rounded-md"></span>
            <span className="absolute inset-0 border-2 border-harvest-gold-500 rounded-md animate-pulse-subtle" style={{ animationDuration: '1.5s' }}></span>
            <span className="relative">{children}</span>
          </>
        );
      }
      
      if (variant === "liquid") {
        return (
          <>
            <span className="absolute inset-0 bg-white/10"></span>
            <span className="absolute -inset-[100%] top-[50%] aspect-square bg-white/20 rounded-full blur-md opacity-0 group-hover:animate-scale-up"></span>
            <span className="absolute inset-0 overflow-hidden">
              <span className="absolute -inset-0 -top-[400%] left-0 bg-white/40 w-8 h-[800%] blur-md -rotate-45 translate-x-0 -translate-y-10 group-hover:translate-x-[1000%] group-hover:translate-y-[500%] duration-[1.5s] ease-out"></span>
            </span>
            <span className="relative">{children}</span>
          </>
        );
      }
      
      if (variant === "pulse") {
        return (
          <>
            <span className="absolute inset-0 border rounded-md bg-gradient-to-r from-farm-green-100 via-fresh-blue-100 to-harvest-gold-100 opacity-0 group-hover:opacity-100 animate-pulse-subtle transition-opacity duration-300"></span>
            <span className="relative">{children}</span>
          </>
        );
      }
      
      if (variant === "shockwave") {
        return (
          <>
            <span className="absolute inset-0 rounded-md overflow-hidden">
              <span className="absolute inset-0 -translate-y-full bg-white/20 group-hover:animate-slide-down" style={{ animationDuration: '0.5s' }}></span>
              <span className="absolute inset-0 translate-y-full bg-white/20 group-hover:animate-slide-up" style={{ animationDuration: '0.5s' }}></span>
              <span className="absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-slide-right" style={{ animationDuration: '0.5s' }}></span>
              <span className="absolute inset-0 translate-x-full bg-white/20 group-hover:animate-slide-left" style={{ animationDuration: '0.5s' }}></span>
            </span>
            <span className="relative">{children}</span>
          </>
        );
      }
      
      if (variant === "magnetic") {
        // The actual magnet effect needs JS in the parent component, this just adds visual flair
        return (
          <>
            <span className="absolute inset-0 bg-fresh-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
            <span className="relative">{children}</span>
          </>
        );
      }
      
      return <span className="relative">{children}</span>;
    };

    return (
      <button
        className={cn(animatedButtonVariants({ variant, size, className }), "group")}
        ref={ref}
        {...props}
      >
        {renderButtonContent()}
      </button>
    );
  }
); 