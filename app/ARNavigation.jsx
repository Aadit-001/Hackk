import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Accelerometer, Magnetometer } from 'expo-sensors';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchRouteWithShape } from '../services/routeService';
import { calculateBearing, calculateCompassHeading, calculateDistance, calculatePitch } from '../utils/geoCalculations';
import { decodeHerePolyline } from '../utils/polylineDecoder';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FOV_HORIZONTAL = 60; // Camera field of view
const EARTH_RADIUS = 6371000; // Earth radius in meters

export default function ARNavigation() {
  // State management
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [route, setRoute] = useState(null);
  const [routePoints, setRoutePoints] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // Sensor data
  const [accData, setAccData] = useState(null);
  const [magData, setMagData] = useState(null);

  // Refs for performance
  const cameraRef = useRef(null);
  const locationWatcher = useRef(null);
  const headingHistory = useRef([]);

  const params = useLocalSearchParams();
  const router = useRouter();
  const isFocused = useIsFocused();

  const destination = {
    lat: parseFloat(params.destinationLat),
    lng: parseFloat(params.destinationLng),
    name: params.destinationName || 'Destination'
  };

  // Track component mount status to prevent state updates after unmount
  const isMountedRef = React.useRef(true);
  
  // Camera and sensor initialization
  useEffect(() => {
    // Set mounted flag on component mount
    isMountedRef.current = true;
    
    if (!isFocused) {
      setCameraReady(false);
      setIsNavigating(false);
      return;
    }

    // Add a small delay before initializing camera to ensure previous camera is released
    const cameraInitTimeout = setTimeout(async () => {
      if (!isMountedRef.current) return;
      
      // Request camera permission explicitly
      if (!permission?.granted) {
        const permissionResult = await requestPermission();
        if (!permissionResult.granted || !isMountedRef.current) {
          if (isMountedRef.current) {
            Alert.alert(
              'Camera Permission Required',
              'Please grant camera permission to use AR navigation',
              [{ text: 'OK' }]
            );
          }
          return;
        }
      }
      
      if (isMountedRef.current) {
        initializeARSession();
      }
    }, 300); // Small delay to ensure camera resource is released
    
    return () => {
      // Set unmounted flag
      isMountedRef.current = false;
      
      // Clear timeout
      clearTimeout(cameraInitTimeout);
      
      // Run cleanup
      cleanup();
    };
  }, [isFocused, permission, requestPermission, initializeARSession]);

  const initializeARSession = useCallback(async () => {
    try {
      // Initialize sensors
      setupSensors();
      
      // Initialize location and routing
      await setupLocationAndRoute();
    } catch (error) {
      console.error('AR session initialization failed:', error);
      Alert.alert('Initialization Error', 'Failed to start AR navigation');
    }
  }, []);

  const setupSensors = () => {
    // Configure sensor update rates - lower frequency to reduce load
    Accelerometer.setUpdateInterval(500); // Reduced from 200ms to 500ms
    Magnetometer.setUpdateInterval(500); // Reduced from 200ms to 500ms

    // Accelerometer for device orientation
    const accSubscription = Accelerometer.addListener((data) => {
      if (isValidSensorData(data)) {
        // Use functional updates to prevent render cascades
        setAccData(prevData => {
          // Only update if significant change to reduce renders
          if (!prevData || 
              Math.abs(data.x - prevData.x) > 0.05 || 
              Math.abs(data.y - prevData.y) > 0.05 || 
              Math.abs(data.z - prevData.z) > 0.05) {
            setPitch(calculatePitch(data));
            return data;
          }
          return prevData;
        });
      }
    });

    // Magnetometer for compass heading
    const magSubscription = Magnetometer.addListener((data) => {
      if (isValidSensorData(data)) {
        // Use functional updates to prevent render cascades
        setMagData(prevData => {
          // Only update if significant change
          if (!prevData || 
              Math.abs(data.x - prevData.x) > 0.05 || 
              Math.abs(data.y - prevData.y) > 0.05 || 
              Math.abs(data.z - prevData.z) > 0.05) {
            return data;
          }
          return prevData;
        });
      }
    });

    return () => {
      accSubscription?.remove();
      magSubscription?.remove();
    };
  };

  const isValidSensorData = (data) => {
    return data && 
           typeof data.x === 'number' && isFinite(data.x) &&
           typeof data.y === 'number' && isFinite(data.y) &&
           typeof data.z === 'number' && isFinite(data.z);
  };

  // Calculate smoothed compass heading
  useEffect(() => {
    if (accData && magData) {
      try {
        const rawHeading = calculateCompassHeading(accData, magData);
        if (isFinite(rawHeading)) {
          // Smooth heading using moving average
          headingHistory.current.push(rawHeading);
          if (headingHistory.current.length > 5) {
            headingHistory.current.shift();
          }
          
          const smoothedHeading = headingHistory.current.reduce((sum, h) => sum + h, 0) / headingHistory.current.length;
          setHeading(smoothedHeading);
        }
      } catch (error) {
        console.log('Heading calculation error:', error);
      }
    }
  }, [accData, magData]);

  const setupLocationAndRoute = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location access is required for AR navigation');
        return;
      }

      // Get current location with high accuracy
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation
      });
      
      setLocation(currentLocation.coords);

      // Start location tracking
      locationWatcher.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 3
        },
        (newLocation) => {
          if (isFocused) {
            setLocation(newLocation.coords);
          }
        }
      );

      // Fetch route data
      const routeData = await fetchRouteWithShape(
        { lat: currentLocation.coords.latitude, lng: currentLocation.coords.longitude },
        destination
      );

      if (routeData?.polyline) {
        setRoute(routeData);
        const decodedPoints = decodeHerePolyline(routeData.polyline);
        setRoutePoints(decodedPoints.slice(0, 30)); // Limit for performance
        setIsNavigating(true);
      } else {
        Alert.alert('Route Error', 'Could not calculate route to destination');
      }
    } catch (error) {
      console.error('Location/Route setup error:', error);
      Alert.alert('Setup Error', 'Failed to initialize navigation');
    }
  };

  const cleanup = () => {
    if (locationWatcher.current) {
      locationWatcher.current.remove();
    }
  };

  // AR Projection Mathematics - Convert GPS coordinates to screen positions
  const projectToScreen = useCallback((targetLat, targetLng) => {
    if (!location) return null;

    // Calculate bearing and distance to target
    const bearing = calculateBearing(location.latitude, location.longitude, targetLat, targetLng);
    const distance = calculateDistance(location.latitude, location.longitude, targetLat, targetLng);

    // Calculate angle difference from current heading
    let angleDiff = bearing - heading;
    while (angleDiff > 180) angleDiff -= 360;
    while (angleDiff < -180) angleDiff += 360;

    // Check if point is within camera's field of view
    if (Math.abs(angleDiff) > FOV_HORIZONTAL / 2) return null;
    if (distance < 2 || distance > 200) return null; // Too close or too far

    // Convert to screen coordinates
    const screenX = SCREEN_WIDTH / 2 + (angleDiff / (FOV_HORIZONTAL / 2)) * (SCREEN_WIDTH / 2);

    // Calculate Y position using AR projection
    // This is the key for making lines appear on the ground
    const cameraHeight = 1.5; // Assumed camera height in meters
    const groundDistance = distance;
    
    // Perspective projection formula
    const pitchRadians = pitch * Math.PI / 180;
    const verticalAngle = Math.atan(cameraHeight / groundDistance) + pitchRadians;
    
    // Convert vertical angle to screen Y coordinate
    const normalizedVerticalAngle = verticalAngle / (Math.PI / 4); // Normalize to 45-degree FOV
    const screenY = SCREEN_HEIGHT / 2 - (normalizedVerticalAngle * SCREEN_HEIGHT / 3);

    // Clamp to screen bounds
    const clampedY = Math.max(SCREEN_HEIGHT * 0.1, Math.min(SCREEN_HEIGHT * 0.9, screenY));

    return {
      x: Math.max(0, Math.min(SCREEN_WIDTH, screenX)),
      y: clampedY,
      distance,
      visible: true
    };
  }, [location, heading, pitch]);

  // Get visible route segments for AR overlay
  const getVisibleRouteSegments = useCallback(() => {
    if (!location || !routePoints.length) return [];

    return routePoints
      .map((point, index) => {
        const projection = projectToScreen(point.lat, point.lng);
        return projection ? { ...point, index, projection } : null;
      })
      .filter(Boolean)
      .slice(0, 15); // Limit for performance
  }, [routePoints, projectToScreen]);

  const visibleSegments = getVisibleRouteSegments();

  // AR Camera Overlay Component
  const AROverlay = () => {
    if (!visibleSegments.length || !cameraReady) return null;

    return (
      <View style={styles.arOverlay} pointerEvents="none">
        {/* Route path segments */}
        {visibleSegments.map((segment, index) => {
          const nextSegment = visibleSegments[index + 1];
          if (!nextSegment) return null;

          const start = segment.projection;
          const end = nextSegment.projection;

          // Calculate line properties
          const deltaX = end.x - start.x;
          const deltaY = end.y - start.y;
          const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

          // Line width based on distance (perspective effect)
          const baseWidth = Math.max(4, 20 - start.distance / 8);

          return (
            <React.Fragment key={`segment-${index}`}>
              {/* White outline for visibility */}
              <View
                style={[
                  styles.pathOutline,
                  {
                    left: start.x,
                    top: start.y - (baseWidth + 4) / 2,
                    width: length,
                    height: baseWidth + 4,
                    transform: [{ rotate: `${angle}deg` }],
                    opacity: Math.max(0.5, 1 - start.distance / 150)
                  }
                ]}
              />
              
              {/* Green path line */}
              <View
                style={[
                  styles.pathLine,
                  {
                    left: start.x,
                    top: start.y - baseWidth / 2,
                    width: length,
                    height: baseWidth,
                    transform: [{ rotate: `${angle}deg` }],
                    opacity: Math.max(0.7, 1 - start.distance / 150)
                  }
                ]}
              />
            </React.Fragment>
          );
        })}

        {/* Route waypoints */}
        {visibleSegments.slice(0, 6).map((segment, index) => {
          const isNext = index === 0;
          const size = isNext ? 18 : 14;
          
          return (
            <View
              key={`waypoint-${index}`}
              style={[
                styles.waypoint,
                {
                  left: segment.projection.x - size / 2,
                  top: segment.projection.y - size / 2,
                  width: size,
                  height: size,
                  backgroundColor: isNext ? '#FF4500' : '#00FF88',
                  opacity: Math.max(0.8, 1 - segment.distance / 150)
                }
              ]}
            />
          );
        })}

        {/* Distance markers */}
        {visibleSegments.slice(0, 4).map((segment, index) => (
          <View
            key={`distance-${index}`}
            style={[
              styles.distanceMarker,
              {
                left: segment.projection.x - 30,
                top: segment.projection.y - 50
              }
            ]}
          >
            <Text style={styles.distanceText}>
              {Math.round(segment.distance)}m
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Permission handling
  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionMessage}>
          This app needs camera access to display AR navigation overlays on the real world.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View - This displays the live camera feed */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={() => {
          console.log('✅ Camera ready for AR');
          setCameraReady(true);
        }}
        onMountError={(error) => {
          console.error('❌ Camera mount error:', error);
          Alert.alert('Camera Error', 'Failed to start camera: ' + error.message);
        }}
        enableZoomGesture={false}
        autoFocus={false}
        videoStabilizationMode="off"
      />

      {/* AR Overlay - Rendered on top of camera feed */}
      <AROverlay />

      {/* UI Controls */}
      <View style={styles.uiContainer}>
        {/* Back button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Exit AR</Text>
        </TouchableOpacity>

        {/* Status indicator */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: cameraReady ? '#00FF88' : '#FF4500' }]} />
          <Text style={styles.statusText}>
            {cameraReady ? 'AR Active' : 'Initializing...'}
          </Text>
        </View>

        {/* Navigation info */}
        <View style={styles.navInfoContainer}>
          <Text style={styles.destinationText}>📍 {destination.name}</Text>
          {route && (
            <Text style={styles.routeInfoText}>
              {Math.round(route.distance)}m • {Math.round(route.duration / 60)} min
            </Text>
          )}
          <Text style={styles.segmentCountText}>
            {visibleSegments.length} path segments visible
          </Text>
        </View>
      </View>

      {/* Loading overlay */}
      {!cameraReady && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Starting AR Camera...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 30
  },
  permissionTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  permissionMessage: {
    color: '#CCC',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30
  },
  permissionButton: {
    backgroundColor: '#00FF88',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10
  },
  pathOutline: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4
  },
  pathLine: {
    position: 'absolute',
    backgroundColor: '#00FF88',
    borderRadius: 3,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5
  },
  waypoint: {
    position: 'absolute',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8
  },
  distanceMarker: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00FF88'
  },
  distanceText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  uiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  statusContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600'
  },
  navInfoContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)'
  },
  destinationText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  routeInfoText: {
    color: '#00FF88',
    fontSize: 16,
    marginBottom: 5
  },
  segmentCountText: {
    color: '#AAA',
    fontSize: 12
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50
  },
  loadingText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center'
  }
});
