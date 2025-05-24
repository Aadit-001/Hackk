import { Text, View, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'nativewind';

export default function TripsScreen() {
  // Sample trip data
  const upcomingTrips = [
    { id: 1, name: 'Goa Beach Getaway', date: '24 May - 28 May', color: '#60a5fa', icon: 'umbrella' },
    { id: 2, name: 'Manali Adventure', date: '15 Jun - 20 Jun', color: '#34d399', icon: 'snow' },
  ];
  
  const pastTrips = [
    { id: 3, name: 'Kerala Backwaters', date: '10 Apr - 15 Apr', color: '#a78bfa', icon: 'boat' },
    { id: 4, name: 'Rajasthan Heritage', date: '22 Feb - 28 Feb', color: '#f97316', icon: 'business' },
    { id: 5, name: 'Andaman Islands', date: '5 Jan - 12 Jan', color: '#06b6d4', icon: 'water' },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-4 pt-12 pb-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">My Trips</Text>
          <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-gray-100">
            <Ionicons name="add" size={22} color="#4b5563" />
          </Pressable>
        </View>
        
        {/* Upcoming Trips */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Upcoming Trips</Text>
          {upcomingTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} upcoming={true} />
          ))}
        </View>
        
        {/* Past Trips */}
        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-4">Past Trips</Text>
          {pastTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} upcoming={false} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// Trip card component
function TripCard({ trip, upcoming }) {
  return (
    <Pressable className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
      <View 
        style={{ backgroundColor: trip.color }}
        className="w-full h-40 items-center justify-center"
      >
        <Ionicons name={trip.icon} size={64} color="white" />
      </View>
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-800">{trip.name}</Text>
          {upcoming && (
            <View className="bg-green-100 px-2 py-1 rounded">
              <Text className="text-xs font-medium text-green-800">Upcoming</Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center mt-2">
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text className="text-gray-500 ml-2">{trip.date}</Text>
        </View>
        <View className="flex-row justify-between mt-4">
          <Pressable className="flex-row items-center">
            <Ionicons name="map-outline" size={16} color="#3b82f6" />
            <Text className="text-blue-500 font-medium ml-1">Itinerary</Text>
          </Pressable>
          <Pressable className="flex-row items-center">
            <Ionicons name="share-social-outline" size={16} color="#6b7280" />
            <Text className="text-gray-500 font-medium ml-1">Share</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}