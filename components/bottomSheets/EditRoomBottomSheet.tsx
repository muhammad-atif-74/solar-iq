import BottomSheet from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect, useState } from 'react';
import CustomButton from '../ui/custom-button';
import FormField from '../ui/form-field';
import AppBottomSheet from './AppBottomSheet';

interface EditRoomBottomSheetProps {
    roomName: string;
    snapPoints: (string | number)[];
    onUpdateRoomData: (roomName: string) => Promise<void>;
}

const EditRoomBottomSheet = forwardRef<BottomSheet, EditRoomBottomSheetProps>(
    ({ snapPoints, onUpdateRoomData, roomName }, ref) => {

        const [room_name, setRoom_name] = useState(roomName)

        useEffect(() => {
            setRoom_name(roomName)
        }, [roomName])

        const handleUpdate = async () => {
            await onUpdateRoomData(room_name.trim());
        };

        return (
            <AppBottomSheet ref={ref} snapPoints={snapPoints} title='Edit Room Name'>

                <FormField
                    title='Room Name'
                    value={room_name}
                    handleChange={setRoom_name}
                    placeholder=''
                    otherStyles='mb-3'
                />

                <CustomButton
                    title='Update Room'
                    onPress={handleUpdate}
                    isDisable={!room_name.trim()}
                />
            </AppBottomSheet>
        );
    }
);

EditRoomBottomSheet.displayName = 'EditRoomBottomSheet';
export default EditRoomBottomSheet;
