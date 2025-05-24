import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import ARScreen from './Ar';
import ProfileScreen from './Profile';
import TripsScreen from './Trips';
import HomeScreen from './vishal';

// Define styles for the tab bar and icons
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 0,
    elevation: 0,
    height: 70,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    paddingBottom: 10,
  },
  tabBarItem: {
    paddingTop: 10,
  },
  tabBarLabel: {
    fontWeight: '600',
    fontSize: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
  },
});

const Tab = createBottomTabNavigator();

interface TabIconProps {
  name: string;
  color: string;
  focused: boolean;
}

const TabIcon = ({ name, color, focused }: TabIconProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(focused ? 1.2 : 1) }],
      opacity: withSpring(focused ? 1 : 0.7),
    };
  });

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={animatedStyle}>
        <Ionicons name={name as any} color={color} size={24} />
      </Animated.View>
      {focused && (
        <View style={[styles.indicator, { backgroundColor: color }]} />
      )}
    </View>
  );
};



export default function TabsLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="light" /> : null
        ),
        headerShown: false
      }}
    >
      <Tab.Screen 
        name="vishal" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Trips"
        component={TripsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="map" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Ar"
        component={ARScreen}
        options={{
          tabBarLabel: 'AR',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="camera" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}