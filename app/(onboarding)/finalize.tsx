import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AppText } from '@/components/ui/app-text'
import Stepper from '@/components/ui/stepper'
import { IMAGES } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalProvider'
import { createNewHome, createUserRooms, updateUser } from '@/lib/supbase'
import { router } from 'expo-router'

const Finalize = () => {
  const { onboardingData, userData } = useGlobalContext()
  const [status, setStatus] = useState("Preparing your experience...")

  const updateIsOnboarded = async () => {
    try {
      await updateUser(userData?.userid, true)
    }
    catch (err) {
      Alert.alert("Something went wrong. ")
      console.log(err)
    }
  }

  const createHome = async () => {
    try {
      await createNewHome(userData?.userid, onboardingData?.home_name || null, null, onboardingData?.is_solar || false, onboardingData?.solar_capacity_kw || null)
    }
    catch (err) {
      Alert.alert("Something went wrong while creating home.")
      console.log(err)
    }
  }

  const createNewRooms = async () => {
    try {
      const selectedRooms = onboardingData?.selected_rooms;
      const user_id = userData?.userid;

      if (!user_id || !selectedRooms) return;

      await createUserRooms(
        user_id, selectedRooms
      );

    }
    catch (err) {
      Alert.alert("Something went wrong while creating rooms.")
      console.log(err)
    }
  }

  const runOnboardingFlow = async () => {
    try {
      if (!userData?.userid || !onboardingData) return;

      setStatus("Creating your home...");
      await createHome();

      setStatus("Setting up your rooms...");
      await createNewRooms();

      setStatus("Finalizing your experience...");
      await updateIsOnboarded();

      setStatus("All set 🎉");

      // navigate away if needed
      router.replace("/(tabs)/home");

    } catch (err) {
      Alert.alert("Something went wrong during setup.");
      console.log(err);
    }
  };


  useEffect(() => {
    if (!userData || !onboardingData) return;

    runOnboardingFlow();
  }, [userData, onboardingData]);


  return (
    <SafeAreaView className='h-screen bg-accent w-full'>

      <View className='px-4 my-8 flex-1 justify-between'>

        {/* Top */}
        <View>

          <Stepper currentStep={4} />

          {/* Illustration */}
          <View className='h-[300px] flex items-center justify-center'>
            <Image
              source={IMAGES.finalizingIllustration}
              resizeMode='contain'
              className='w-full h-full opacity-90'
            />
          </View>

        </View>


        {/* Bottom */}
        <View className='w-full items-center mb-12'>

          <AppText className='text-2xl font-semibold text-center mb-3'>
            Finalizing your setup
          </AppText>

          <AppText className='text-center text-gray-500 mb-8 px-10'>
            We're configuring everything for you. This will only take a moment.
          </AppText>


          {/* Loader */}
          <ActivityIndicator
            size="large"
            color="#2C67F2" // your secondary-v1 color
          />


          {/* Status text */}
          <AppText className='text-secondary-v1 mt-6 font-medium'>
            {status}
          </AppText>

        </View>

      </View>

    </SafeAreaView>
  )
}

export default Finalize
