import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import { IMAGES } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Image, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
    const { isLoading, isLoggedIn } = useGlobalContext()
    if (!isLoading && isLoggedIn) return <Redirect href={'/home'} />

    return (
        <SafeAreaView className='bg-accent h-screen'>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                className='px-1'
            >
                <View className='flex-1 justify-between'>
                    <View className='h-[400px]'>
                        <Image
                            source={IMAGES.splash}
                            className='w-[80%] mx-auto h-[400px]'
                            resizeMode='contain'
                        />
                    </View>

                    <View className='px-3 pb-4'>
                        <AppText className='text-5xl font-bold mb-1.5 text-secondary-v1'>
                            Easily Control
                        </AppText>
                        <AppText className='text-5xl font-bold mb-3 text-secondary-v1'>
                            Your Home
                        </AppText>

                        <AppText className='text-base text-[#70797E] font-semibold mb-12'>
                            Manage your home from anytime, anywhere.
                        </AppText>

                        <CustomButton title='Continue' onPress={() => { router.push('/signIn') }} />
                    </View>
                </View>
            </ScrollView>

            <StatusBar backgroundColor='#333333' style='light' />
        </SafeAreaView>
    )
}

export default index