import { AppText } from '@/components/ui/app-text'
import Device from '@/components/ui/Device'
import DisplayIcon from '@/components/ui/DisplayIcon'
import { useGlobalContext } from '@/context/GlobalProvider'
import { useFetchDevices } from '@/hooks/useFetchDevices'
import { deleteDevice, deleteRoom, toggleDeviceStatus } from '@/lib/supbase'
import { DEVICE } from '@/types'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const viewRoom = () => {
    const {userData} = useGlobalContext();
    const { room } = useLocalSearchParams(); // it returns string or string[]
    const { fetchDevices, devices: fetchedDevices, loading: devicesLoading } = useFetchDevices()

    const [devices, setDevices] = useState<DEVICE[] | []>([])


    const roomValue = Array.isArray(room) ? room[0] : room; // if its array; returns its first element otherwise return as a whole.

    const roomData = useMemo(() => {
        return roomValue
            ? JSON.parse(decodeURIComponent(roomValue))
            : null;
    }, [roomValue]);


    useFocusEffect(
        useCallback(() => {
            if (roomData?.db_id) {
                fetchDevices(roomData.db_id, userData.userid);
            }
        }, [roomData?.db_id])
    );

    useEffect(() => {
        setDevices(fetchedDevices.length > 0 ? fetchedDevices : [])
    }, [fetchedDevices])


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
                            router.back()

                        } catch (err) {
                            Alert.alert("Error", "Failed to delete room");
                            console.log(err);
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteDevice = async (id: number) => {
        Alert.alert(
            "Delete Device",
            "Are you sure you want to delete this device?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDevice(id);
                            fetchDevices("all", userData.userid)

                        } catch (err) {
                            Alert.alert("Error", "Failed to delete device");
                            console.log(err);
                        }
                    },
                },
            ]
        );
    };
    return (
        <SafeAreaView className="bg-accent h-screen">
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }} refreshControl={
                <RefreshControl refreshing={devicesLoading} onRefresh={fetchDevices} />
            }>
                <View className='flex flex-row items-center justify-between mb-6'>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} className='w-10 h-10 rounded-full overflow-hidden bg-secondary-v1 p-1 flex items-center justify-center'>
                        <MaterialCommunityIcons name='arrow-left' size={24} color={"#fff"} />
                    </TouchableOpacity>
                    <View>
                        <AppText className='text-3xl font-bold my-0 text-secondary-v1'>{roomData.room_name}</AppText>
                    </View>
                    <View className='w-10'>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => handleDeleteRoom(roomData.db_id)} className='w-12 h-12 bg-secondary-v2 rounded-full overflow-hidden flex items-center justify-center'>
                            <DisplayIcon name={"trash-can-outline"} color='#ff1010' />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='w-full rounded-xl overflow-hidden h-48 mb-6 bg-gray-100'>
                    <Image
                        source={
                            typeof roomData.image === "number"
                                ? roomData.image
                                : { uri: roomData.image }
                        }
                        style={{ width: '100%', height: '100%', }}
                        contentFit='cover'
                    />
                </View>

                <View className='flex flex-row justify-between items-center mb-6'>
                    <AppText className="text-secondary-v1 text-2xl font-bold">
                        Devices ({devices.length})
                    </AppText>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => { router.push(`/(add-device)/selectDevice?room_id=${roomData.db_id}`) }}>
                        <View className='w-8 h-8 bg-secondary-v1 rounded-full overflow-hidden flex items-center justify-center'>
                            <DisplayIcon name={"plus"} color='#fff' />
                        </View>
                    </TouchableOpacity>
                </View>

                {
                    devicesLoading &&
                    <View className='flex-row flex-wrap items-stretch gap-2 w-full mt-4 mb-16'>
                        {
                            [1, 2, 3, 4].map((i) => {
                                return (
                                    <View className='relative h-[220px] rounded-[20px] py-6 w-[48%] bg-[#EDEDED] animate-pulse' key={i}>
                                    </View>
                                )
                            })
                        }
                    </View>
                }

                <View className='flex flex-row flex-wrap items-stretch gap-2 w-full mb-6'>

                    {
                        !devicesLoading && devices.length > 0 ?
                            devices.map(item => {
                                return (
                                    <Device device={item} toggleDeviceStatusOnOff={toggleDeviceStatusOnOff} onDelete={(id) => handleDeleteDevice(id)} key={item.id} />
                                )
                            }) : (
                                <View className="flex-1 items-center justify-center py-16 px-6">
                                    <View className="w-[72px] h-[72px] rounded-full bg-[#EDEDED] items-center justify-center mb-5">
                                        <AntDesign name="bulb" size={32} color="#A7A7A7" />
                                    </View>

                                    <AppText className="text-[17px] font-bold text-secondary-v1 mb-2 text-center">
                                        No devices yet
                                    </AppText>
                                    <AppText className="text-sm text-[#A7A7A7] text-center mb-6 leading-5 max-w-[200px]">
                                        Add a device to start managing this room.
                                    </AppText>

                                    <TouchableOpacity
                                        onPress={() => { { router.push(`/(add-device)/selectDevice?room_id=${roomData.db_id}`) } }}
                                        activeOpacity={0.8}
                                        className="flex-row items-center gap-2 bg-secondary-v1 px-6 py-3 rounded-2xl"
                                    >
                                        <AntDesign name="plus" size={14} color="#fff" />
                                        <AppText className="text-white text-sm font-bold">Add a device</AppText>
                                    </TouchableOpacity>

                                </View>
                            )
                    }
                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default viewRoom