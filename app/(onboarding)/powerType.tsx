import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import { IMAGES } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalProvider'
import { router } from 'expo-router'
import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const PowerType = () => {
  const { onboardingData, setOnboardingData } = useGlobalContext()
  
  const handleAddSolar = (exist: boolean) => {
    setOnboardingData({
      ...onboardingData,
      is_solar: exist
    })
    router.push("/solarCapacity")
  }
  return (
    <SafeAreaView className='h-screen bg-accent w-full'>
      <View className='px-4 my-24 flex-1 justify-between'>
        <View className='h-[400px] mt-8'>
          <Image
            source={IMAGES.solarPowerIllustration}
            resizeMode='contain'
            className='w-full h-full'
          />
        </View>

        <View className='w-full'>
          <AppText className='text-2xl font-semibold leading-10 mb-4 text-center px-8'>Do you have any solar energy installed?</AppText>
          <View className='flex flex-row items-center justify-center gap-2 w-full'>
            <TouchableOpacity>
              <CustomButton title='Yes, I have' onPress={() => handleAddSolar(true)} extraClasses={"!bg-secondary-v1"} />
            </TouchableOpacity>
            <TouchableOpacity>
              <CustomButton title="No, I don't" onPress={() => handleAddSolar(false)} extraClasses={"!bg-white border border-gray-200"} textClasses={'!text-secondary-v1'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default PowerType