import React from 'react';
import { Text, TextProps } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility to merge tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TypographyProps extends TextProps {
  variant?: 'display' | 'heading' | 'title' | 'subtitle' | 'body' | 'small' | 'caption';
  color?: 'primary' | 'secondary' | 'disabled' | 'accent' | 'error';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export function Typography({
  variant = 'body',
  color = 'primary',
  weight = 'regular',
  className,
  style,
  children,
  ...props
}: TypographyProps) {
  
  const baseStyles = "font-inter";
  
  const variants = {
    display: "text-[40px] leading-[48px]",
    heading: "text-[30px] leading-[38px]",
    title: "text-[22px] leading-[28px]",
    subtitle: "text-[18px] leading-[24px]",
    body: "text-[16px] leading-[22px]",
    small: "text-[14px] leading-[20px]",
    caption: "text-[12px] leading-[16px]",
  };

  const colors = {
    primary: "text-textPrimary",
    secondary: "text-textSecondary",
    disabled: "text-disabled",
    accent: "text-accent",
    error: "text-error",
  };

  const weights = {
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  return (
    <Text
      className={cn(
        baseStyles,
        variants[variant],
        colors[color],
        weights[weight],
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </Text>
  );
}