import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const DEFAULT_STEPS = ['Home', 'Power', 'Capacity', 'Rooms'];

export default function Stepper({ steps = DEFAULT_STEPS, currentStep = 1 }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    setCurrent(currentStep)
  }, [currentStep])
  return (
    <View className="items-center py-8">

      {/* Step row */}
      <View className="flex-row items-center">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const inactive = i > current;

          return (
            <View key={i} className="flex-row items-center">

              {/* Circle */}
              <Pressable className="items-center">
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                    done
                      ? 'bg-zinc-800 border-zinc-800'
                      : active
                      ? 'bg-white border-zinc-800'
                      : 'bg-stone-200 border-stone-200'
                  }`}
                >
                  {done ? (
                    <Text className="text-white text-lg font-bold">✓</Text>
                  ) : (
                    <Text
                      className={`text-base font-semibold ${
                        active ? 'text-zinc-800' : 'text-stone-400'
                      }`}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
              </Pressable>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <View
                  className={`h-px w-10 mx-1 ${
                    i < current ? 'bg-zinc-800' : 'bg-stone-300'
                  }`}
                />
              )}

            </View>
          );
        })}
      </View>

      {/* Labels row */}
      <View className="flex-row mt-3">
        {steps.map((label, i) => {
          const inactive = i > current;
          return (
            <View key={i} className="items-center" style={{ width: 85 }}>
              <Text
                className={`text-xs text-center font-medium ${
                  inactive ? 'text-stone-400' : 'text-zinc-800'
                }`}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>

    </View>
  );
}