import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import FormField from '@/components/ui/form-field'
import { IMAGES } from '@/constants/theme'
import Feather from '@expo/vector-icons/Feather'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  })
  const handleSubmit = () => {
    // Validate form fields
    let valid = true;
    let newErrors = { username: '', email: '', password: '' };

    if (!form.username) {
      newErrors.username = 'Username is required';
      valid = false;
    }
    if (!form.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      // Handle successful form submission (e.g., API call)
      console.log('Form submitted successfully:', form);
    }
  }
  return (
    <SafeAreaView className='bg-secondary-v1 h-screen'>
      <ScrollView className=' relative h-full' contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Image
            source={IMAGES.solarIQLogo}
            className='w-36 h-36 mx-auto mt-10'
            resizeMode='contain'
          />
        </View>
        <ScrollView
          className='w-full h-[75%] absolute bottom-0 left-0 right-0 rounded-tr-[3.5rem] rounded-tl-[3.5rem] bg-accent px-4 py-6'>
          <View>
            <Text className='mt-4 text-3xl text-center text-secondary-v1 font-poppinsRegular font-bold mb-3'>Register</Text>
            <AppText className='text-center text-sm text-gray-600'>Create account to manage your electric workload</AppText>
          </View>

          <View className='mt-10'>
            <FormField
              title='Username' placeholder='Faraz Ahmad' value={form.username} handleChange={text => {setForm({ ...form, username: text }); setErrors({...errors, username: ''})}} icon={<Feather name="mail" size={22} color="#7b7b8b" />} otherStyles={"mb-6"} error={errors.username}
            />

            <FormField
              title='Email' placeholder='example@gmail.com' value={form.email} handleChange={text => {setForm({ ...form, email: text }); setErrors({...errors, email: ''})}} icon={<Feather name="mail" size={22} color="#7b7b8b" />} otherStyles={"mb-6"} error={errors.email}
            />

            <FormField
              title='Password' placeholder='Password' value={form.password} handleChange={text => {setForm({ ...form, password: text }); setErrors({...errors, password: ''})}} icon={<Feather name="lock" size={22} color="#7b7b8b" />} otherStyles={"mb-12"} error={errors.password}
            />

            <CustomButton title='Sign Up' extraClasses={"rounded-full mb-4"} onPress={handleSubmit} />

            <AppText className='text-center text-sm text-gray-600'>Already have an account? <Text className='text-secondary-v1 font-bold' onPress={() => { router.push("/signIn") }}>Sign In</Text></AppText>
          </View>
        </ScrollView>
      </ScrollView>
      <StatusBar backgroundColor='#1c1c1c' style='light' />
    </SafeAreaView>
  )
}

export default SignUp