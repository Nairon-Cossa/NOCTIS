import React, { useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { Typography, cn } from './Typography';
import { Colors } from '../../theme/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={cn("w-full mb-4", className)}>
      {label && (
        <Typography variant="small" weight="medium" color="secondary" className="mb-2">
          {label}
        </Typography>
      )}
      <View 
        className={cn(
          "h-[56px] w-full rounded-[16px] bg-surface border px-4 flex-row items-center",
          isFocused ? "border-accent" : "border-border",
          error && "border-error"
        )}
      >
        <TextInput
          className="flex-1 text-textPrimary font-inter text-[16px]"
          placeholderTextColor={Colors.disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error && (
        <Typography variant="caption" color="error" className="mt-1">
          {error}
        </Typography>
      )}
    </View>
  );
}