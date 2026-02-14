import { Stack } from 'expo-router'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const OnboardingLayout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name='powerType' />
                <Stack.Screen name='solarCapacity' />
                <Stack.Screen name='roomSelection' />
            </Stack>

        </GestureHandlerRootView>
    )
}

export default OnboardingLayout
