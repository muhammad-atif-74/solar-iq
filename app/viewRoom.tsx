import { AppText } from '@/components/ui/app-text'
import DisplayIcon from '@/components/ui/DisplayIcon'
import { useFetchDevices } from '@/hooks/useFetchDevices'
import { toggleDeviceStatus } from '@/lib/supbase'
import { DEVICE } from '@/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native'
import { Switch } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

const viewRoom = () => {

    const { room } = useLocalSearchParams(); // it returns string or string[]
    const { fetchDevices, devices: fetchedDevices } = useFetchDevices()

    const [devices, setDevices] = useState<DEVICE[] | []>([])


    const roomValue = Array.isArray(room) ? room[0] : room; // if its array; returns its first element otherwise return as a whole.

    const roomData = useMemo(() => {
        return roomValue
            ? JSON.parse(decodeURIComponent(roomValue))
            : null;
    }, [roomValue]);


    useEffect(() => {
        if (!roomData?.room_id) return;

        fetchDevices(roomData.db_id);
    }, [roomData?.room_id]);


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

    console.log("ROOMDATA: ____: ", roomData)
    return (
        <SafeAreaView className="bg-accent h-screen">
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
                <View className='flex flex-row items-center justify-between mb-6'>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} className='w-10 h-10 rounded-full overflow-hidden bg-secondary-v1 p-1 flex items-center justify-center'>
                        <MaterialCommunityIcons name='arrow-left' size={24} color={"#fff"} />
                    </TouchableOpacity>
                    <View>
                        <AppText className='text-3xl font-bold my-0 text-secondary-v1'>{roomData.room_name}</AppText>
                    </View>
                    <View className='w-10'></View>
                </View>

                <View className='w-full rounded-xl overflow-hidden h-48 mb-6'>
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
                        Devices
                    </AppText>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => { router.push(`/(add-device)/selectDevice?room_id=${roomData.db_id}`) }}>
                        <View className='w-8 h-8 bg-secondary-v1 rounded-full overflow-hidden flex items-center justify-center'>
                            <DisplayIcon name={"plus"} color='#fff' />
                        </View>
                    </TouchableOpacity>
                </View>

                <View className='flex flex-row flex-wrap items-stretch gap-2 w-full mb-6'>

                    {
                        devices.length > 0 ?
                            devices.map(item => {
                                return (
                                    <View
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 0.3 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 0.3,
                                            elevation: 0.5
                                        }}

                                        className='relative h-[180px] rounded-[20px] py-6 w-[48%] bg-[#EDEDED]' key={item.device_id}>
                                        <View className='px-6'>
                                            <View className='w-[45px] h-[45px] bg-[#DADADA] rounded-full mb-4 flex items-center justify-center'>
                                                {
                                                    DisplayIcon({ name: item.icon })
                                                }
                                            </View>
                                            <AppText className='text-[18px] font-bold text-secondary-v1 mb-1'>{item.name}</AppText>
                                            <AppText className='text-[13px] font-semibold text-[#A7A7A7]'>{item.default_wattage_w ?? 0} watts</AppText>
                                        </View>

                                        <View className='absolute bottom-2 left-0 right-0 w-full px-6 mx-auto flex flex-row items-center justify-between'>
                                            <AppText className='text-[17px] font-medium text-[#7D7D7D]'>{item.is_on}</AppText>
                                            <Switch
                                                trackColor={{ false: '#D6D6D6', true: '#1c1c1c' }}
                                                thumbColor={item.is_on ? '#F9F9F9' : '#fff'}
                                                ios_backgroundColor="#fff"
                                                onValueChange={() => { toggleDeviceStatusOnOff(item.device_id, item.is_on ? false : true) }}
                                                value={item.is_on}
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
        </SafeAreaView>
    )
}

export default viewRoom