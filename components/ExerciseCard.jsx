import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ExerciseCard({ exercise }) {
  return (
    <View style={styles.card}>
      <Image source={exercise.image} style={styles.image} />
      <View>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.reps}>{exercise.reps}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  reps: {
    fontSize: 14,
    color: '#333',
  },
});
