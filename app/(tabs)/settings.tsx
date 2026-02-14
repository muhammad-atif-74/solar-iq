import { useGlobalContext } from '@/context/GlobalProvider'
import { signOut } from '@/lib/supbase'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const settings = () => {
  const { setSession, setUserData, setIsLoggedIn } = useGlobalContext()


  const handleSignout = async () => {
    await signOut()

    setSession(null);
    setUserData(null);
    setIsLoggedIn(false)
    router.replace('/signIn');
  }
  return (
    <SafeAreaView>
      <Text>settings</Text>

      <TouchableOpacity onPress={handleSignout}>
        <Text className='text-xl font-bold text-red-400'>SIGNOUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default settings