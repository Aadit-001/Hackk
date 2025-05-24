import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Accelerometer, Magnetometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchBuildings } from '../services/hereAPI';
import { calculateBearing, calculateCompassHeading } from '../utils/geoCalculations';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const FOV_HORIZONTAL = 150;
const MAX_DISTANCE = 300;

export default function ARBuildingViewer() {
  const [permission, requestPermission] = useCameraPermissions();
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [buildings, setBuildings] = useState([]);
  const [accData, setAccData] = useState(null);
  const [magData, setMagData] = useState(null);
  const router = useRouter();

  // Request camera permission on component mount
  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, [permission, requestPermission]);

  // Store sensor subscriptions in refs so they can be accessed in cleanup
  const accSubscriptionRef = React.useRef(null);
  const magSubscriptionRef = React.useRef(null);
  const isMountedRef = React.useRef(true);
  
  // Sensor subscriptions
  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    // Use lower update frequency to reduce performance impact
    Accelerometer.setUpdateInterval(1000); // 1 second interval
    Magnetometer.setUpdateInterval(1000); // 1 second interval
    
    // Throttle sensor updates to prevent excessive renders
    accSubscriptionRef.current = Accelerometer.addListener((data) => {
      if (!isMountedRef.current) return;
      
      if (data && isFinite(data.x) && isFinite(data.y) && isFinite(data.z)) {
        setAccData(prevData => {
          // Only update if significant change
          if (!prevData || 
              Math.abs(data.x - prevData.x) > 0.1 || 
              Math.abs(data.y - prevData.y) > 0.1 || 
              Math.abs(data.z - prevData.z) > 0.1) {
            return data;
          }
          return prevData;
        });
      }
    });
    
    magSubscriptionRef.current = Magnetometer.addListener((data) => {
      if (!isMountedRef.current) return;
      
      if (data && isFinite(data.x) && isFinite(data.y) && isFinite(data.z)) {
        setMagData(prevData => {
          // Only update if significant change
          if (!prevData || 
              Math.abs(data.x - prevData.x) > 0.1 || 
              Math.abs(data.y - prevData.y) > 0.1 || 
              Math.abs(data.z - prevData.z) > 0.1) {
            return data;
          }
          return prevData;
        });
      }
    });

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (accSubscriptionRef.current) {
        accSubscriptionRef.current.remove();
        accSubscriptionRef.current = null;
      }
      if (magSubscriptionRef.current) {
        magSubscriptionRef.current.remove();
        magSubscriptionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (accData && magData) {
      try {
        const headingValue = calculateCompassHeading(accData, magData);
        if (isFinite(headingValue)) {
          setHeading(headingValue);
        }
      } catch (error) {
        console.log('Heading calculation error:', error);
      }
    }
  }, [accData, magData]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        setLocation(location.coords);

        const buildings = await fetchBuildings(location.coords);
        console.log('Fetched buildings:', buildings.length);
        setBuildings(buildings.filter(b => b.distance <= MAX_DISTANCE));
      } catch (error) {
        console.log('Location error:', error);
      }
    })();
  }, []);

  // Handle building tap for navigation
  const handleBuildingTap = (building) => {
    Alert.alert(
      `Navigate to ${building.name}?`,
      `Distance: ${Math.round(building.distance)}m\n\nThis will show AR directions to the location.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Navigate', 
          onPress: () => {
            // Clean up camera and sensors before navigation
            isMountedRef.current = false;
            if (accSubscriptionRef.current) {
              accSubscriptionRef.current.remove();
              accSubscriptionRef.current = null;
            }
            if (magSubscriptionRef.current) {
              magSubscriptionRef.current.remove();
              magSubscriptionRef.current = null;
            }
            
            // Navigate to AR Navigation screen
            router.push({
              pathname: '/ARNavigation',
              params: {
                destinationLat: building.lat.toString(),
                destinationLng: building.lng.toString(),
                destinationName: building.name,
                userLat: location.latitude.toString(),
                userLng: location.longitude.toString()
              }
            });
          }
        }
      ]
    );
  };

  // Safe number validation function
  const safeNumber = (value, fallback = 0) => {
    return isFinite(value) && !isNaN(value) ? value : fallback;
  };

  // Simplified building filtering
  const getVisibleBuildings = () => {
    if (!location || !isFinite(heading)) return [];

    return buildings
      .map(building => {
        try {
          const bearing = calculateBearing(
            location.latitude,
            location.longitude,
            building.lat,
            building.lng
          );

          if (!isFinite(bearing)) return null;

          let angleDiff = bearing - heading;
          while (angleDiff > 180) angleDiff -= 360;
          while (angleDiff < -180) angleDiff += 360;

          return {
            ...building,
            angleDiff: safeNumber(angleDiff),
            bearing: safeNumber(bearing)
          };
        } catch (error) {
          console.log('Building calculation error:', error);
          return null;
        }
      })
      .filter(building => {
        return building &&
               isFinite(building.angleDiff) &&
               Math.abs(building.angleDiff) <= FOV_HORIZONTAL / 2;
      })
      .slice(0, 6);
  };

  // Safe position calculation
  const calculateSafePosition = (building, index) => {
    try {
      const normalizedAngle = building.angleDiff / (FOV_HORIZONTAL / 2);
      const horizontalOffset = normalizedAngle * (SCREEN_WIDTH / 4);

      const left = safeNumber(SCREEN_WIDTH / 2 + horizontalOffset - 60, SCREEN_WIDTH / 2 - 60);
      const top = safeNumber(SCREEN_HEIGHT * 0.3 + (index * 100), SCREEN_HEIGHT * 0.3);

      return {
        position: 'absolute',
        left: Math.max(10, Math.min(SCREEN_WIDTH - 130, left)),
        top: Math.max(50, Math.min(SCREEN_HEIGHT - 100, top)),
        opacity: 0.9,
        zIndex: 100
      };
    } catch (error) {
      console.log('Position calculation error:', error);
      return {
        position: 'absolute',
        left: SCREEN_WIDTH / 2 - 60,
        top: SCREEN_HEIGHT / 2 + (index * 80),
        opacity: 0.9
      };
    }
  };

  const visibleBuildings = getVisibleBuildings();

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Camera permission required</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        onCameraReady={() => {
          console.log('Camera ready for AR');
        }}
        onMountError={(error) => {
          console.error('Camera error:', error);
          Alert.alert('Camera Error', 'Failed to start camera: ' + error.message);
        }}
        autoFocus={false}
        videoStabilizationMode="off"
      />

      {/* Debug info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>
          Heading: {Math.round(safeNumber(heading))}°
        </Text>
        <Text style={styles.debugText}>
          Buildings: {visibleBuildings.length}
        </Text>
      </View>

      {visibleBuildings.map((building, index) => (
        <TouchableOpacity
          key={`${building.id}-${index}`}
          style={[styles.labelContainer, calculateSafePosition(building, index)]}
          onPress={() => handleBuildingTap(building)}
          activeOpacity={0.7}
        >
          <Text style={styles.labelText} numberOfLines={2}>
            {building.name || 'Unknown Building'}
          </Text>
          <Text style={styles.distanceText}>
            {Math.round(safeNumber(building.distance, 0))}m
          </Text>
          <Text style={styles.tapHint}>Tap to navigate</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  permissionText: {
    color: '#007AFF',
    marginTop: 10,
    fontSize: 16
  },
  labelContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  labelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center'
  },
  distanceText: {
    color: '#FFD700',
    fontSize: 11,
    marginTop: 4
  },
  tapHint: {
    color: '#90EE90',
    fontSize: 9,
    marginTop: 2,
    fontStyle: 'italic'
  },
  debugContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 5
  },
  debugText: {
    color: 'white',
    fontSize: 12
  }
});
