import { Text, View, Image, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'nativewind';

export default function ARScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* AR Camera View (Simulated) */}
      <View className="relative flex-1 bg-gray-800">
        {/* Simulated AR background with gradient */}
        <View className="absolute w-full h-full opacity-30">
          <View className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-500 opacity-20" />
          <View className="absolute top-60 right-10 w-60 h-60 rounded-full bg-green-500 opacity-20" />
          <View className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-yellow-500 opacity-20" />
        </View>
        
        {/* Top Controls */}
        <View className="flex-row justify-between items-center p-4 pt-12">
          <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-black/30">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <View className="bg-black/30 rounded-full px-4 py-2">
            <Text className="text-white font-medium">AR Navigation</Text>
          </View>
          <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-black/30">
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </Pressable>
        </View>
        
        {/* AR Indicators (Simulated) */}
        <View className="absolute top-1/3 left-1/4">
          <View className="bg-blue-500/80 rounded-lg p-2 items-center">
            <Text className="text-white font-bold">Taj Mahal</Text>
            <Text className="text-white text-xs">350m ahead</Text>
          </View>
          <View className="w-2 h-10 bg-blue-500/80 ml-6" />
        </View>
        
        <View className="absolute top-1/4 right-1/4">
          <View className="bg-green-500/80 rounded-lg p-2 items-center">
            <Text className="text-white font-bold">Restaurant</Text>
            <Text className="text-white text-xs">120m right</Text>
          </View>
          <View className="w-2 h-10 bg-green-500/80 ml-6" />
        </View>
        
        {/* Bottom Controls */}
        <View className="absolute bottom-8 left-0 right-0 px-4">
          <View className="bg-black/40 rounded-xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-bold text-lg">Navigation Active</Text>
              <Pressable className="bg-red-500 rounded-full px-3 py-1">
                <Text className="text-white font-medium">End</Text>
              </Pressable>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                <Ionicons name="location" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-medium">Taj Mahal</Text>
                <Text className="text-white/70 text-sm">350m ahead - 5 min walk</Text>
              </View>
              <Pressable className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                <Ionicons name="information-circle-outline" size={22} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}