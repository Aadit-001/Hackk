import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { calculateBearing, calculateDistance } from '../utils/geoCalculations';

const ARArrow = ({ waypoint, userLocation, heading, screenWidth, screenHeight, index = 0 }) => {
  const calculateAccuratePosition = () => {
    // Enhanced validation
    if (!userLocation || !waypoint || !isFinite(heading)) {
      return { display: 'none' };
    }

    // Validate coordinates
    if (!isValidCoordinate(userLocation.latitude) || !isValidCoordinate(userLocation.longitude) ||
        !isValidCoordinate(waypoint.lat) || !isValidCoordinate(waypoint.lng)) {
      return { display: 'none' };
    }

    try {
      // Calculate bearing to waypoint
      const bearing = calculateBearing(
        userLocation.latitude,
        userLocation.longitude,
        waypoint.lat,
        waypoint.lng
      );

      // Validate bearing
      if (!isFinite(bearing)) {
        return { display: 'none' };
      }

      // Calculate angle difference with improved normalization
      let angleDiff = normalizeAngle(bearing - heading);

      // Enhanced FOV check - narrower for better precision
      const FOV = 40; // Reduced from 45 for more precise targeting
      if (Math.abs(angleDiff) > FOV / 2) {
        return { display: 'none' };
      }

      // Calculate distance
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        waypoint.lat,
        waypoint.lng
      );

      // Skip if too close (avoid clutter)
      if (distance < 5) {
        return { display: 'none' };
      }

      // Enhanced horizontal positioning
      const horizontalRatio = angleDiff / (FOV / 2);
      const horizontalOffset = horizontalRatio * (screenWidth * 0.35); // Reduced spread
      const screenX = screenWidth / 2 + horizontalOffset;

      // Enhanced vertical positioning with more granular distance ranges
      let screenY;
      if (distance < 25) {
        screenY = screenHeight * 0.75; // Very close = very low
      } else if (distance < 50) {
        screenY = screenHeight * 0.65; // Close = low
      } else if (distance < 100) {
        screenY = screenHeight * 0.55; // Medium = center-low
      } else if (distance < 200) {
        screenY = screenHeight * 0.45; // Far = center-high
      } else {
        screenY = screenHeight * 0.35; // Very far = high
      }

      // Add slight vertical offset for multiple arrows to prevent overlap
      const verticalOffset = index * 15;
      screenY += verticalOffset;

      // Enhanced bounds checking
      const finalLeft = Math.max(30, Math.min(screenWidth - 80, screenX - 25));
      const finalTop = Math.max(120, Math.min(screenHeight - 120, screenY));

      // Dynamic opacity based on distance and relevance
      let opacity = 1;
      if (distance > 150) {
        opacity = Math.max(0.4, 1 - ((distance - 150) / 200));
      }
      
      // Priority boost for next waypoints
      if (waypoint.isNext) {
        opacity = Math.min(1, opacity + 0.3);
      }

      return {
        position: 'absolute',
        left: finalLeft,
        top: finalTop,
        opacity: opacity,
        zIndex: waypoint.isNext ? 1100 : (1000 - index), // Higher z-index for priority arrows
        distance: distance,
        angleDiff: angleDiff
      };
    } catch (error) {
      console.log('AR Arrow positioning error:', error);
      return { display: 'none' };
    }
  };

  // Helper function to validate coordinates
  const isValidCoordinate = (coord) => {
    return isFinite(coord) && !isNaN(coord) && coord !== 0;
  };

  // Helper function to normalize angles
  const normalizeAngle = (angle) => {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    return angle;
  };

  // Calculate dynamic arrow style based on distance and priority
  const getArrowStyle = (distance, isNext) => {
    const baseSize = isNext ? 55 : 45;
    const sizeMultiplier = distance < 50 ? 1.2 : distance < 100 ? 1.0 : 0.9;
    const finalSize = Math.max(35, baseSize * sizeMultiplier);

    return {
      width: finalSize,
      height: finalSize,
      borderRadius: finalSize / 2,
      backgroundColor: isNext ? '#FF6B35' : getDistanceColor(distance),
      borderWidth: isNext ? 4 : 3,
      borderColor: isNext ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: isNext ? 4 : 2 },
      shadowOpacity: isNext ? 0.9 : 0.7,
      shadowRadius: isNext ? 6 : 4,
      elevation: isNext ? 12 : 8,
      // Add subtle pulse animation for next waypoint
      transform: isNext ? [{ scale: 1.1 }] : [{ scale: 1.0 }]
    };
  };

  // Get color based on distance
  const getDistanceColor = (distance) => {
    if (distance < 50) return '#FF4500'; // OrangeRed for close
    if (distance < 100) return '#FF6B35'; // Orange for medium
    if (distance < 200) return 'rgba(255, 107, 53, 0.8)'; // Faded orange for far
    return 'rgba(255, 107, 53, 0.6)'; // Very faded for very far
  };

  // Get arrow text based on distance and priority
  const getArrowText = (distance, isNext) => {
    if (isNext && distance < 30) return '⬇'; // Down arrow for very close next waypoint
    if (distance < 25) return '●'; // Dot for very close
    return '➤'; // Default arrow
  };

  const position = calculateAccuratePosition();
  
  if (position.display === 'none') return null;

  const distance = position.distance || waypoint.distance || 0;
  const isNext = waypoint.isNext || false;

  return (
    <View style={[styles.arrowContainer, position]}>
      {/* Main arrow */}
      <View style={[styles.arrow, getArrowStyle(distance, isNext)]}>
        <Text style={[
          styles.arrowText, 
          { fontSize: isNext ? 26 : 22 }
        ]}>
          {getArrowText(distance, isNext)}
        </Text>
      </View>

      {/* Distance label */}
      <Text style={[
        styles.distanceText,
        { 
          backgroundColor: isNext ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
          fontWeight: isNext ? 'bold' : 'normal'
        }
      ]}>
        {Math.round(distance)}m
      </Text>

      {/* Priority indicator for next waypoint */}
      {isNext && (
        <View style={styles.priorityIndicator}>
          <Text style={styles.priorityText}>NEXT</Text>
        </View>
      )}

      {/* Debug info (remove in production) */}
      {__DEV__ && (
        <Text style={styles.debugText}>
          {Math.round(position.angleDiff)}°
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    alignItems: 'center',
    minWidth: 60,
    minHeight: 80
  },
  arrow: {
    // Dynamic styles applied in getArrowStyle
  },
  arrowText: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  distanceText: {
    color: 'white',
    fontSize: 11,
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    textAlign: 'center',
    fontWeight: '600',
    minWidth: 35,
    overflow: 'hidden'
  },
  priorityIndicator: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 3,
    borderWidth: 1,
    borderColor: 'white'
  },
  priorityText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  debugText: {
    color: '#00FF00',
    fontSize: 8,
    marginTop: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 4,
    borderRadius: 3
  }
});

export default ARArrow;
