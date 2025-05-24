import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import 'nativewind';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 py-12">
      {/* Header */}
      <View className="items-center mb-8">
        <View className="bg-green-500 rounded-full w-16 h-16 items-center justify-center mb-4">
          <Text className="text-white text-2xl font-bold">T</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800">Welcome Back</Text>
        <Text className="text-gray-500 text-center mt-2">
          Sign in to continue your journey
        </Text>
      </View>

      {/* Form */}
      <View className="mb-6">
        <Text className="text-gray-700 mb-2 font-medium">Email Address</Text>
        <TextInput
          className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        
        <Text className="text-gray-700 mb-2 font-medium">Password</Text>
        <TextInput
          className="bg-gray-100 rounded-lg p-4 mb-2 text-gray-800"
          placeholder="Enter your password"
          secureTextEntry
        />
        
        <Pressable 
          className="items-end mb-8"
          onPress={() => router.push('/auth/forgot-password')}
        >
          <Text className="text-green-500 font-medium">Forgot Password?</Text>
        </Pressable>
      </View>

      {/* Buttons */}
      <Pressable 
        className="bg-green-500 rounded-lg py-4 items-center mb-4"
        onPress={() => router.push('/(tabs)')}
      >
        <Text className="text-white font-bold text-lg">Sign In</Text>
      </Pressable>
      
      <Pressable 
        className="items-center"
        onPress={() => router.push('/auth/signup')}
      >
        <Text className="text-gray-600">Don't have an account? <Text className="text-green-500 font-medium">Sign up</Text></Text>
      </Pressable>
    </View>
  );
}
