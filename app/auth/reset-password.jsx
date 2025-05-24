import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import 'nativewind';

export default function ResetPasswordScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 py-12">
      {/* Header */}
      <View className="items-center mb-8">
        <View className="bg-green-500 rounded-full w-16 h-16 items-center justify-center mb-4">
          <Text className="text-white text-2xl font-bold">T</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800">Reset Password</Text>
        <Text className="text-gray-500 text-center mt-2">
          Create a new password for your account
        </Text>
      </View>

      {/* Form */}
      <View className="mb-8">
        <Text className="text-gray-700 mb-2 font-medium">New Password</Text>
        <TextInput
          className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
          placeholder="Enter new password"
          secureTextEntry
        />
        
        <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
        <TextInput
          className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
          placeholder="Confirm new password"
          secureTextEntry
        />
      </View>

      {/* Password Strength Indicator */}
      <View className="mb-8">
        <Text className="text-gray-700 mb-2 font-medium">Password Strength</Text>
        <View className="flex-row mb-2">
          <View className="flex-1 h-2 bg-green-500 rounded-full mr-1" />
          <View className="flex-1 h-2 bg-green-500 rounded-full mr-1" />
          <View className="flex-1 h-2 bg-green-500 rounded-full mr-1" />
          <View className="flex-1 h-2 bg-gray-300 rounded-full" />
        </View>
        <Text className="text-gray-500 text-sm">Strong - Use at least 8 characters with letters, numbers and symbols</Text>
      </View>

      {/* Buttons */}
      <Pressable 
        className="bg-green-500 rounded-lg py-4 items-center mb-4"
        onPress={() => router.push('/auth/login')}
      >
        <Text className="text-white font-bold text-lg">Reset Password</Text>
      </Pressable>
    </View>
  );
}
