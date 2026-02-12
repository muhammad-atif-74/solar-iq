import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import FormField from '@/components/ui/form-field'
import { IMAGES } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getUserDetails, signUp } from '@/lib/supbase'
import Feather from '@expo/vector-icons/Feather'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignUp = () => {
  const {setSession, setIsLoggedIn, setUserData} = useGlobalContext();

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
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
      setIsLoading(true);
    
      try {
        const data = await signUp(form.username, form.email, form.password);
    
        if (data?.session) {
          const userDetails = await getUserDetails(data?.session.user.id)

          setSession(data.session);
          setUserData(userDetails);
          setIsLoggedIn(true)
          router.replace('/home');
        } else {
          Alert.alert(
            "Check your email",
            "Please verify your email before logging in."
          );
        }
    
      } catch (err: any) {
        console.log(err);
    
        if (err.message === "User already registered") {
          Alert.alert(
            "Signup Failed",
            "This email is already registered. Please login instead."
          );
        } else {
          Alert.alert("Error", err.message || "Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
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
              title='Username' placeholder='Faraz Ahmad' value={form.username} handleChange={text => { setForm({ ...form, username: text }); setErrors({ ...errors, username: '' }) }} icon={<Feather name="mail" size={22} color="#7b7b8b" />} otherStyles={"mb-6"} error={errors.username}
            />

            <FormField
              title='Email' placeholder='example@gmail.com' value={form.email} handleChange={text => { setForm({ ...form, email: text }); setErrors({ ...errors, email: '' }) }} icon={<Feather name="mail" size={22} color="#7b7b8b" />} otherStyles={"mb-6"} error={errors.email}
            />

            <FormField
              title='Password' placeholder='Password' value={form.password} handleChange={text => { setForm({ ...form, password: text }); setErrors({ ...errors, password: '' }) }} icon={<Feather name="lock" size={22} color="#7b7b8b" />} otherStyles={"mb-12"} error={errors.password}
            />

            <CustomButton title='Sign Up' extraClasses={"rounded-full mb-4"} onPress={handleSubmit} isLoading={isLoading} />

            <AppText className='text-center text-sm text-gray-600'>Already have an account? <Text className='text-secondary-v1 font-bold' onPress={() => { router.push("/signIn") }}>Sign In</Text></AppText>
          </View>
        </ScrollView>
      </ScrollView>
      <StatusBar backgroundColor='#1c1c1c' style='light' />
    </SafeAreaView>
  )
}

export default SignUp