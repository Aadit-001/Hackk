import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import 'nativewind';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 py-12">
      {/* Header */}
      <View className="items-center mb-8">
        <View className="bg-green-500 rounded-full w-16 h-16 items-center justify-center mb-4">
          <Text className="text-white text-2xl font-bold">T</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800">Forgot Password</Text>
        <Text className="text-gray-500 text-center mt-2">
          Enter your email and we'll send you a link to reset your password
        </Text>
      </View>

      {/* Form */}
      <View className="mb-8">
        <Text className="text-gray-700 mb-2 font-medium">Email Address</Text>
        <TextInput
          className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      {/* Buttons */}
      <Pressable 
        className="bg-green-500 rounded-lg py-4 items-center mb-4"
        onPress={() => router.push('/auth/reset-password')}
      >
        <Text className="text-white font-bold text-lg">Send Reset Link</Text>
      </Pressable>
      
      <Pressable 
        className="items-center"
        onPress={() => router.push('/auth/login')}
      >
        <Text className="text-gray-600">Remember your password? <Text className="text-green-500 font-medium">Sign in</Text></Text>
      </Pressable>
    </View>
  );
}
