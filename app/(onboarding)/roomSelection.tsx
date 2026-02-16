import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import { defaultRooms } from '@/constants/rooms'
import { IMAGES } from '@/constants/theme'
import { Room } from '@/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const RoomSelection = () => {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])

  const toggleRoom = (roomId: string) => {
    setSelectedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    )
  }

  const handleContinue = () => {
    if (selectedRooms.length === 0) {
      Alert.alert('Select at least one room', 'Please select at least one room to continue')
      return
    }
    // Navigate to next screen or save selected rooms
    console.log('Selected rooms:', selectedRooms)
  }

  const RoomCard = ({ room }: { room: Room }) => {
    const isSelected = selectedRooms.includes(room.id)

    return (
      <TouchableOpacity
        onPress={() => toggleRoom(room.id)}
        className={`w-[48%] p-4 rounded-2xl mb-3  ${isSelected ? 'bg-secondary-v1' : 'bg-white'
          }`}
        activeOpacity={0.7}
      >
        <View className='flex-row items-start justify-between'>
          <View className='flex items-start flex-1'>

            <View className={`${isSelected ? 'bg-[#fff]' : 'bg-[#eeeded]'} h-10 w-10 rounded-full flex items-center justify-center`}>
              <MaterialCommunityIcons
                name={room.icon as any}
                size={24}
                color={isSelected ? '#000' : '#000'}
              />
            </View>
          </View>

          <View
            className={`w-6 h-6 rounded-full border-2 items-center justify-center ml-2 mt-1 ${isSelected
              ? 'bg-white border-white'
              : 'bg-transparent border-gray-300'
              }`}
          >
            {isSelected && (
              <MaterialCommunityIcons name="check" size={16} color="#10b981" />
            )}
          </View>
        </View>

        <AppText
          className={`text-lg mt-2 font-semibold ${isSelected ? 'text-white' : 'text-gray-900'
            }`}
          numberOfLines={2}
        >
          {room.name}
        </AppText>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView className='h-screen bg-accent w-full'>
      <View className='px-4 flex-1'>
        {/* Header Image */}
        <View className='h-[250px] mt-4'>
          <Image
            source={IMAGES.roomIllustration}
            resizeMode='contain'
            className='w-full h-full'
          />
        </View>

        {/* Title */}
        <View className='mb-6'>
          <AppText className='text-2xl font-semibold leading-10 text-center px-8'>
            Let's set up your rooms
          </AppText>
          <AppText className='text-sm text-gray-600 text-center mt-1'>
            Select at least one room to continue
          </AppText>
        </View>

        {/* Rooms */}
        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={false}
        >
          <View className='flex-row flex-wrap justify-between pb-4'>
            {defaultRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </View>
        </ScrollView>

        <View className='pb-4 pt-2'>
          <CustomButton title={`Continue (${selectedRooms.length} selected)`} onPress={handleContinue} isDisable={selectedRooms.length === 0} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default RoomSelection