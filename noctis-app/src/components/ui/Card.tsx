import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from './Typography';

interface CardProps extends ViewProps {
  variant?: 'default' | 'surface';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  variant = 'default', 
  padding = 'lg', 
  className, 
  children, 
  ...props 
}: CardProps) {
  
  const variants = {
    default: "bg-card border border-[#2B2B30]", // Very subtle border as requested
    surface: "bg-surface",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <View
      className={cn(
        "rounded-[24px]", // Strictly 24px from PRD
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}