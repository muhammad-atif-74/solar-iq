import { AppText } from '@/components/ui/app-text';
import { IMAGES } from '@/constants/theme';
import { useGlobalContext } from '@/context/GlobalProvider';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { FlatList, Image, ScrollView, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const data = [
  {
    "id": 1,
    "name": "Living Room Light",
    "type": "Light",
    "location": "Living Room",
    "status": "ON",
    "powerConsumptionWatts": 12,
    "lastUpdated": "2026-02-12T10:15:00Z"
  },
  {
    "id": 2,
    "name": "Air Conditioner",
    "type": "HVAC",
    "location": "Bedroom",
    "status": "OFF",
    "powerConsumptionWatts": 1500,
    "lastUpdated": "2026-02-12T09:50:00Z"
  },
  {
    "id": 3,
    "name": "Refrigerator",
    "type": "Kitchen Appliance",
    "location": "Kitchen",
    "status": "ON",
    "powerConsumptionWatts": 200,
    "lastUpdated": "2026-02-12T08:30:00Z"
  },
  {
    "id": 4,
    "name": "Washing Machine",
    "type": "Laundry Appliance",
    "location": "Laundry Room",
    "status": "OFF",
    "powerConsumptionWatts": 500,
    "lastUpdated": "2026-02-11T18:45:00Z"
  },
  {
    "id": 5,
    "name": "Ceiling Fan",
    "type": "Fan",
    "location": "Dining Room",
    "status": "ON",
    "powerConsumptionWatts": 75,
    "lastUpdated": "2026-02-12T10:05:00Z"
  }
]
const tabs = ['Living Room', 'Bedroom', 'Kitchen', 'All'];


const home = () => {
  const { session, userData } = useGlobalContext();

  const [activeTab, setActiveTab] = useState('All')

  if (!session) {
    return (
      <SafeAreaView className="bg-accent h-screen justify-center items-center">
        <AppText>Loading...</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='bg-accent h-screen'>
      <ScrollView className='relative h-full px-4 my-4' contentContainerStyle={{ flexGrow: 1 }}>

        {/* Header card  */}
        <View className='flex flex-row items-center justify-between mt-2 mb-8'>
          <View className='w-[12%]'>
            <View className='bg-secondary-v1 w-[43px] h-[43px] rounded-lg flex items-center justify-center'>
              <AppText className='text-white text-2xl font-bold'>
                {userData?.username.charAt(0).toUpperCase() ?? 'G'}
              </AppText>
            </View>
          </View>
          <View className='w-[62%]'>
            <AppText className='text-[20px] mb-1 font-bold'>Hi 👋, {userData && userData?.username || "Guest"}</AppText>
            <AppText className='text-sm text-[#838A8F]'>{new Date().toLocaleDateString('en-US', { weekday: 'long' })},{" "}{new Date().getDate()} {new Date().getFullYear()}</AppText>
          </View>
          <View className='w-[20%]'>
            <TouchableOpacity activeOpacity={0.8}>
              <FontAwesome name="gear" className='ms-auto' size={28} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard card  */}
        <View
          style={{
            shadowColor: '#333',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.4,
            shadowRadius: 2,
            elevation: 4
          }}
          className='relative p-6 w-full min-h-[108px] rounded-[20px] bg-[#F5F5F5] flex flex-row justify-between items-center mb-6'>
          <View>
            <AppText className='font-bold text-base text-black mb-0'>Energy Saving</AppText>
            <AppText className='font-bold text-[35px] text-green-500 my-1'>+35%</AppText>
            <AppText className='text-[#838A8F] text-sm'>23.5 kWh</AppText>
          </View>
          <View className='h-[86px] p-0 flex items-center justify-center text-end'>
            <Image
              source={IMAGES.thunderIllustration}
              resizeMode='cover'
              className='w-[107px] h-[86px] ms-auto'
            />
          </View>
        </View>

        {/* Tabs  */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingVertical: 4, gap: 6 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(item)}
              className='relative px-4 pb-2'
              activeOpacity={0.8}
            >
              <AppText className={`font-semibold ${activeTab === item ? 'text-secondary-v1 !font-poppinsBold' : 'text-[#7D7D7D]'}`}>
                {item}
              </AppText>
              {activeTab === item && (
                <View
                  style={{ alignSelf: 'center' }}
                  className='absolute bottom-0 w-2 h-2 rounded-full bg-secondary-v1'
                />
              )}
            </TouchableOpacity>
          )}
        />

        {/* Skeleton Loading cards  */}
        <View className='hidden flex-row flex-wrap items-stretch gap-2 w-full mt-4 mb-16'>
          {
            [1, 2, 3, 4].map((item, i) => {
              return (
                <View className='relative h-[220px] rounded-[20px] py-6 w-[48%] bg-[#EDEDED] animate-pulse' key={i}>
                </View>
              )
            })
          }
        </View>

        {/* Cards Grid  */}
        <View className='flex flex-row flex-wrap items-stretch gap-2 w-full mt-4 mb-16'>
          {
            data.map(item => {
              return (
                <View 
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 0.3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 0.3,
                  elevation: 0.5
                }}
                                
                className='relative h-[220px] rounded-[20px] py-6 w-[48%] bg-[#EDEDED]' key={item.id}>
                  <View className='px-6'>
                    <View className='w-[45px] h-[45px] bg-[#DADADA] rounded-full mb-4 flex items-center justify-center'>
                      <AntDesign name="bulb" size={24} color="black" />
                    </View>
                    <AppText className='text-[18px] font-bold text-secondary-v1 mb-1'>{item.name}</AppText>
                    <AppText className='text-[13px] font-semibold text-[#A7A7A7]'>{item.powerConsumptionWatts} watts</AppText>
                  </View>

                  <View className='absolute bottom-2 left-0 right-0 w-full px-6 mx-auto flex flex-row items-center justify-between'>
                    <AppText className='text-[17px] font-medium text-[#7D7D7D]'>{item.status}</AppText>
                    <Switch
                      trackColor={{ false: '#D6D6D6', true: '#1c1c1c' }}
                      thumbColor={item.status === "ON" ? '#F9F9F9' : '#fff'}
                      ios_backgroundColor="#fff"
                      onValueChange={() => { }}
                      value={item.status === "ON"}
                    />
                  </View>
                </View>
              )
            })
          }
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default home