import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import Stepper from '@/components/ui/stepper'
import { IMAGES } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Image, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeName = () => {
    const { onboardingData, setOnboardingData } = useGlobalContext()
    const [homeName, setHomeName] = useState("")

    const handleContinue = () => {
        setOnboardingData({
            ...onboardingData,
            home_name: homeName
        })
        handleSkip()
    }
    const handleSkip = () => {
        router.push("/(onboarding)/powerType");
    }
    return (
        <SafeAreaView className='h-screen bg-accent w-full'>
            <View className='px-4 my-8 flex-1 justify-between'>
                <View className=''> 
                    <Stepper
                        currentStep={0}
                    />
                    <View className='h-[300px] flex items-center justify-center'>
                        <Image
                            source={IMAGES.solarPowerIllustration}
                            resizeMode='contain'
                            className='w-full h-full'
                        />
                    </View>
                </View>


                <View className='w-full'>
                    <AppText className='text-2xl font-semibold leading-10 mb-4 text-center px-8'>Name your room</AppText>
                    <View className={`mb-8 relative w-[90%] mx-auto h-16 px-4 bg-white rounded-xl focus:border-secondary border border-[#ccc] flex-row items-center justify-between `}>
                        <TextInput
                            className={`flex-1 pt-4 text-secondary-v1 font-semibold font-poppinsRegular text-base `}
                            value={homeName}
                            placeholder={"Sweet Home"}
                            placeholderTextColor={"#7b7b8b"}
                            onChangeText={(t) => setHomeName(t)}
                            maxLength={50}
                        />
                    </View>
                    <View className='flex flex-row items-center justify-center gap-2 w-[90%] mx-auto'>
                        <CustomButton title="Skip" onPress={() => handleSkip()} extraClasses={"!bg-white border border-gray-200 !w-1/2"} textClasses={'!text-secondary-v1'} />
                        <CustomButton title='Next' onPress={() => handleContinue()} extraClasses={"!bg-secondary-v1 !w-1/2"} isDisable={homeName == ""} />
                    </View>
                </View>

            </View>
        </SafeAreaView>
    )
}

export default HomeName