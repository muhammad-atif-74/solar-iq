import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import { IMAGES } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalProvider'
import React, { useRef, useState } from 'react'
import { Image, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import FormField from '@/components/ui/form-field'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'

const SolarCapacity = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const { onboardingData, setOnboardingData } = useGlobalContext()
    const [customCapacity, setCustomCapacity] = useState("")

    const snapPoints = ['40%'];

    const openSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const handleAddCapacity = (capacity: number | string) => {
        setOnboardingData({
            ...onboardingData,
            solar_capacity_kw: Number(capacity)
        })
        router.push("/roomSelection")
    }
    return (
        <SafeAreaView className='h-screen bg-accent w-full'>
            <View className='px-4 my-12 flex-1 justify-between'>
                <View className='h-[400px] '>
                    <Image
                        source={IMAGES.solarPowerIllustration}
                        resizeMode='contain'
                        className='w-full h-full'
                    />
                </View>

                <View className='w-full'>
                    <AppText className='text-2xl font-semibold leading-10 mb-4 text-center px-8'>How much solar capacity do you have?</AppText>
                    <View className='flex flex-row flex-wrap items-center justify-center gap-2 w-full mb-4'>
                        <CustomButton title="1 KW" onPress={() => handleAddCapacity(1)} extraClasses={"!bg-white border border-gray-200"} textClasses={'!text-secondary-v1'} />
                        <CustomButton title="2 KW" onPress={() => handleAddCapacity(2)} extraClasses={"!bg-white border border-gray-200"} textClasses={'!text-secondary-v1'} />
                        <CustomButton title="3 KW" onPress={() => handleAddCapacity(3)} extraClasses={"!bg-white border border-gray-200"} textClasses={'!text-secondary-v1'} />
                        <CustomButton title="5 KW" onPress={() => handleAddCapacity(5)} extraClasses={"!bg-white border border-gray-200"} textClasses={'!text-secondary-v1'} />
                        <CustomButton title="7 KW" onPress={() => handleAddCapacity(7)} extraClasses={"!bg-white border border-gray-200"} textClasses={'!text-secondary-v1'} />
                        <CustomButton title="10 KW" onPress={() => handleAddCapacity(10)} extraClasses={"!bg-white border border-gray-200"} textClasses={'!text-secondary-v1'} />
                    </View>
                    <AppText className='my-2 text-center'>OR</AppText>
                    <View className='mx-9'>
                        <CustomButton title="Custom Input" onPress={openSheet} extraClasses={""} />
                    </View>

                </View>
            </View>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
            >
                <BottomSheetView style={{ padding: 20 }}>
                    <AppText className='text-2xl font-bold text-center mb-4'>Custom Input</AppText>
                    <FormField title='Solar Capacity KW' value={customCapacity} handleChange={t => setCustomCapacity(t)} placeholder='eg 12' keyboardType={"numeric"} otherStyles={"mb-8"}/>
                    <CustomButton title="Done" onPress={() => handleAddCapacity(customCapacity)} extraClasses={""} />
                </BottomSheetView>
            </BottomSheet>
        </SafeAreaView>
    )
}

export default SolarCapacity