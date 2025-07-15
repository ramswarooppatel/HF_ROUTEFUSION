import React from 'react';
import { View, Text, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const VoiceFeedback = ({ isListening, text }) => {
  return (
    <Animated.View style={styles.container}>
      <Feather 
        name={isListening ? "mic" : "mic-off"} 
        size={24} 
        color={isListening ? "#FF5A5F" : "#4361EE"} 
      />
      <Text style={styles.feedbackText}>{text}</Text>
    </Animated.View>
  );
};

const styles = {
  container: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  feedbackText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500'
  }
};