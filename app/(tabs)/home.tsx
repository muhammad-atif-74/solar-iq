import AddRoomBottomSheet from '@/components/bottomSheets/AddRoomBottomSheet';
import { AppText } from '@/components/ui/app-text';
import { defaultRooms } from '@/constants/rooms';
import { IMAGES } from '@/constants/theme';
import { useGlobalContext } from '@/context/GlobalProvider';
import { createRoom, getUserHome, getUserRooms } from '@/lib/supbase';
import { HomeData, UserRoom } from '@/types';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BottomSheet from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, ScrollView, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const home = () => {
  const { session, userData } = useGlobalContext();
  const { room_id } = useLocalSearchParams()
  const addRoomBottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();


  const [activeTab, setActiveTab] = useState<number | "all">(Number(room_id) || "all")
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [roomsData, setRoomsData] = useState<UserRoom[] | []>([])
  // const [activeRooms, setActiveRooms] = useState<Room[] | []>([])

  const [newRoomName, setNewRoomName] = useState("")
  const [keepDefaultRoomName, setKeepDefaultRoomName] = useState(false)
  const [selectedRoomCategory, setSelectedRoomCategory] = useState(defaultRooms[0].id);

  const [loadingRooms, setLoadingRooms] = useState(false)


  const snapPoints = ['55%'];
  const openAddRoomSheet = () => {
    addRoomBottomSheetRef.current?.expand();
  };
  const closeAddRoomSheet = () => {
    addRoomBottomSheetRef.current?.close();
  };

  const fetchHome = async () => {

    try {
      const homeData = await getUserHome(userData?.userid);
      setHomeData(homeData)
    }
    catch (err) {
      console.log(err)
    }
  }

  const fetchRooms = async () => {
    setLoadingRooms(true)
    try {
      const roomsData = await getUserRooms(userData?.userid);
      setRoomsData(roomsData)
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoadingRooms(false)
    }
  }

  const addRoom = async () => {
    if ((newRoomName === "" && !keepDefaultRoomName)) {
      Alert.alert("Error", "Enter room name or use check keep default name to continue.")
      return;
    }
    if ((selectedRoomCategory === "")) {
      Alert.alert("Error", "Select room category to continue.")
      return;
    }
    try {
      let roomName = ""
      if (keepDefaultRoomName) {
        roomName = defaultRooms.find(room => room.id === selectedRoomCategory)?.name!
      }
      else {
        roomName = newRoomName
      }
      await createRoom(userData.userid, selectedRoomCategory, roomName)
      setNewRoomName("")
      setSelectedRoomCategory("")
      setKeepDefaultRoomName(false)
      closeAddRoomSheet()
      fetchRooms()
    }
    catch (err) {
      Alert.alert("Error", "Something went wrong while creating new room.")
      console.log(err)
    }
  }



  useEffect(() => {
    if (!userData?.userid) return;

    fetchHome()
    fetchRooms()
  }, [userData])

  const activeRooms = useMemo(() => {
    if (activeTab === "all") return roomsData;

    return roomsData.filter(
      (room) => room.room_id === String(activeTab)
    );
  }, [activeTab, roomsData]);


  if (loadingRooms || !session) {
    return (
      <SafeAreaView className="bg-accent h-screen justify-center items-center">
        <ActivityIndicator />
      </SafeAreaView>
    )
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
            {
              homeData?.has_solar &&
              <AppText className='text-[#838A8F] text-sm'>{homeData?.solar_capacity_kw} kWh</AppText>
            }
            {/* <TouchableOpacity onPress={() => router.push('/(onboarding)/homeName')}><AppText>Onboarding</AppText></TouchableOpacity> */}
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
          data={[
            { id: "all", room_name: "All" } as unknown as UserRoom,
            ...roomsData,
            { id: "add_new", room_name: "Add New" } as unknown as UserRoom
          ]}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingVertical: 4, gap: 6 }}
          className='max-h-10'
          renderItem={({ item }) => {
            if (String(item.id) === "add_new") {
              return (
                <TouchableOpacity
                  onPress={openAddRoomSheet}
                  className='relative px-4 pb-2'
                  activeOpacity={0.8}
                >
                  <AppText className='font-semibold text-[#7D7D7D]'>+ Add Room</AppText>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                onPress={() => setActiveTab(item.id)}
                className='relative px-4 pb-2'
                activeOpacity={0.8}
              >
                <AppText className={`font-semibold ${activeTab === item.id ? 'text-secondary-v1 !font-poppinsBold' : 'text-[#7D7D7D]'}`}>
                  {item.room_name}
                </AppText>
                {activeTab === item.id && (
                  <View
                    style={{ alignSelf: 'center' }}
                    className='absolute bottom-0 w-2 h-2 rounded-full bg-secondary-v1'
                  />
                )}
              </TouchableOpacity>
            );
          }}
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

          {/* add new device card  */}
          {
            activeTab !== "all" &&
            <Pressable
              onPress={() => router.push(`/(add-device)/selectDevice?room_id=${activeTab}`)}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0.3 },
                shadowOpacity: 0.05,
                shadowRadius: 0.3,
                elevation: 0.5,
              }}
              className='relative h-[220px] rounded-[20px] py-6 w-[48%] bg-[#EDEDED] items-center justify-center border border-dashed border-[#bbbbbb]'>
              <View className='items-center justify-center'>
                <View className='w-[60px] h-[60px] bg-[#e7e7e7] border border-dashed border-[#d0d0d0] rounded-full mb-4 items-center justify-center'>
                  <AntDesign name="plus" size={32} color="black" />
                </View>
                <AppText className='text-[16px] font-semibold text-secondary-v1 mb-1'>Add New Device</AppText>
              </View>
            </Pressable>
          }

          {
            activeRooms.length > 0 ?
              activeRooms.map(item => {
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
                      <AppText className='text-[18px] font-bold text-secondary-v1 mb-1'>{item.room_name}</AppText>
                      <AppText className='text-[13px] font-semibold text-[#A7A7A7]'>{item.powerConsumptionWatts | 0} appliances</AppText>
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
              }) : (
                // <AppText>No rooms found</AppText>
                <></>
              )
          }

        </View>
      </ScrollView>

      {/* Add new room modal  */}
      <AddRoomBottomSheet
        ref={addRoomBottomSheetRef}
        addRoom={addRoom}
        defaultRooms={defaultRooms}
        keepDefaultRoomName={keepDefaultRoomName}
        setKeepDefaultRoomName={setKeepDefaultRoomName}
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        selectedRoomCategory={selectedRoomCategory}
        setSelectedRoomCategory={setSelectedRoomCategory}
        snapPoints={snapPoints}
      />

    </SafeAreaView>
  )
}

export default home