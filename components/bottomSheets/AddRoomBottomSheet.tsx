import { defaultRooms } from '@/constants/rooms';
import BottomSheet from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import React, { forwardRef, useState } from 'react';
import { Text, View } from 'react-native';
import { AppText } from '../ui/app-text';
import CustomButton from '../ui/custom-button';
import FormField from '../ui/form-field';
import AppBottomSheet from './AppBottomSheet';

interface AddRoomBottomSheetProps {
  snapPoints: (string | number)[];
  onAddRoom: (categoryId: string, roomName: string) => Promise<void>; // ✅ clean interface
}

const AddRoomBottomSheet = forwardRef<BottomSheet, AddRoomBottomSheetProps>(
  ({ snapPoints, onAddRoom }, ref) => {

    // ✅ State lives here now, not in the parent
    const [newRoomName, setNewRoomName] = useState('');
    const [keepDefaultRoomName, setKeepDefaultRoomName] = useState(false);
    const [selectedRoomCategory, setSelectedRoomCategory] = useState(defaultRooms[0].id);

    const handleAdd = async () => {
      const roomName = keepDefaultRoomName
        ? defaultRooms.find((r) => r.id === selectedRoomCategory)?.name ?? ''
        : newRoomName;

      await onAddRoom(selectedRoomCategory, roomName);

      // ✅ Reset after submission
      setNewRoomName('');
      setSelectedRoomCategory(defaultRooms[0].id);
      setKeepDefaultRoomName(false);
    };

    return (
      <AppBottomSheet ref={ref} snapPoints={snapPoints} title='Add New Room'>
        <View className='mb-4'>
          <Text className='text-base text-secondary-v1 font-medium mb-1.5'>
            Select Room Category
          </Text>
          <View className='w-full h-16 bg-white rounded-full border border-[#ccc] overflow-hidden justify-center px-4'>
            <Picker
              selectedValue={selectedRoomCategory}
              onValueChange={setSelectedRoomCategory}
              style={{ height: '100%', width: '100%' }}
              dropdownIconColor='#1c1c1c'
            >
              {defaultRooms
                .filter((room) => room.id !== 'all')
                .map((room) => (
                  <Picker.Item key={room.id} label={room.name} value={room.id} />
                ))}
            </Picker>
          </View>
        </View>

        <FormField
          title='Enter Room Name'
          value={newRoomName}
          handleChange={setNewRoomName}
          placeholder='eg Dining Room'
          otherStyles='mb-3'
          editable={!keepDefaultRoomName}
        />

        <View className='flex flex-row items-center gap-4 mb-3'>
          <Checkbox
            value={keepDefaultRoomName}
            onValueChange={setKeepDefaultRoomName}
            color={keepDefaultRoomName ? '#1c1c1c' : undefined}
          />
          <AppText onPress={() => setKeepDefaultRoomName((v) => !v)}>
            Keep Default Name
          </AppText>
        </View>

        <CustomButton
          title='Add'
          onPress={handleAdd}
          isDisable={!selectedRoomCategory || (!keepDefaultRoomName && !newRoomName)}
        />
      </AppBottomSheet>
    );
  }
);

AddRoomBottomSheet.displayName = 'AddRoomBottomSheet';
export default AddRoomBottomSheet;