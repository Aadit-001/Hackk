import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ARControls = ({ onBackPress, heading, pitch }) => {
  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* AR compass */}
      <View style={styles.compass}>
        <Text style={styles.compassText}>🧭</Text>
        <Text style={styles.headingText}>{Math.round(heading)}°</Text>
      </View>

      {/* Pitch indicator */}
      <View style={styles.pitchIndicator}>
        <View style={[
          styles.pitchBar,
          { 
            transform: [{ rotate: `${Math.max(-45, Math.min(45, pitch))}deg` }] 
          }
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    zIndex: 400
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  compass: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    minWidth: 80
  },
  compassText: {
    fontSize: 16
  },
  headingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2
  },
  pitchIndicator: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  pitchBar: {
    width: 30,
    height: 3,
    backgroundColor: '#00FF88',
    borderRadius: 1.5
  }
});

export default ARControls;
