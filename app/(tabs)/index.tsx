import { Text, View } from 'react-native';


export default function HomeScreen() {
  return (
    <View className='flex-1 items-center mt-10 bg-accent'>
      <View className='w-[90%] p-6 rounded-xl bg-secondary-v1 '>

      <Text className='text-4xl text-white font-poppinsRegular font-extrabold'>Wellcome to SOLARIQ</Text>
      </View>
    </View>
  );
}