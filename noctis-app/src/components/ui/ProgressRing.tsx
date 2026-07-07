import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  useSharedValue, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { Typography } from './Typography';
import { Colors } from '../../theme/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // Value between 0 and 100
  ringColor?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}

export function ProgressRing({
  size = 140,
  strokeWidth = 12,
  progress = 0,
  ringColor = Colors.accent,
  backgroundColor = '#1D1D21',
  showPercentage = true,
}: ProgressRingProps) {
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Shared value for high-performance native animations
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    // Smooth 1200ms ease-out animation when the score loads
    animatedProgress.value = withTiming(progress / 100, {
      duration: 1200,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background Track Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Active Foreground Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          fill="transparent"
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>

      {/* Centered Percentage Label */}
      {showPercentage && (
        <View className="absolute items-center justify-center">
          <Typography variant="display" weight="bold">
            {Math.round(progress)}
          </Typography>
          <Typography variant="caption" color="secondary" weight="medium" className="tracking-widest uppercase mt-0.5">
            %
          </Typography>
        </View>
      )}
    </View>
  );
}