import { View, Text, TextInput, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import 'nativewind';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-12">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-green-500 rounded-full w-16 h-16 items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">T</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">Create Account</Text>
          <Text className="text-gray-500 text-center mt-2">
            Complete the form below to create your Travely account
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
          <TextInput
            className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
            placeholder="Enter your full name"
          />
          
          <Text className="text-gray-700 mb-2 font-medium">Email Address</Text>
          <TextInput
            className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          
          <Text className="text-gray-700 mb-2 font-medium">Password</Text>
          <TextInput
            className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
            placeholder="Create a password"
            secureTextEntry
          />
        </View>

        {/* Terms */}
        <View className="flex-row items-center mb-8">
          <View className="w-6 h-6 rounded-full border-2 border-green-500 items-center justify-center mr-3">
            <View className="w-3 h-3 rounded-full bg-green-500" />
          </View>
          <Text className="text-gray-600 flex-1">
            I agree to the <Text className="text-green-500 font-medium">Terms of Service</Text> and <Text className="text-green-500 font-medium">Privacy Policy</Text>
          </Text>
        </View>

        {/* Buttons */}
        <Pressable 
          className="bg-green-500 rounded-lg py-4 items-center mb-4"
          onPress={() => router.push('/auth/complete-profile')}
        >
          <Text className="text-white font-bold text-lg">Create Account</Text>
        </Pressable>
        
        <Pressable 
          className="items-center"
          onPress={() => router.push('/auth/login')}
        >
          <Text className="text-gray-600">Already have an account? <Text className="text-green-500 font-medium">Sign in</Text></Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
