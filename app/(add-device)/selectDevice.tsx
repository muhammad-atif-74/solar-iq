import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import DisplayIcon from '@/components/ui/DisplayIcon'
import { DEVICE_CATALOG, DEVICE_CATEGORIES } from '@/constants/devices'
import { useGlobalContext } from '@/context/GlobalProvider'
import { addNewDevices } from '@/lib/supbase'
import { Device_Category, DEVICE_DB, Device_Template } from '@/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

const DeviceList = ({ item, deviceQty, increment, decrement }:
    {
        item: Device_Template,
        deviceQty: Record<string, number>,
        increment: (id: string) => void,
        decrement: (id: string) => void
    }) => {

    const qty = deviceQty[item.id] || 0
    const isSelected = qty > 0


    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className={`rounded-lg px-[18px] py-3 mb-2  ${qty > 0 ? 'bg-secondary-v1' : 'bg-[#F7F7F7]'
                }`}
            onPress={() => { if (!isSelected) increment(item.id) }}
        >
            <View className='flex-row items-center gap-3'>
                <View className='w-12 h-12 p-2 bg-secondary-v2 rounded-lg flex items-center justify-center'>
                    <DisplayIcon name={item.icon} />
                </View>
                <View>

                    <AppText className={`text-base flex-1 my-0 ${qty > 0 ? 'text-white' : 'text-[#636363]'}`}>
                        {item.name}
                    </AppText>

                    <AppText className={`text-xs flex-1 my-0 ${qty > 0 ? 'text-white' : 'text-[#636363]'}`}>
                        {item.default_wattage_w} W
                    </AppText>
                </View>
                <View className='text-end ms-auto'>
                    {
                        isSelected &&
                        <View className='flex-row items-center mt-3 justify-end'>
                            {/* − button */}
                            <TouchableOpacity
                                onPress={(e) => { e.stopPropagation(); decrement(item.id) }}
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
                                onPress={(e) => { e.stopPropagation(); increment(item.id) }}

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
                    }



                </View>
            </View>

        </TouchableOpacity>
    )
}


const selectDevice = () => {
    const { session, userData } = useGlobalContext();
    const router = useRouter()
    const { room_id } = useLocalSearchParams();

    const [activeTab, setActiveTab] = useState("all")
    const [devices, setDevices] = useState<Device_Template[] | []>([])
    const [deviceQty, setDeviceQty] = useState<Record<string, number>>({})
    const [addingDevices, setAddingDevices] = useState(false)


    // DB STRUCTURE FOR DEVICES: 
    // user_id, room_id, appliance_id, is_on is_custom, custom_name, wattage_override. 

    const handleContinue = async () => {
        const selectedIds = Object.keys(deviceQty)
        if (selectedIds.length === 0) return
        if (!session || !userData) return

        const devices: Omit<DEVICE_DB, "id">[] = selectedIds.flatMap(device_id =>
            Array.from({ length: deviceQty[device_id] }, () => ({
                appliance_id: device_id,
                user_id: userData.userid,
                room_id: Number(room_id),
                is_on: false,
                is_custom: false,
                category_id: null
            }))
        )

        try {
            setAddingDevices(true)
            await addNewDevices(devices)
            // router.replace(`/home?room_id=${room_id}`)
            router.back()
        }
        catch (err) {
            console.log(err)
            Alert.alert("Error", "Something went wrong while adding new devices.")

        }
        finally {
            setAddingDevices(false)
        }
    }

    useEffect(() => {
        if (activeTab === "all") {
            setDevices(DEVICE_CATALOG)
        }
        else {
            setDevices(DEVICE_CATALOG.filter(device => device.category_id === activeTab))
        }

    }, [activeTab, DEVICE_CATALOG])


    const increment = (id: string) => setDeviceQty(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    const decrement = (id: string) => setDeviceQty(prev => {
        const current = prev[id] || 0
        if (current <= 1) {
            // remove from selection entirely
            const next = { ...prev }
            delete next[id]
            return next
        }
        return { ...prev, [id]: current - 1 }
    })


    return (
        <SafeAreaView className='flex-1'>
            <View className='flex-1 px-4 justify-between'>
                <View style={{ paddingTop: 20, paddingBottom: 8 }}>
                    {/* <AppText className='text-2xl font-bold text-center mb-4'>Select Devices</AppText> */}
                    <View className='flex flex-row items-center justify-between mb-6'>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()} className='w-10 h-10 rounded-full overflow-hidden bg-secondary-v1 p-1 flex items-center justify-center'>
                            <MaterialCommunityIcons name='arrow-left' size={24} color={"#fff"} />
                        </TouchableOpacity>
                        <View>
                            <AppText className='text-3xl font-bold my-0 text-secondary-v1'>Select Devices</AppText>
                        </View>
                        <View className='w-10'>

                        </View>
                    </View>

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={[
                            { id: "all", name: "All" } as Device_Category,
                            ...DEVICE_CATEGORIES
                        ]}
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={{ gap: 8 }}
                        style={{ flexGrow: 0, marginBottom: 16 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => setActiveTab(item.id)}
                                activeOpacity={0.7}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 10,
                                    borderRadius: 12,
                                    flexShrink: 0,
                                    backgroundColor: activeTab === item.id ? '#000' : '#f7f7f7',
                                }}
                            >
                                <AppText className={`font-semibold ${activeTab === item.id ? 'text-white' : 'text-black'}`}>
                                    {item.name}
                                </AppText>
                            </TouchableOpacity>
                        )}
                    />
                </View>


                <AppText className='text-base text-[#5e5e5e] font-semibold mb-4'>Devices</AppText>
                <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    style={{ maxHeight: '72%' }}
                    renderItem={({ item }) => (
                        <DeviceList item={item} deviceQty={deviceQty} increment={increment} decrement={decrement} />
                    )}
                />

                <CustomButton
                    title={`Add devices`}
                    extraClasses=''
                    onPress={handleContinue}
                    isDisable={addingDevices || Object.keys(deviceQty).length === 0}
                    isLoading={addingDevices}
                />
            </View>
        </SafeAreaView>
    )
}

export default selectDevice