import { AppText } from '@/components/ui/app-text'
import { useGlobalContext } from '@/context/GlobalProvider'
import { signOut } from '@/lib/supbase'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SectionLabel = ({ label }: { label: string }) => (
  <AppText className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-2 px-1">
    {label}
  </AppText>
)

const SettingsRow = ({
  icon,
  label,
  subtitle,
  onPress,
  danger = false,
}: {
  icon: React.ReactNode
  label: string
  subtitle?: string
  onPress?: () => void
  danger?: boolean
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 last:border-b-0"
  >
    <View className={`w-[34px] h-[34px] rounded-lg items-center justify-center ${danger ? 'bg-red-50' : 'bg-gray-100'}`}>
      {icon}
    </View>
    <View className="flex-1">
      <AppText className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-[#111827]'}`}>
        {label}
      </AppText>
      {subtitle && (
        <AppText className="text-xs text-[#9CA3AF] mt-0.5">{subtitle}</AppText>
      )}
    </View>
    {/* {!danger && <Feather name="chevron-right" size={16} color="#D1D5DB" />} */}
  </TouchableOpacity>
)

const settings = () => {
  const { setSession, setUserData, setIsLoggedIn, userData } = useGlobalContext()

  const handleSignout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut()
          setSession(null)
          setUserData(null)
          setIsLoggedIn(false)
          router.replace('/signIn')
        },
      },
    ])
  }

  const initials = userData?.username
    ? userData.username.slice(0, 2).toUpperCase()
    : 'GU'

  return (
    <SafeAreaView className="bg-accent h-screen">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Avatar header */}
        <View className="bg-secondary-v1 px-6 pt-8 pb-8 items-center">
          <View className="w-20 h-20 rounded-full bg-[#3a3a3a] border-2 border-[#444] items-center justify-center mb-3">
            <AppText className="text-white text-[28px] font-bold">{initials}</AppText>
          </View>
          <AppText className="text-white text-lg font-bold">
            {userData?.username ?? 'Guest'}
          </AppText>
          <AppText className="text-[#aaa] text-sm mt-1">
            {userData?.email ?? '—'}
          </AppText>
        </View>

        <View className="px-4 pt-6 gap-5">

          {/* Account section */}
          <View>
            <SectionLabel label="Account" />
            <View className="rounded-xl overflow-hidden border border-gray-100">
              <SettingsRow
                icon={<Feather name="user" size={16} color="#374151" />}
                label="Username"
                subtitle={userData?.username ?? '—'}
              />
              <SettingsRow
                icon={<Feather name="mail" size={16} color="#374151" />}
                label="Email"
                subtitle={userData?.email ?? '—'}
              />
            </View>
          </View>

          {/* App section */}
          <View>
            <SectionLabel label="App" />
            <View className="rounded-xl overflow-hidden border border-gray-100">
              {/* <SettingsRow
                icon={<Ionicons name="notifications-outline" size={16} color="#374151" />}
                label="Notifications"
              /> */}
              <SettingsRow
                icon={<Feather name="info" size={16} color="#374151" />}
                label="About"
                onPress={() => router.push("/about")}
              />
            </View>
          </View>

          {/* Sign out */}
          <View className="rounded-xl overflow-hidden border border-gray-100">
            <SettingsRow
              icon={<MaterialCommunityIcons name="logout" size={16} color="#EF4444" />}
              label="Sign out"
              danger
              onPress={handleSignout}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default settings