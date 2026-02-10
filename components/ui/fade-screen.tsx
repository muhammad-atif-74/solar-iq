
import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export const FadeScreen = ({ children }: { children: React.ReactNode }) => {
  return (
    <Animated.View 
      entering={FadeIn.duration(300)} 
      exiting={FadeOut.duration(250)}
      style={{ flex: 1 }}
    >
      {children}
    </Animated.View>
  );
};