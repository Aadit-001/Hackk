import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DistanceMarker = ({ point, index, isNext }) => {
  if (!point || point.distance > 200) return null;

  return (
    <View
      style={[
        styles.markerContainer,
        {
          left: point.x - 30,
          top: point.y - 45,
          opacity: point.opacity
        }
      ]}
    >
      {/* Distance badge */}
      <View style={[
        styles.distanceBadge,
        { 
          backgroundColor: isNext ? '#FF4500' : 'rgba(0, 255, 136, 0.9)',
          borderColor: isNext ? '#FF6B35' : '#00FF88'
        }
      ]}>
        <Text style={[
          styles.distanceText,
          { color: isNext ? 'white' : '#000' }
        ]}>
          {Math.round(point.distance)}m
        </Text>
      </View>
      
      {/* Connector line */}
      <View style={[
        styles.connector,
        { backgroundColor: isNext ? '#FF4500' : '#00FF88' }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 200
  },
  distanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 8,
    minWidth: 60
  },
  distanceText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  connector: {
    width: 3,
    height: 20,
    borderRadius: 1.5,
    marginTop: 2
  }
});

export default DistanceMarker;
