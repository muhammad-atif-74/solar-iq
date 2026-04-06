import { Room } from '@/types';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import React, { forwardRef } from 'react';
import { Text, View } from 'react-native';
import { AppText } from '../ui/app-text';
import CustomButton from '../ui/custom-button';
import FormField from '../ui/form-field';


interface AddRoomBottomSheetProps {
  snapPoints: (string | number)[];
  defaultRooms: Room[];
  selectedRoomCategory: string;
  setSelectedRoomCategory: (value: string) => void;
  newRoomName: string;
  setNewRoomName: (value: string) => void;
  keepDefaultRoomName: boolean;
  setKeepDefaultRoomName: (value: boolean) => void;
  addRoom: () => void;
}

const AddRoomBottomSheet = forwardRef<BottomSheet, AddRoomBottomSheetProps>(
  (
    {
      snapPoints,
      defaultRooms,
      selectedRoomCategory,
      setSelectedRoomCategory,
      newRoomName,
      setNewRoomName,
      keepDefaultRoomName,
      setKeepDefaultRoomName,
      addRoom,
    },
    ref
  ) => {
    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetView style={{ padding: 20 }}>
          <AppText className='text-2xl font-bold text-center mb-4'>
            Add New Room
          </AppText>

          <View className='mb-4'>
            <Text className='text-base text-secondary-v1 font-medium mb-1.5'>
              Select Room Category
            </Text>
            <View className='w-full h-16 bg-white rounded-full border border-[#ccc] overflow-hidden justify-center px-4'>
              <Picker
                selectedValue={selectedRoomCategory}
                onValueChange={(itemValue) => setSelectedRoomCategory(itemValue)}
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
            handleChange={(t) => setNewRoomName(t)}
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
            <AppText
              className='mb-0'
              onPress={() => setKeepDefaultRoomName(!keepDefaultRoomName)}
            >
              Keep Default Name
            </AppText>
          </View>

          <CustomButton
            title='Add'
            onPress={addRoom}
            extraClasses=''
            isDisable={
              !selectedRoomCategory ||
              (!keepDefaultRoomName && newRoomName === '')
            }
          />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

AddRoomBottomSheet.displayName = 'AddRoomBottomSheet';

export default AddRoomBottomSheet;