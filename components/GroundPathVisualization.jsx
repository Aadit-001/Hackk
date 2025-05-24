import React from 'react';
import { StyleSheet, View } from 'react-native';
import DistanceMarker from './DistanceMarker';

const GroundPathVisualization = ({ 
  visibleSegments, 
  screenWidth, 
  screenHeight,
  remainingDistance 
}) => {
  if (!visibleSegments || visibleSegments.length < 2) return null;

  return (
    <View style={styles.pathOverlay} pointerEvents="none">
      {/* Enhanced route line segments with Mapbox styling */}
      {visibleSegments.slice(0, 12).map((point, index) => {
        const nextPoint = visibleSegments[index + 1];
        if (!nextPoint) return null;

        // Calculate enhanced line properties
        const lineLength = Math.sqrt(
          Math.pow(nextPoint.x - point.x, 2) + 
          Math.pow(nextPoint.y - point.y, 2)
        );
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

        // Enhanced width based on distance (perspective effect)
        const baseWidth = point.distance < 30 ? 16 : point.distance < 60 ? 12 : 8;
        const segmentWidth = Math.max(4, baseWidth - (point.distance / 50));

        return (
          <React.Fragment key={`segment-${index}`}>
            {/* White outline for better visibility */}
            <View
              style={[
                styles.routeLineOutline,
                {
                  left: point.x,
                  top: point.y,
                  width: lineLength,
                  height: segmentWidth + 4,
                  transform: [{ rotate: `${angle}deg` }],
                  opacity: point.opacity * 0.6
                }
              ]}
            />
            
            {/* Main green path */}
            <View
              style={[
                styles.routeLine,
                {
                  left: point.x,
                  top: point.y,
                  width: lineLength,
                  height: segmentWidth,
                  transform: [{ rotate: `${angle}deg` }],
                  opacity: point.opacity,
                  backgroundColor: getSegmentColor(point.distance, index)
                }
              ]}
            />
          </React.Fragment>
        );
      })}

      {/* Enhanced route waypoints */}
      {visibleSegments.slice(0, 8).map((point, index) => {
        const isNext = index < 2;
        const size = isNext ? 16 : 12;
        
        return (
          <View
            key={`waypoint-${index}`}
            style={[
              styles.routeWaypoint,
              {
                left: point.x - size/2,
                top: point.y - size/2,
                width: size,
                height: size,
                backgroundColor: isNext ? '#FF4500' : '#00FF88',
                opacity: point.opacity,
                borderWidth: isNext ? 3 : 2
              }
            ]}
          />
        );
      })}

      {/* Distance markers with enhanced styling */}
      {visibleSegments.slice(0, 4).map((point, index) => (
        <DistanceMarker
          key={`marker-${index}`}
          point={point}
          index={index}
          isNext={index === 0}
        />
      ))}
    </View>
  );
};

// Enhanced color calculation for depth effect
const getSegmentColor = (distance, index) => {
  if (distance < 20) return '#00FF88'; // Bright green for close segments
  if (distance < 50) return '#00E577'; // Medium green
  if (distance < 100) return '#00CC66'; // Darker green
  return '#00B855'; // Darkest green for far segments
};

const styles = StyleSheet.create({
  pathOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100
  },
  routeLineOutline: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  routeLine: {
    position: 'absolute',
    borderRadius: 3,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8
  },
  routeWaypoint: {
    position: 'absolute',
    borderRadius: 10,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 10
  }
});

export default GroundPathVisualization;
