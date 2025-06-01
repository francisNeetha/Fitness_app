// screens/ExerciseDetailScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  StatusBar,
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

const exerciseData = {
  1: {
    name: 'Push-ups',
    icon: '💪',
    duration: '15 min',
    calories: '120 cal',
    difficulty: 'Intermediate',
    color: '#FF6B6B',
    description: 'Push-ups are a fundamental bodyweight exercise that strengthens your chest, shoulders, triceps, and core muscles.',
    benefits: [
      'Builds upper body strength',
      'Improves core stability',
      'Enhances functional movement',
      'Requires no equipment',
      'Can be done anywhere'
    ],
    instructions: [
      'Start in a plank position with hands slightly wider than shoulder-width',
      'Keep your body in a straight line from head to toe',
      'Lower your chest toward the ground by bending your elbows',
      'Push back up to the starting position',
      'Repeat for desired number of repetitions'
    ],
    tips: [
      'Keep your core engaged throughout the movement',
      'Don\'t let your hips sag or pike up',
      'Control the movement - don\'t rush',
      'Breathe in as you lower, breathe out as you push up'
    ],
    variations: [
      { name: 'Knee Push-ups', difficulty: 'Beginner' },
      { name: 'Diamond Push-ups', difficulty: 'Advanced' },
      { name: 'Incline Push-ups', difficulty: 'Beginner' },
      { name: 'Decline Push-ups', difficulty: 'Advanced' }
    ]
  },
  2: {
    name: 'Running',
    icon: '🏃‍♂️',
    duration: '30 min',
    calories: '300 cal',
    difficulty: 'Beginner',
    color: '#4ECDC4',
    description: 'Running is an excellent cardiovascular exercise that improves heart health, builds endurance, and burns calories effectively.',
    benefits: [
      'Improves cardiovascular health',
      'Burns high amount of calories',
      'Strengthens leg muscles',
      'Boosts mental health',
      'Increases bone density'
    ],
    instructions: [
      'Start with a 5-minute warm-up walk',
      'Begin running at a comfortable pace',
      'Maintain steady breathing rhythm',
      'Keep your posture upright and relaxed',
      'Cool down with a 5-minute walk'
    ],
    tips: [
      'Start slowly and gradually increase distance',
      'Invest in proper running shoes',
      'Stay hydrated before, during, and after',
      'Listen to your body and rest when needed'
    ],
    variations: [
      { name: 'Interval Running', difficulty: 'Intermediate' },
      { name: 'Hill Running', difficulty: 'Advanced' },
      { name: 'Treadmill Running', difficulty: 'Beginner' },
      { name: 'Trail Running', difficulty: 'Intermediate' }
    ]
  },
  3: {
    name: 'Yoga',
    icon: '🧘‍♀️',
    duration: '45 min',
    calories: '180 cal',
    difficulty: 'Beginner',
    color: '#45B7D1',
    description: 'Yoga combines physical postures, breathing techniques, and meditation to improve flexibility, strength, and mental well-being.',
    benefits: [
      'Increases flexibility and balance',
      'Reduces stress and anxiety',
      'Improves strength and posture',
      'Enhances mindfulness',
      'Better sleep quality'
    ],
    instructions: [
      'Find a quiet, comfortable space',
      'Use a yoga mat for better grip',
      'Start with basic poses and breathing',
      'Hold each pose for 30-60 seconds',
      'End with relaxation pose'
    ],
    tips: [
      'Don\'t force poses - listen to your body',
      'Focus on your breathing throughout',
      'Practice regularly for best results',
      'Consider joining a beginner class'
    ],
    variations: [
      { name: 'Hatha Yoga', difficulty: 'Beginner' },
      { name: 'Vinyasa Yoga', difficulty: 'Intermediate' },
      { name: 'Hot Yoga', difficulty: 'Advanced' },
      { name: 'Restorative Yoga', difficulty: 'Beginner' }
    ]
  },
  4: {
    name: 'Weight Lifting',
    icon: '🏋️‍♂️',
    duration: '60 min',
    calories: '400 cal',
    difficulty: 'Advanced',
    color: '#96CEB4',
    description: 'Weight lifting builds muscle mass, increases strength, and improves bone density through resistance training.',
    benefits: [
      'Builds muscle mass and strength',
      'Increases bone density',
      'Boosts metabolism',
      'Improves body composition',
      'Enhances functional strength'
    ],
    instructions: [
      'Warm up with 5-10 minutes of light cardio',
      'Start with lighter weights to practice form',
      'Focus on compound movements first',
      'Rest 2-3 minutes between sets',
      'Cool down with stretching'
    ],
    tips: [
      'Perfect your form before increasing weight',
      'Progress gradually to avoid injury',
      'Include both upper and lower body exercises',
      'Consider working with a trainer initially'
    ],
    variations: [
      { name: 'Bodybuilding', difficulty: 'Advanced' },
      { name: 'Powerlifting', difficulty: 'Advanced' },
      { name: 'Circuit Training', difficulty: 'Intermediate' },
      { name: 'Functional Training', difficulty: 'Intermediate' }
    ]
  },
  5: {
    name: 'Cycling',
    icon: '🚴‍♂️',
    duration: '40 min',
    calories: '350 cal',
    difficulty: 'Intermediate',
    color: '#FFEAA7',
    description: 'Cycling is a low-impact cardiovascular exercise that strengthens legs, improves endurance, and is easy on the joints.',
    benefits: [
      'Low-impact on joints',
      'Strengthens leg muscles',
      'Improves cardiovascular fitness',
      'Eco-friendly transportation',
      'Can be social activity'
    ],
    instructions: [
      'Adjust bike seat to proper height',
      'Start with a gentle warm-up pace',
      'Maintain steady pedaling rhythm',
      'Use gears appropriately for terrain',
      'Cool down with easy pedaling'
    ],
    tips: [
      'Wear a properly fitted helmet',
      'Start with shorter distances',
      'Stay hydrated during longer rides',
      'Check tire pressure regularly'
    ],
    variations: [
      { name: 'Road Cycling', difficulty: 'Intermediate' },
      { name: 'Mountain Biking', difficulty: 'Advanced' },
      { name: 'Indoor Cycling', difficulty: 'Beginner' },
      { name: 'Spin Classes', difficulty: 'Intermediate' }
    ]
  },
  6: {
    name: 'Swimming',
    icon: '🏊‍♂️',
    duration: '30 min',
    calories: '250 cal',
    difficulty: 'Intermediate',
    color: '#DDA0DD',
    description: 'Swimming is a full-body, low-impact exercise that builds endurance, strength, and cardiovascular fitness.',
    benefits: [
      'Full-body workout',
      'Low-impact on joints',
      'Builds cardiovascular endurance',
      'Strengthens core muscles',
      'Therapeutic and relaxing'
    ],
    instructions: [
      'Warm up with easy swimming or walking in water',
      'Focus on proper breathing technique',
      'Alternate between different strokes',
      'Maintain steady pace throughout',
      'Cool down with easy swimming or floating'
    ],
    tips: [
      'Learn proper breathing techniques',
      'Start with shorter distances',
      'Use pool equipment if needed',
      'Consider swimming lessons for technique'
    ],
    variations: [
      { name: 'Freestyle Swimming', difficulty: 'Beginner' },
      { name: 'Water Aerobics', difficulty: 'Beginner' },
      { name: 'Competitive Swimming', difficulty: 'Advanced' },
      { name: 'Open Water Swimming', difficulty: 'Advanced' }
    ]
  }
};

