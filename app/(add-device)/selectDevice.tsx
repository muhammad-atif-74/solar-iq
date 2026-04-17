import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import DisplayIcon from '@/components/ui/DisplayIcon'
import { DEVICE_CATALOG, DEVICE_CATEGORIES } from '@/constants/devices'
import { useGlobalContext } from '@/context/GlobalProvider'
import { addNewDevices } from '@/lib/supbase'
import { Device_Category, DEVICE_DB, Device_Template } from '@/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'


const selectDevice = () => {
    const { session, userData } = useGlobalContext();
    const router = useRouter()
    const { room_id } = useLocalSearchParams();

    const [activeTab, setActiveTab] = useState("all")
    const [devices, setDevices] = useState<Device_Template[] | []>([])
    const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([])
    const [addingDevices, setAddingDevices] = useState(false)


    // DB STRUCTURE FOR DEVICES: 
    // user_id, room_id, appliance_id, is_on is_custom, custom_name, wattage_override. 

    const handleContinue = async () => {
        if (!session || !userData) return
        const devices: Omit<DEVICE_DB, "id">[] = selectedDeviceIds.map(device_id => ({
            appliance_id: device_id,
            user_id: userData?.userid,
            room_id: Number(room_id),
            is_on: false,
            is_custom: false,
            category_id: null
        }))

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

    const handleSelectDevice = (id: string) => {
        setSelectedDeviceIds(prev => {
            if (prev.includes(id)) {
                // remove item
                return prev.filter(item => item !== id);
            } else {
                // add item
                return [...prev, id];
            }
        });
    };


    return (
        <SafeAreaView className='flex-1'>
            <View className='flex-1 px-4 justify-between'>
                <View style={{ paddingTop: 20, paddingBottom: 8 }}>
                    <AppText className='text-2xl font-bold text-center mb-4'>Select Devices</AppText>

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
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className={`rounded-lg px-[18px] py-3 mb-2  ${selectedDeviceIds.includes(item.id) ? 'bg-secondary-v1' : 'bg-[#F7F7F7]'
                                }`}
                            onPress={() => handleSelectDevice(item.id)}
                        >
                            <View className='flex-row items-center gap-3'>
                                <View className='w-12 h-12 p-2 bg-secondary-v2 rounded-lg flex items-center justify-center'>
                                    <DisplayIcon name={item.icon} />
                                </View>
                                <View>

                                    <AppText className={`text-base flex-1 my-0 ${selectedDeviceIds.includes(item.id) ? 'text-white' : 'text-[#636363]'
                                        }`}>
                                        {item.name}
                                    </AppText>

                                    <AppText className={`text-xs flex-1 my-0 ${selectedDeviceIds.includes(item.id) ? 'text-white' : 'text-[#636363]'
                                        }`}>
                                        {item.default_wattage_w} W
                                    </AppText>
                                </View>
                            </View>




                        </TouchableOpacity>
                    )}
                />

                <CustomButton
                    title={`Add (${selectedDeviceIds.length}) devices`}
                    onPress={handleContinue}
                    extraClasses=''
                    isDisable={addingDevices}
                    isLoading={addingDevices}
                />
            </View>
        </SafeAreaView>
    )
}

export default selectDevice