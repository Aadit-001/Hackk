import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import 'nativewind';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-green-500 items-center justify-between py-12 px-6">
      {/* Logo and Hero Image */}
      <View className="items-center">
        <Text className="text-white text-3xl font-bold mb-2">Travely</Text>
        <Text className="text-white text-sm mb-8">Your journey begins here</Text>
        <View className="w-64 h-64 items-center justify-center">
          <Ionicons name="airplane" size={120} color="white" />
        </View>
      </View>

      {/* Bottom Section */}
      <View className="w-full">
        <Text className="text-white text-xl font-semibold mb-6 text-center">
          Take control of your travel plans with ease
        </Text>
        
        <Pressable 
          className="bg-white rounded-full py-4 items-center mb-4"
          onPress={() => router.push('/auth/signup')}
        >
          <Text className="text-green-500 font-bold text-lg">Get Started</Text>
        </Pressable>
        
        <Pressable 
          className="items-center"
          onPress={() => router.push('/auth/login')}
        >
          <Text className="text-white font-semibold">Already have an account? Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}
