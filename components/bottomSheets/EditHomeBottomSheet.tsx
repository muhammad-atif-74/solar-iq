import BottomSheet from '@gorhom/bottom-sheet';
import Checkbox from 'expo-checkbox';
import React, { forwardRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import { AppText } from '../ui/app-text';
import CustomButton from '../ui/custom-button';
import FormField from '../ui/form-field';
import AppBottomSheet from './AppBottomSheet';

interface EditHomeDataBottomSheetProps {
    homeName: string;
    hasSolar: boolean;
    solarCapacity: string | null;
    location: string | null;
    snapPoints: (string | number)[];
    onUpdateHomeData: (homeName: string, hasSolar: boolean, solarCapacity: string | null, location: string | null) => Promise<void>;
}

const EditHomeDataBottomSheet = forwardRef<BottomSheet, EditHomeDataBottomSheetProps>(
    ({ snapPoints, onUpdateHomeData, homeName, hasSolar, solarCapacity, location }, ref) => {

        const [home_name, setHome_name] = useState(homeName)
        const [has_solar, setHas_solar] = useState(hasSolar)
        const [solar_cap, setSolar_cap] = useState(solarCapacity)
        const [home_location, setHome_location] = useState(location)

        useEffect(() => {
            setHome_name(homeName)
            setHas_solar(hasSolar)
            setSolar_cap(solarCapacity)
            setHome_location(location)
        }, [homeName, hasSolar, solarCapacity, location])

        const handleUpdate = async () => {
            await onUpdateHomeData(home_name, has_solar, solar_cap, home_location); 
        };

        return (
            <AppBottomSheet ref={ref} snapPoints={snapPoints} title='Edit Your Home'>

                <FormField
                    title='Home Name'
                    value={home_name}
                    handleChange={setHome_name}
                    placeholder=''
                    otherStyles='mb-3'
                />

                <FormField
                    title='Home Location'
                    value={home_location ?? ""}
                    handleChange={setHome_location}
                    placeholder='eg. Street 1, Washington, USA'
                    otherStyles='mb-3'
                />

                <View className='flex flex-row items-center gap-4 mb-3'>
                    <Checkbox
                        value={has_solar}
                        onValueChange={setHas_solar}
                        color={has_solar ? '#1c1c1c' : undefined}
                    />
                    <AppText onPress={() => setHas_solar((v) => !v)}>
                        Solar Installed
                    </AppText>
                </View>

                {
                    has_solar &&
                    <FormField
                        title='Solar Capacity (KW)'
                        value={solar_cap ?? ""}
                        handleChange={setSolar_cap}
                        placeholder=''
                        otherStyles='mb-3'
                        keyboardType={"numeric"}
                    />
                }

                <CustomButton
                    title='Update Data'
                    onPress={handleUpdate}
                    isDisable={!home_name}
                />
            </AppBottomSheet>
        );
    }
);

EditHomeDataBottomSheet.displayName = 'EditHomeBottomSheet';
export default EditHomeDataBottomSheet;