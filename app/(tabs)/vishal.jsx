// app/(tabs)/index.jsx
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

// Import NativeWind styles
import 'nativewind';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-12">
      {/* Greeting */}
      <Text className="text-xl font-semibold text-gray-800 mb-2">
        Hi Cheems, where do you want to go?
      </Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search destination"
        placeholderTextColor="#888"
        className="bg-gray-100 px-4 py-3 rounded-xl mb-5 text-gray-900"
      />

      {/* Quick Actions */}
      <View className="flex-row justify-between mb-6">
        <Pressable className="bg-indigo-600 px-4 py-3 rounded-xl w-[30%]">
          <Text className="text-white text-center font-medium">Plan Trip</Text>
        </Pressable>
        <Pressable className="bg-blue-600 px-4 py-3 rounded-xl w-[30%]">
          <Text className="text-white text-center font-medium">AR View</Text>
        </Pressable>
        <Pressable className="bg-green-600 px-4 py-3 rounded-xl w-[30%]">
          <Text className="text-white text-center font-medium">Nearby</Text>
        </Pressable>
      </View>

      {/* Map Preview Placeholder */}
      <View className="bg-gray-200 rounded-2xl h-40 mb-6 justify-center items-center">
        <Text className="text-gray-500">[ Map Preview Here ]</Text>
      </View>

      {/* Upcoming Trips */}
      <Text className="text-lg font-semibold text-gray-800 mb-2">Upcoming Trips</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {["Goa Getaway", "Manali Escape", "Rajasthan Ride"].map((trip, i) => (
          <View
            key={i}
            className="bg-white shadow-md rounded-xl p-4 mr-4 w-56 h-28 justify-between"
          >
            <Text className="text-lg font-semibold text-gray-800">{trip}</Text>
            <Text className="text-gray-500">24 May - 26 May</Text>
          </View>
        ))}
      </ScrollView>

      {/* AR Promo Banner */}
      <View className="bg-yellow-100 mt-6 p-4 rounded-2xl flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-yellow-900 mb-1">Try AR Navigation!</Text>
          <Text className="text-sm text-yellow-800">Point your camera & explore!</Text>
        </View>
        <Pressable className="bg-yellow-600 px-3 py-2 rounded-lg">
          <Text className="text-white font-semibold">Launch</Text>
        </Pressable>
      </View>
    </View>
  );
}