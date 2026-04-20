import { DEVICE } from '@/types'
import React, { useState } from 'react'
import { TouchableOpacity, Vibration, View } from 'react-native'
import { Switch } from 'react-native-gesture-handler'
import DisplayIcon from './DisplayIcon'
import { AppText } from './app-text'

interface DeviceProps {
    device: DEVICE;
    toggleDeviceStatusOnOff: (id: number, is_on: boolean) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

const Device = ({ device, toggleDeviceStatusOnOff, onDelete }: DeviceProps) => {
    const [editMode, setEditMode] = useState(false);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={() => {
                Vibration.vibrate(100)
                setEditMode(!editMode)
            }}
            onPress={() => setEditMode(false)}
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0.3 },
                shadowOpacity: 0.05,
                shadowRadius: 0.3,
                elevation: 0.5
            }}

            className={`relative h-[180px] rounded-[20px] py-6 w-[48%] bg-[#EDEDED] ${editMode ? "border border-red-500" : "!border-0"}`} key={device.device_id}>

            {
                editMode &&
                <TouchableOpacity activeOpacity={0.7} onPress={() => onDelete?.(Number(device.device_id))} className='w-8 h-8 bg-red-500 border border-red-500 rounded-full overflow-hidden flex items-center justify-center absolute -top-2 -right-2' >
                    <DisplayIcon name={"trash-can-outline"} color='#fff' size={18}/>
                </TouchableOpacity>
            }

            <View className='px-6'>
                <View className='w-[45px] h-[45px] bg-[#DADADA] rounded-full mb-4 flex items-center justify-center'>
                    {
                        DisplayIcon({ name: device.icon })
                    }
                </View>
                <AppText className='text-[18px] font-bold text-secondary-v1 mb-1'>{device.name}</AppText>
                <AppText className='text-[13px] font-semibold text-[#A7A7A7]'>{device.default_wattage_w ?? 0} watts</AppText>
            </View>

            <View className='absolute bottom-2 left-0 right-0 w-full px-6 mx-auto flex flex-row items-center justify-between'>
                <AppText className='text-[17px] font-medium text-[#7D7D7D]'>{device.is_on}</AppText>
                <Switch
                    trackColor={{ false: '#D6D6D6', true: '#1c1c1c' }}
                    thumbColor={device.is_on ? '#F9F9F9' : '#fff'}
                    ios_backgroundColor="#fff"
                    onValueChange={() => { toggleDeviceStatusOnOff(device.device_id, device.is_on ? false : true) }}
                    value={device.is_on}
                />
            </View>
        </TouchableOpacity>
    )
}

export default Device