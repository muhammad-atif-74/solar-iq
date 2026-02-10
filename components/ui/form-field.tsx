import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FormFieldProps {
    title: string;
    handleChange: (text: string) => void;
    value: string;
    otherStyles?: any;
    keyboardType?: any;
    placeholder?: string;
    icon?: any;
    error?: string;
}

const FormField = ({ title, handleChange, value, otherStyles, keyboardType, placeholder, icon, error = "" }: FormFieldProps) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className='text-base text-secondary-v1 font-medium mb-1.5'>{title}</Text>
            <View className={`relative w-full h-16 px-4 bg-white rounded-full focus:border-secondary border border-[#ccc] flex-row items-center justify-between ${error && 'border-red-500'} `}>
                {
                    icon && <View className='absolute left-4 top-1/2 -translate-y-1/2'>
                        {icon}
                    </View>
                }
                <TextInput
                    className={`flex-1 pt-4 text-secondary-v1 font-semibold font-poppinsRegular text-base ${icon ? 'pl-10' : ''}`}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={"#7b7b8b"}
                    onChangeText={handleChange}
                    secureTextEntry={title === "Password" && !showPassword}
                    keyboardType={keyboardType}
                />
                {
                    title === "Password" &&
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute right-4"
                    >
                        {
                            !showPassword ?
                                <AntDesign name="eye" size={24} color="#7B7B8B" />
                                :
                                <AntDesign name="eye-invisible" size={24} color="#7B7B8B" />
                        }
                    </TouchableOpacity>
                }
            </View>
            {
                error ? <Text className='text-red-500 text-sm font-poppinsRegular mt-0.5'>{error}</Text> : null
            }
        </View>
    )
}

export default FormField