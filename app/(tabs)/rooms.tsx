import AddRoomBottomSheet from '@/components/bottomSheets/AddRoomBottomSheet'
import { AppText } from '@/components/ui/app-text'
import DisplayIcon from '@/components/ui/DisplayIcon'
import { useGlobalContext } from '@/context/GlobalProvider'
import { createRoom, deleteRoom, getUserHome, getUserRooms, updateHomeData } from '@/lib/supbase'
import { Detailed_Room, HomeData, UserRoom } from '@/types'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import BottomSheet from '@gorhom/bottom-sheet'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, FlatList, Image, RefreshControl, TouchableOpacity, View } from 'react-native'

import EditHomeDataBottomSheet from '@/components/bottomSheets/EditHomeBottomSheet'
import { useFetchDevices } from '@/hooks/useFetchDevices'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getCompleteRooms } from '../utils'

const rooms = () => {
  const { session, userData } = useGlobalContext();
  const { fetchDevices, devices } = useFetchDevices();

  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [loadingHome, setLoadingHome] = useState(true)
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [roomsData, setRoomsData] = useState<Detailed_Room[] | []>([])
  const [deleteRoomId, setDeleteRoomId] = useState<number | null>(null)

  const [refreshing, setRefreshing] = useState(false)



  const fetchHome = async () => {
    setLoadingHome(true)

    try {
      const homeData = await getUserHome(userData?.userid);
      setHomeData(homeData)
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoadingHome(false)


    }
  }


  const fetchRooms = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoadingRooms(true)
    try {
      const dbRooms: UserRoom[] = await getUserRooms(userData?.userid);
      const detailedRooms: Detailed_Room[] = await getCompleteRooms(dbRooms)
      setRoomsData(detailedRooms)
    }
    catch (err) {
      console.log(err)
    }
    finally {
      isRefresh ? setRefreshing(false) : setLoadingRooms(false)
    }
  }


  const addRoomBottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = ['55%'];
  const openAddRoomSheet = () => {
    addRoomBottomSheetRef.current?.expand();
  };
  const closeAddRoomSheet = () => {
    addRoomBottomSheetRef.current?.close();
  };
  const handleAddRoom = async (categoryId: string, roomName: string) => {
    try {
      await createRoom(userData.userid, categoryId, roomName);
      closeAddRoomSheet();
      fetchRooms();
    } catch (err) {
      Alert.alert("Error", "Something went wrong while creating new room.");
    }
  };

  const editHomeDataBottomSheetRef = useRef<BottomSheet>(null);

  const snapPointsEditHomeData = ['70%'];
  const openEditHomeDataSheet = () => {
    editHomeDataBottomSheetRef.current?.expand();
  };
  const closeEditHomeDataSheet = () => {
    editHomeDataBottomSheetRef.current?.close();
  };

  const handleUpdateHomeData = async (homeName: string, hasSolar: boolean, solarCapacity: string | number | null, location: string | null) => {
    // console.log(homeName, hasSolar, solarCapacity, location)

    try {
      await updateHomeData(userData.userid, homeName, hasSolar, solarCapacity, location);
      closeEditHomeDataSheet()
      fetchHome()
    }
    catch (err) {
      Alert.alert("Something went wrong while updating home.")
      console.log(err)
    }

  }


  const handleDeleteRoom = (roomId: number) => {
    Alert.alert(
      "Delete Room",
      "Are you sure you want to delete this room? All devices inside will also be removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRoom(roomId);

              setRoomsData(prev => prev.filter(r => r.db_id !== roomId));
              fetchRooms();

            } catch (err) {
              Alert.alert("Error", "Failed to delete room");
              console.log(err);
            }
          },
        },
      ]
    );
  };



  useEffect(() => {
    if (!userData?.userid) return;

    fetchHome()
    fetchRooms()
    fetchDevices()
  }, [userData])

  return (
    <SafeAreaView className='bg-accent h-screen'>
      <FlatList
        data={loadingRooms ? [1, 2, 3] as unknown as Detailed_Room[] : roomsData}
        keyExtractor={(item, index) =>
          loadingRooms ? String(index) : String(item.db_id)
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16, paddingBottom: 62 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchRooms(true)}
          />
        }
        ListEmptyComponent={() => {
          return (
            <View className="flex-1 items-center justify-center py-16 px-6">

              <View className="w-[72px] h-[72px] rounded-full bg-[#EDEDED] items-center justify-center mb-5">
                <MaterialCommunityIcons name="home-outline" size={32} color="#A7A7A7" />
              </View>

              <AppText className="text-[17px] font-bold text-secondary-v1 mb-2 text-center">
                No rooms yet
              </AppText>
              <AppText className="text-sm text-[#A7A7A7] text-center mb-6 leading-5 max-w-[200px]">
                Add a room to start organising your smart devices by space.
              </AppText>

              <TouchableOpacity
                onPress={openAddRoomSheet}
                activeOpacity={0.8}
                className="flex-row items-center gap-2 bg-secondary-v1 px-6 py-3 rounded-2xl"
              >
                <AntDesign name="plus" size={14} color="#fff" />
                <AppText className="text-white text-sm font-bold">Add a room</AppText>
              </TouchableOpacity>

            </View>
          )
        }}
        ListHeaderComponent={
          <>
            {
              loadingHome ? (
                <View className="p-6 w-full rounded-[20px] bg-[#efefef] mb-6 h-48 overflow-hidden">
                </View>
              ) : (
                <View
                  style={{
                  }}
                  className="relative w-full rounded-3xl bg-white py-3 px-5 mb-6 border border-gray-100 overflow-hidden"
                >
                  {/* Header Row */}
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="bg-gray-100 px-3.5 py-1 rounded-3xl">
                      <AppText className="text-[#6B7280] text-xs font-semibold tracking-[1px] uppercase">
                        HOME
                      </AppText>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      className="w-9 h-9 bg-gray-100 rounded-2xl flex items-center justify-center"
                      onPress={() => openEditHomeDataSheet()}
                    >
                      <FontAwesome6 name="pen-to-square" size={18} color="#1F2937" />
                    </TouchableOpacity>
                  </View>

                  {/* Welcome Title */}
                  <AppText className="font-bold text-[24px] text-[#111827] leading-[32px] uppercase">
                    {homeData?.home_name || userData?.username || "Guest"} {homeData?.home_name == "" && "'s"}
                  </AppText>
                  {/* Location */}
                  {
                    homeData?.location &&
                    <AppText className="font-medium text-[12px] text-[#2c2c2c] mb-1">
                      {homeData?.location}
                    </AppText>
                  }

                  {/* Solar Status Section */}
                  {homeData?.has_solar ? (
                    <View className="mt-4 bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex-row items-center gap-4">
                      {/* Solar Icon */}
                      <View className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <FontAwesome6 name="solar-panel" size={24} color="#10B981" />
                      </View>

                      {/* Solar Content */}
                      <View className="flex-1">
                        <AppText className="text-emerald-700 text-base font-semibold">
                          Solar power system active
                        </AppText>
                        <View className="flex-row items-baseline gap-1 mt-1">
                          <AppText className="text-[#111827] text-3xl font-bold tabular-nums">
                            {homeData.solar_capacity_kw}
                          </AppText>
                          <AppText className="text-[#6B7280] text-lg font-semibold">kW</AppText>
                        </View>
                        <AppText className="text-[#6B7280] text-xs mt-px">
                          Total installed capacity
                        </AppText>
                      </View>
                    </View>
                  ) : (
                    <View className="mt-6 bg-gray-50 border border-gray-200 rounded-3xl p-5 flex-row items-center gap-4">
                      {/* No Solar Icon */}
                      <View className="w-10 h-10 bg-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <FontAwesome6 name="sun" size={24} color="#9CA3AF" />
                      </View>

                      <View className="flex-1">
                        <AppText className="text-gray-500 text-base font-medium">
                          No solar power installed
                        </AppText>
                        <AppText className="text-[#6B7280] text-xs mt-1">
                          Add solar panels to start saving
                        </AppText>
                      </View>
                    </View>
                  )}
                </View>
              )}

            <View className='flex flex-row justify-between items-center mb-6'>

              <AppText className="text-[#333] text-2xl font-bold">
                My Rooms
              </AppText>
              <TouchableOpacity activeOpacity={0.8} onPress={() => { openAddRoomSheet() }}>
                <View className='w-8 h-8 bg-secondary-v1 rounded-full overflow-hidden flex items-center justify-center'>
                  <DisplayIcon name={"plus"} color='#fff' />
                </View>
              </TouchableOpacity>
            </View>
          </>
        }


        renderItem={({ item, index }) => {
          if (loadingRooms) {
            return (
              <View className="rounded-xl overflow-hidden mb-2 h-64 bg-[#EDEDED]" key={index}>
                <View className="absolute inset-0 bg-[#EDEDED]" />
                {/* Bottom info bar skeleton */}
                <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4">
                  <View className="flex-row items-center gap-4">
                    {/* Icon circle skeleton */}
                    <View className="w-12 h-12 rounded-full bg-[#EDEDED]" />

                    <View className="gap-2">
                      {/* Room name skeleton */}
                      <View className="w-28 h-4 rounded-full bg-[#EDEDED]" />
                      {/* Devices count skeleton */}
                      <View className="w-16 h-3 rounded-full bg-[#EDEDED]" />
                    </View>
                  </View>
                </View>
              </View>
            );
          }
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              className={`rounded-xl overflow-hidden border border-gray-100 mb-2 h-64`}
              onPress={() => { router.push({ pathname: "/viewRoom", params: { room: encodeURIComponent(JSON.stringify(item)) } }) }}
            >
              <View className='relative rounded-lg'>
                <Image
                  source={
                    typeof item.image === "number"
                      ? item.image
                      : { uri: item.image }
                  }
                  style={{ width: '100%', height: '100%', }}
                />

                <View className='absolute w-full bottom-0 left-0 right-0 bg-white z-10 px-4 py-4'>
                  <View className="flex flex-row items-center gap-4">

                    <View>
                      <View className='w-12 h-12 bg-secondary-v2 rounded-full overflow-hidden flex items-center justify-center'>
                        <DisplayIcon name={item.icon} />
                      </View>
                    </View>
                    <View>
                      <AppText className={`text-xl font-bold text-[#333] `}>
                        {item.room_name}
                      </AppText>
                      <AppText className='text-sm font-semibold text-[#464646]'>{devices.length > 0 && devices.filter(d => d.room_id == item.db_id).length} Device{devices.length > 0 && devices.filter(d => d.room_id == item.db_id).length > 1 ? 's' : ''}</AppText>
                    </View>
                    <View className='ms-auto'>
                      <TouchableOpacity activeOpacity={0.7} onPress={() => handleDeleteRoom(item.db_id)} className='w-12 h-12 bg-secondary-v2 rounded-full overflow-hidden flex items-center justify-center'>
                        <DisplayIcon name={"trash-can-outline"} color='#ff1010' />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />

      <AddRoomBottomSheet
        ref={addRoomBottomSheetRef}
        snapPoints={snapPoints}
        onAddRoom={handleAddRoom}
      />

      <EditHomeDataBottomSheet
        homeName={homeData?.home_name || ""}
        hasSolar={homeData?.has_solar || false}
        location={homeData?.location || ""}
        solarCapacity={String(homeData?.solar_capacity_kw) || null}
        snapPoints={snapPointsEditHomeData}
        onUpdateHomeData={handleUpdateHomeData}
        ref={editHomeDataBottomSheetRef}
      />
    </SafeAreaView>
  )
}

export default rooms