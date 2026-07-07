import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { Typography, cn } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'large';
  isLoading?: boolean;
  title: string;
}

export function Button({
  variant = 'primary',
  size = 'default',
  isLoading = false,
  title,
  className,
  disabled,
  ...props
}: ButtonProps) {
  
  const variants = {
    primary: "bg-textPrimary",
    secondary: "bg-surface",
    outline: "bg-transparent border border-border",
  };

  const sizes = {
    default: "h-[56px] px-6",
    large: "h-[64px] px-8",
  };

  const textColors = {
    primary: "text-[#000000]", // Black text on white button
    secondary: "text-textPrimary",
    outline: "text-textPrimary",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      className={cn(
        "rounded-[18px] flex-row items-center justify-center", // Strictly 18px from PRD
        variants[variant],
        sizes[size],
        (disabled || isLoading) && "opacity-50",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000000' : '#FFFFFF'} />
      ) : (
        <Typography 
          variant="body" 
          weight="semibold" 
          className={textColors[variant]}
        >
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
}