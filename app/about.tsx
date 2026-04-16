import { AppText } from '@/components/ui/app-text'
import { IMAGES } from '@/constants/theme'
import { Image } from 'expo-image'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const about = () => {
    return (
        <SafeAreaView className="bg-accent h-screen">
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>

                {/* App icon + name */}
                <View className="items-center mb-8 mt-4">
                    <View className='w-28 h-28 p-3 bg-secondary-v1 flex items-center justify-center rounded-lg'>

                        <Image
                            source={IMAGES.solarIQLogo}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="contain"
                            className="mx-auto mt-10 mb-4"
                        />
                    </View>
                    <AppText className="text-2xl font-bold text-[#111827] mt-2">SolarIQ</AppText>

                    <AppText className="text-sm text-[#9CA3AF] mt-1">Version 1.0.0</AppText>
                </View>
                {/* Description */}
                <View className="bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-4">
                    <AppText className="text-sm text-[#374151]">
                        SolarIQ helps you monitor and manage your home's energy usage in real time.
                        Track devices room by room, stay within your solar capacity, and make smarter
                        decisions about your energy consumption.
                    </AppText>
                </View>

                {/* Info rows */}
                <View className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
                    {[
                        { label: 'Developer', value: 'Muhammad Atif' },
                        { label: 'Version', value: '1.0.0' },
                        { label: 'Platform', value: 'iOS & Android' },
                        // { label: 'Built with', value: 'React Native + Expo' },
                    ].map((row, i, arr) => (
                        <View
                            key={row.label}
                            className={`flex-row justify-between items-center px-5 py-3.5 ${i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <AppText className="text-sm text-[#9CA3AF]">{row.label}</AppText>
                            <AppText className="text-sm font-medium text-[#111827]">{row.value}</AppText>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <AppText className="text-xs text-[#9CA3AF] text-center mt-4">
                    © {new Date().getFullYear()} SolarIQ. All rights reserved.
                </AppText>

            </ScrollView>
        </SafeAreaView>
    )
}

export default about