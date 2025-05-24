import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const NavigationInfo = ({ 
  destination, 
  route, 
  currentInstruction,
  remainingDistance,
  heading, 
  pitch 
}) => {
  const formatDistance = (distance) => {
    if (distance > 1000) {
      return `${(distance / 1000).toFixed(1)}km`;
    }
    return `${Math.round(distance)}m`;
  };

  const formatDuration = (duration) => {
    const minutes = Math.round(duration / 60);
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}min`;
  };

  return (
    <View style={styles.container}>
      {/* Main navigation card */}
      <View style={styles.navigationCard}>
        <Text style={styles.destinationText}>📍 {destination.name}</Text>
        
        {route && (
          <View style={styles.routeStats}>
            <Text style={styles.distanceText}>
              🚶‍♂️ {formatDistance(remainingDistance)} • ⏱️ {formatDuration(route.duration)}
            </Text>
          </View>
        )}
        
        {currentInstruction && (
          <Text style={styles.instructionText}>
            📍 {currentInstruction}
          </Text>
        )}
      </View>

      {/* AR status indicator */}
      <View style={styles.arStatus}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>AR Navigation Active</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 300
  },
  navigationCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12
  },
  destinationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  routeStats: {
    marginBottom: 8
  },
  distanceText: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: '600'
  },
  instructionText: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20
  },
  arStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF88',
    marginRight: 8
  },
  statusText: {
    color: '#00FF88',
    fontSize: 12,
    fontWeight: '500'
  }
});

export default NavigationInfo;