export default function ExerciseDetailScreen({ route, navigation }) {
  const { exerciseId } = route.params;
  const exercise = exerciseData[exerciseId];
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f23" />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Details</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Exercise Header */}
        <Animated.View 
          style={[
            styles.exerciseHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: exercise.color + '20' }]}>
            <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
          </View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: exercise.color }]}>{exercise.duration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: exercise.color }]}>{exercise.calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: exercise.color }]}>{exercise.difficulty}</Text>
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
          </View>
        </Animated.View>

        {/* Benefits Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Benefits</Text>
          {exercise.benefits.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bullet, { color: exercise.color }]}>•</Text>
              <Text style={styles.listText}>{benefit}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Instructions Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>How to Perform</Text>
          {exercise.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={[styles.stepNumber, { backgroundColor: exercise.color }]}>
                <Text style={styles.stepText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Tips Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Tips & Safety</Text>
          {exercise.tips.map((tip, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bullet, { color: exercise.color }]}>💡</Text>
              <Text style={styles.listText}>{tip}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Variations Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Variations</Text>
          <View style={styles.variationsGrid}>
            {exercise.variations.map((variation, index) => (
              <View key={index} style={styles.variationCard}>
                <Text style={styles.variationName}>{variation.name}</Text>
                <Text style={[styles.variationDifficulty, { color: exercise.color }]}>
                  {variation.difficulty}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Start Exercise Button */}
        {/* <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: exercise.color }]}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Exercise</Text>
          </TouchableOpacity>
        </Animated.View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a2e',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  exerciseHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#1a1a2e',
    margin: 20,
    borderRadius: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseIcon: {
    fontSize: 40,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    textTransform: 'uppercase',
  },
  section: {
    backgroundColor: '#1a1a2e',
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  listText: {
    fontSize: 16,
    color: '#a0a0a0',
    flex: 1,
    lineHeight: 22,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 16,
    color: '#a0a0a0',
    flex: 1,
    lineHeight: 22,
  },
  variationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  variationCard: {
    backgroundColor: '#333344',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 10,
  },
  variationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  variationDifficulty: {
    fontSize: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 20,
  },
  startButton: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});