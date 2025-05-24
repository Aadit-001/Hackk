import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function RouteLine({ waypoints, heading, screenWidth, screenHeight }) {
  if (waypoints.length < 2) return null;

  const calculateLineSegments = () => {
    const segments = [];
    const FOV = 60;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i];
      const end = waypoints[i + 1];

      const startAngle = start.angleDiff / (FOV / 2);
      const endAngle = end.angleDiff / (FOV / 2);

      const startX = screenWidth/2 + (startAngle * screenWidth/3);
      const endX = screenWidth/2 + (endAngle * screenWidth/3);

      const startY = screenHeight * 0.4 + (start.distance / 100) * 50;
      const endY = screenHeight * 0.4 + (end.distance / 100) * 50;

      segments.push({
        id: i,
        startX: Math.max(0, Math.min(screenWidth, startX)),
        startY: Math.max(100, Math.min(screenHeight - 100, startY)),
        endX: Math.max(0, Math.min(screenWidth, endX)),
        endY: Math.max(100, Math.min(screenHeight - 100, endY)),
        opacity: Math.max(0.3, 1 - (start.distance / 200))
      });
    }

    return segments;
  };

  const segments = calculateLineSegments();

  return (
    <View style={styles.container}>
      {segments.map((segment) => {
        const length = Math.sqrt(
          Math.pow(segment.endX - segment.startX, 2) + 
          Math.pow(segment.endY - segment.startY, 2)
        );
        const angle = Math.atan2(
          segment.endY - segment.startY,
          segment.endX - segment.startX
        ) * (180 / Math.PI);

        return (
          <View
            key={segment.id}
            style={[
              styles.line,
              {
                position: 'absolute',
                left: segment.startX,
                top: segment.startY,
                width: length,
                transform: [{ rotate: `${angle}deg` }],
                opacity: segment.opacity
              }
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 500
  },
  line: {
    height: 4,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3
  }
});
