import { AppText } from '@/components/ui/app-text'
import CustomButton from '@/components/ui/custom-button'
import { DEVICE_CATALOG, DEVICE_CATEGORIES } from '@/constants/devices'
import { Device_Category, Device_Template } from '@/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'


const DisplayIcon = ({ name }: { name: string }) => {
    return (
        <MaterialCommunityIcons
            name={name as any}
            size={24}
            color="#333"
        />
    );
};

const selectDevice = () => {
    const {room_id} = useLocalSearchParams();

    const [activeTab, setActiveTab] = useState("all")
    const [devices, setDevices] = useState<Device_Template[] | []>([])
    const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([])


    const handleContinue = () => {
        console.log("ROOMID: ", room_id)
        console.log("DEVICES: ",selectedDeviceIds)

        
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
                            className={`flex-row items-center rounded-lg px-[18px] py-3 mb-2 gap-3 ${selectedDeviceIds.includes(item.id) ? 'bg-secondary-v1' : 'bg-[#F7F7F7]'
                                }`}
                            onPress={() => handleSelectDevice(item.id)}
                        >
                            <View className='w-12 h-12 p-2 bg-secondary-v2 rounded-lg flex items-center justify-center'>
                                <DisplayIcon name={item.icon} />
                            </View>
                            <AppText className={`text-sm flex-1 ${selectedDeviceIds.includes(item.id) ? 'text-white' : 'text-[#636363]'
                                }`}>
                                {item.name}
                            </AppText>
                        </TouchableOpacity>
                    )}
                />

                <CustomButton
                    title={`Add (${selectedDeviceIds.length}) devices`}
                    onPress={handleContinue}
                    extraClasses=''
                    isDisable={false}
                />
            </View>
        </SafeAreaView>
    )
}

export default selectDevice