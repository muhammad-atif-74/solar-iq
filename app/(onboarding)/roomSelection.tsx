import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import Stepper from '@/components/ui/stepper'
import { defaultRooms } from '@/constants/rooms'
import { IMAGES } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Room } from '@/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const RoomSelection = () => {
  const { onboardingData, setOnboardingData } = useGlobalContext()
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({})

  // Total selected rooms count (sum of all quantities)
  const totalRooms = Object.values(roomCounts).reduce((sum, qty) => sum + qty, 0)
  // IDs of selected rooms (qty >= 1)
  const selectedIds = Object.keys(roomCounts).filter(id => roomCounts[id] > 0)

  const toggleRoom = (roomId: string) => {
    setRoomCounts(prev => {
      if (prev[roomId] > 0) {
        // Already selected → deselect
        const next = { ...prev }
        delete next[roomId]
        return next
      }
      // Not selected → select with qty 1
      return { ...prev, [roomId]: 1 }
    })
  }

  const increment = (roomId: string) => {
    setRoomCounts(prev => ({ ...prev, [roomId]: (prev[roomId] ?? 1) + 1 }))
  }

  const decrement = (roomId: string) => {
    setRoomCounts(prev => {
      const current = prev[roomId] ?? 1
      if (current <= 1) {
        // Remove from selection entirely
        const next = { ...prev }
        delete next[roomId]
        return next
      }
      return { ...prev, [roomId]: current - 1 }
    })
  }

  const handleContinue = () => {
    if (selectedIds.length === 0) {
      Alert.alert('Select at least one room', 'Please select at least one room to continue')
      return
    }
    // Build payload: [{ id, qty, name }, ...]
    const payload = selectedIds.map(id => {
      const room = defaultRooms.find(r => r.id === id)

      return {
        id,
        qty: roomCounts[id],
        name: room?.name ?? ''   // fallback safety
      }
    })

    console.log('Selected rooms:', payload)
    setOnboardingData({
      ...onboardingData,
      selected_rooms: payload
    })
    router.push('/(onboarding)/finalize')
  }

  const RoomCard = ({ room }: { room: Room }) => {
    const isSelected = (roomCounts[room.id] ?? 0) > 0
    const qty = roomCounts[room.id] ?? 1

    return (
      <TouchableOpacity
        onPress={() => toggleRoom(room.id)}
        // ── unchanged classes ──
        className={`w-[48%] p-4 rounded-2xl mb-3 ${isSelected ? 'bg-secondary-v1' : 'bg-white'}`}
        activeOpacity={0.7}
      >
        {/* ── unchanged top row ── */}
        <View className='flex-row items-start justify-between'>
          <View className='flex items-start flex-1'>
            <View className={`${isSelected ? 'bg-[#fff]' : 'bg-[#eeeded]'} h-10 w-10 rounded-full flex items-center justify-center`}>
              <MaterialCommunityIcons
                name={room.icon as any}
                size={24}
                color='#000'
              />
            </View>
          </View>

          <View
            className={`w-6 h-6 rounded-full border-2 items-center justify-center ml-2 mt-1 ${isSelected ? 'bg-white border-white' : 'bg-transparent border-gray-300'}`}
          >
            {isSelected && (
              <MaterialCommunityIcons name="check" size={16} color="#10b981" />
            )}
          </View>
        </View>

        {/* ── unchanged room name ── */}
        <AppText
          className={`text-lg mt-2 font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}
          numberOfLines={2}
        >
          {room.name}
        </AppText>

        {/* ── NEW: qty stepper, only visible when selected ── */}
        {isSelected && (
          <View className='flex-row items-center mt-3 self-start'>
            {/* − button */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation()          // don't bubble to card toggle
                decrement(room.id)
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                borderRadius: 100,
                width: 28,
                height: 28,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="minus" size={16} color="#fff" />
            </TouchableOpacity>

            {/* qty label */}
            <AppText
              style={{
                color: '#fff',
                fontWeight: '700',
                fontSize: 15,
                minWidth: 28,
                textAlign: 'center',
              }}
            >
              {qty}
            </AppText>

            {/* + button */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation()
                increment(room.id)
              }}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                borderRadius: 100,
                width: 28,
                height: 28,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="plus" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView className='h-screen bg-accent w-full'>
      <View className='px-4 flex-1'>
        <View>
          <Stepper
            currentStep={3}
          />
          <View className='h-[200px] flex items-center justify-center'>
            <Image
              source={IMAGES.roomIllustration}
              resizeMode='contain'
              className='w-full h-full'
            />
          </View>
        </View>

        {/* ── unchanged title block ── */}
        <View className='mb-6'>
          <AppText className='text-2xl font-semibold leading-10 text-center px-8'>
            Let's set up your rooms
          </AppText>
          <AppText className='text-sm text-gray-600 text-center mt-1'>
            Select at least one room to continue
          </AppText>
        </View>

        {/* ── unchanged rooms grid ── */}
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          <View className='flex-row flex-wrap justify-between pb-4'>
            {defaultRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </View>
        </ScrollView>

        {/* ── button: now shows total qty instead of room count ── */}
        <View className='pb-4 pt-2'>
          <CustomButton
            title={
              totalRooms === 0
                ? 'Continue'
                : `Continue (${totalRooms} room${totalRooms > 1 ? 's' : ''})`
            }
            onPress={handleContinue}
            isDisable={selectedIds.length === 0}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default RoomSelection