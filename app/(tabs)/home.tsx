import AddRoomBottomSheet from '@/components/bottomSheets/AddRoomBottomSheet';
import { AppText } from '@/components/ui/app-text';
import Device from '@/components/ui/Device';
import { IMAGES } from '@/constants/theme';
import { useGlobalContext } from '@/context/GlobalProvider';
import { createRoom, getDevices, getUserHome, getUserRooms, toggleAllDevicesStatus, toggleDeviceStatus } from '@/lib/supbase';
import { DEVICE, DEVICE_DB, HomeData, UserRoom } from '@/types';
import { FontAwesome5 } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BottomSheet from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCompleteDevices, getWattageInUse } from '../utils';


const home = () => {
  const { session, userData } = useGlobalContext();
  const { room_id } = useLocalSearchParams()
  const addRoomBottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();


  const [activeTab, setActiveTab] = useState<number | "all">(Number(room_id) || "all")
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [roomsData, setRoomsData] = useState<UserRoom[] | []>([])

  const [allDevices, setAllDevices] = useState<DEVICE[]>([]);
  const [devices, setDevices] = useState<DEVICE[] | []>([])


  const [loadingRooms, setLoadingRooms] = useState(false)
  const [loadingDevices, setLoadingDevices] = useState(false)


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


  const fetchDevices = async () => {
    setLoadingDevices(true)
    try {
      // ALL devices
      const all: DEVICE_DB[] | null = await getDevices(null);
      const allList: DEVICE[] = all ? getCompleteDevices(all) : [];
      setAllDevices(allList);

      // (filtered)
      const filtered: DEVICE_DB[] | null = await getDevices(activeTab === "all" ? null : Number(activeTab));
      const filteredList: DEVICE[] = filtered ? getCompleteDevices(filtered) : [];

      setDevices(filteredList);

    } catch (err) {
      console.log(err)
    } finally {
      setLoadingDevices(false)
    }
  }


  const toggleDeviceStatusOnOff = async (id: number, status: boolean) => {
    try {
      setDevices(prev =>
        prev.map(device =>
          device.device_id === id
            ? { ...device, is_on: status }
            : device
        )
      );

      await toggleDeviceStatus(id, status);

    } catch (err) {
      console.log(err);

      // revert if failed
      setDevices(prev =>
        prev.map(device =>
          device.device_id === id
            ? { ...device, is_on: !status }
            : device
        )
      );

      Alert.alert("Error", "Something went wrong while toggling.");
    }
  };

  const handleToggleAll = async (status: boolean) => {
    try {

      await toggleAllDevicesStatus(status);

      setDevices(prev =>
        prev.map(device => ({ ...device, is_on: status }))
      )
    }
    catch (err) {
      Alert.alert("Error", "Something went wrong while toggling.");
    }
  }


  const handleAddRoom = async (categoryId: string, roomName: string) => {
    try {
      await createRoom(userData.userid, categoryId, roomName);
      closeAddRoomSheet();
      fetchRooms();
    } catch (err) {
      Alert.alert("Error", "Something went wrong while creating new room.");
    }
  };



  useEffect(() => {
    if (!userData?.userid) return;

    fetchHome()
    fetchRooms()
  }, [userData])


  useEffect(() => {
    fetchDevices()
  }, [activeTab])


  // if (loadingRooms || !session) {
  //   return (
  //     <SafeAreaView className="bg-accent h-screen justify-center items-center">
  //       <ActivityIndicator />
  //     </SafeAreaView>
  //   )
  // }

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
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/settings")}>
              <FontAwesome name="gear" className='ms-auto' size={28} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard card  */}
        {
          loadingDevices ? (
            <View style={{ shadowColor: '#333', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.4, shadowRadius: 2, elevation: 4 }}
              className='p-6 w-full rounded-[20px] bg-[#F5F5F5] mb-6'></View>
          ) : (devices.length > 0 ?
            (
              <>
                <View style={{ shadowColor: '#333', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.4, shadowRadius: 2, elevation: 4 }}
                  className='p-6 w-full rounded-[20px] bg-[#F5F5F5] mb-2'>

                  {/* Top row */}
                  <View className='flex-row justify-between items-start mb-4'>
                    <View>
                      <AppText className='text-[#838A8F] text-sm mb-1'>Currently in use</AppText>
                      <AppText className='font-bold text-[32px] text-black leading-none'>
                        {getWattageInUse(devices)}
                        <AppText className='font-normal text-base text-[#838A8F]'> W</AppText>
                      </AppText>
                    </View>
                    {homeData?.has_solar && (
                      <View className='items-end'>
                        <AppText className='text-[#838A8F] text-sm mb-1'>Solar capacity</AppText>
                        <AppText className='font-bold text-[32px] text-black leading-none'>
                          {homeData.solar_capacity_kw}000
                          <AppText className='font-normal text-base text-[#838A8F]'> W</AppText>
                        </AppText>
                      </View>
                    )}
                  </View>

                  {/* Progress bar */}
                  {homeData?.has_solar && (() => {
                    const totalW = homeData.solar_capacity_kw * 1000;
                    const usedW = getWattageInUse(devices);
                    const pct = Math.min((usedW / totalW) * 100, 100);
                    const remaining = totalW - usedW;
                    const isOver = usedW > totalW;
                    return (
                      <>
                        <View className='w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2'>
                          <View
                            style={{ width: `${pct}%`, backgroundColor: isOver ? '#ef4444' : '#22c55e' }}
                            className='h-full rounded-full'
                          />
                        </View>
                        <View className='flex-row justify-between'>
                          <AppText className='text-xs text-[#838A8F]'>{Math.round(pct)}% used</AppText>
                          <AppText className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-green-500'}`}>
                            {isOver ? `${Math.abs(remaining)}W over limit` : `${remaining}W remaining`}
                          </AppText>
                        </View>
                      </>
                    );
                  })()}
                </View>
              </>
            ) : (
              <>
                <View style={{ shadowColor: '#333', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.4, shadowRadius: 2, elevation: 4 }}
                  className='p-6 w-full rounded-[20px] bg-[#F5F5F5] mb-2 items-center justify-center min-h-[108px]'>
                  <Image source={IMAGES.thunderIllustration} resizeMode='contain' className='w-16 h-12 mb-3 opacity-30' />
                  <AppText className='font-bold text-black text-sm mb-1'>No appliances added yet</AppText>
                  <AppText className='text-[#838A8F] text-xs text-center mb-3'>Add your first device to start tracking energy usage</AppText>
                  <TouchableOpacity onPress={() => router.push('/')}
                    className='bg-green-500 px-5 py-2 rounded-full'>
                    <AppText className='text-white text-xs font-bold'>+ Add Appliance</AppText>
                  </TouchableOpacity>
                </View>
              </>
            )
          )
        }
        {(homeData?.has_solar && devices.length > 0) && (() => {
          const totalW = homeData.solar_capacity_kw * 1000;
          const usedW = getWattageInUse(devices);
          const remaining = totalW - usedW;
          const isOver = usedW > totalW;
          console.log(devices)
          const isAnyDeviceOn = devices.some(dev => dev.is_on);

          return (
            <View className='flex flex-row items-center justify-between mb-6 mt-1 '>
              <View className={`flex-row items-center gap-2 px-4 py-2 rounded-full self-start ${isOver ? 'bg-red-100' : 'bg-green-100'}`}>
                <View className={`w-2 h-2 rounded-full ${isOver ? 'bg-red-500' : 'bg-green-500'}`} />
                <AppText className={`text-xs font-bold ${isOver ? 'text-red-600' : 'text-green-600'}`}>
                  {isOver
                    ? `Reduce ${Math.abs(remaining)}W to stay within limit`
                    : `You can add up to ~${remaining}W more`}
                </AppText>
              </View>
              {/* TURN OFF/ON ALL  */}
              <TouchableOpacity onPress={() => handleToggleAll(!isAnyDeviceOn)} className='px-4 py-2 rounded-full bg-secondary-v1 flex flex-row gap-2'>

                {
                  isAnyDeviceOn ? (
                    <>
                      <FontAwesome5 name="power-off" size={12} color="white" />
                      <AppText className="text-xs font-bold text-white">
                        Turn Off All
                      </AppText>
                    </>
                  ) : (
                    <>
                      <FontAwesome5 name="lightbulb" size={12} color="white" />
                      <AppText className="text-xs font-bold text-white">
                        Turn On All
                      </AppText>
                    </>
                  )
                }
              </TouchableOpacity>
            </View>
          );
        })()}


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
        {
          loadingDevices ?
            <View className='flex-row flex-wrap items-stretch gap-2 w-full mt-4 mb-16'>
              {
                [1, 2, 3, 4].map((item, i) => {
                  return (
                    <View className='relative h-[220px] rounded-[20px] py-6 w-[48%] bg-[#EDEDED] animate-pulse' key={i}>
                    </View>
                  )
                })
              }
            </View> :
            (
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
                    className='relative h-[180px] rounded-[20px] py-6 w-[48%] bg-[#EDEDED] items-center justify-center border border-dashed border-[#bbbbbb]'>
                    <View className='items-center justify-center'>
                      <View className='w-[60px] h-[60px] bg-[#e7e7e7] border border-dashed border-[#d0d0d0] rounded-full mb-4 items-center justify-center'>
                        <AntDesign name="plus" size={32} color="black" />
                      </View>
                      <AppText className='text-[16px] font-semibold text-secondary-v1 mb-1'>Add New Device</AppText>
                    </View>
                  </Pressable>
                }

                {
                  devices.length > 0 ?
                    devices.map(item => {
                      return (
                        <Device device={item} toggleDeviceStatusOnOff={toggleDeviceStatusOnOff} key={item.id} />
                      )
                    }) : (
                      // <AppText>No rooms found</AppText>
                      <></>
                    )
                }

              </View>
            )
        }



      </ScrollView>

      {/* Add new room modal  */}
      <AddRoomBottomSheet
        ref={addRoomBottomSheetRef}
        snapPoints={snapPoints}
        onAddRoom={handleAddRoom}
      />

    </SafeAreaView >
  )
}

export default home