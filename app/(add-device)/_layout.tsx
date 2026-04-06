import { Stack } from 'expo-router'
import React from 'react'

export default function AddDevice() {
  return (
    <Stack>
        <Stack.Screen name='selectDevice' options={{ headerShown: false }} />
    </Stack>
  )
}