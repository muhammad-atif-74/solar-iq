import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

const CustomButton = ({ onPress, title = 'Click Me', isLoading = false, extraClasses, textClasses }: { onPress: any, title: string, isLoading?: boolean , extraClasses?: any, textClasses?: any}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.95}
            className={`flex flex-row gap-2 justify-center bg-secondary-v1 px-8 py-4 rounded-xl shadow-lg shadow-secondary-v1/50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${extraClasses}`}
            disabled={isLoading}
        >
            {
                isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : null
            }
            <Text className={`text-white text-center font-semibold text-base font-poppinsRegular ${textClasses}`}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default CustomButton;