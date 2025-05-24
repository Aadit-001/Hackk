import { Text, View, Image, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'nativewind';

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-4 pt-12 pb-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">Profile</Text>
          <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-gray-100">
            <Ionicons name="settings-outline" size={22} color="#4b5563" />
          </Pressable>
        </View>
        
        {/* Profile Info */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-3">
            <Ionicons name="person" size={48} color="#9ca3af" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-1">Cheems Doggo</Text>
          <Text className="text-gray-500">cheems@example.com</Text>
        </View>
        
        {/* Stats */}
        <View className="flex-row justify-between bg-gray-50 rounded-xl p-4 mb-6">
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-800">12</Text>
            <Text className="text-gray-500">Trips</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-800">4</Text>
            <Text className="text-gray-500">Countries</Text>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-800">28</Text>
            <Text className="text-gray-500">Photos</Text>
          </View>
        </View>
        
        {/* Menu Items */}
        <View className="mb-6">
          <MenuListItem icon="person-outline" title="Personal Information" />
          <MenuListItem icon="card-outline" title="Payment Methods" />
          <MenuListItem icon="notifications-outline" title="Notifications" />
          <MenuListItem icon="shield-checkmark-outline" title="Privacy & Security" />
          <MenuListItem icon="help-circle-outline" title="Help & Support" />
          <MenuListItem icon="information-circle-outline" title="About" />
        </View>
        
        {/* Logout Button */}
        <Pressable className="flex-row items-center justify-center py-3 rounded-xl border border-red-500">
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text className="text-red-500 font-medium ml-2">Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// Helper component for menu items
function MenuListItem({ icon, title }) {
  return (
    <Pressable className="flex-row items-center py-4 border-b border-gray-100">
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4">
        <Ionicons name={icon} size={20} color="#4b5563" />
      </View>
      <Text className="flex-1 text-gray-800 font-medium">{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Pressable>
  );
}