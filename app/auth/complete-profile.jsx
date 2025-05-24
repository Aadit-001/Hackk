import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import 'nativewind';

export default function CompleteProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-12">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-4">
            <Ionicons name="person-add" size={48} color="#9ca3af" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">Complete your account</Text>
          <Text className="text-gray-500 text-center mt-2">
            Add a few more details to personalize your experience
          </Text>
        </View>

        {/* Form */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Phone Number</Text>
          <TextInput
            className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          
          <Text className="text-gray-700 mb-2 font-medium">Date of Birth</Text>
          <TextInput
            className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
            placeholder="DD/MM/YYYY"
          />
          
          <Text className="text-gray-700 mb-2 font-medium">Home Location</Text>
          <TextInput
            className="bg-gray-100 rounded-lg p-4 mb-4 text-gray-800"
            placeholder="City, Country"
          />
        </View>

        {/* Interests Section */}
        <View className="mb-8">
          <Text className="text-gray-700 mb-4 font-medium">Travel Interests</Text>
          <View className="flex-row flex-wrap">
            {['Beach', 'Mountains', 'City', 'Cultural', 'Adventure', 'Food'].map((interest, index) => (
              <Pressable 
                key={index}
                className="bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
              >
                <Text className="text-gray-800">{interest}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Buttons */}
        <Pressable 
          className="bg-green-500 rounded-lg py-4 items-center mb-4"
          onPress={() => router.push('/(tabs)')}
        >
          <Text className="text-white font-bold text-lg">Complete Setup</Text>
        </Pressable>
        
        <Pressable 
          className="items-center"
          onPress={() => router.push('/(tabs)')}
        >
          <Text className="text-gray-500">Skip for now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
