import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { user, signout } = useAuth();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  // Enhanced state for persistent data
  const [completedExercises, setCompletedExercises] = useState([]);
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [dailyStats, setDailyStats] = useState({
    workouts: 0,
    calories: 0,
    minutes: 0
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Storage keys
  const getStorageKey = (key) => `${user?.email}_${key}`;

  // Get user's first name from email
  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);
    }
    return 'User';
  };

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      if (!user?.email) return;

      const [completedData, favoritesData, statsData] = await Promise.all([
        AsyncStorage.getItem(getStorageKey('completedExercises')),
        AsyncStorage.getItem(getStorageKey('favoriteExercises')),
        AsyncStorage.getItem(getStorageKey('dailyStats'))
      ]);

      if (completedData) {
        setCompletedExercises(JSON.parse(completedData));
      }
      
      if (favoritesData) {
        setFavoriteExercises(JSON.parse(favoritesData));
      }
      
      if (statsData) {
        setDailyStats(JSON.parse(statsData));
      }
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsLoaded(true);
    }
  };

  // Save completed exercises to AsyncStorage
  const saveCompletedExercises = async (exercises) => {
    try {
      await AsyncStorage.setItem(
        getStorageKey('completedExercises'), 
        JSON.stringify(exercises)
      );
    } catch (error) {
      console.error('Error saving completed exercises:', error);
    }
  };

  // Save favorite exercises to AsyncStorage
  const saveFavoriteExercises = async (exercises) => {
    try {
      await AsyncStorage.setItem(
        getStorageKey('favoriteExercises'), 
        JSON.stringify(exercises)
      );
    } catch (error) {
      console.error('Error saving favorite exercises:', error);
    }
  };

  // Save daily stats to AsyncStorage
  const saveDailyStats = async (stats) => {
    try {
      await AsyncStorage.setItem(
        getStorageKey('dailyStats'), 
        JSON.stringify(stats)
      );
    } catch (error) {
      console.error('Error saving daily stats:', error);
    }
  };

  // Initialize component
  useEffect(() => {
    loadUserData();
    
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
  }, [user]);

  const exercises = [
    {
      id: 1,
      name: 'Push-ups',
      duration: '15 min',
      calories: '120 cal',
      difficulty: 'Intermediate',
      icon: '💪',
      color: '#FF6B6B'
    },
    {
      id: 2,
      name: 'Running',
      duration: '30 min',
      calories: '300 cal',
      difficulty: 'Beginner',
      icon: '🏃‍♂️',
      color: '#4ECDC4'
    },
    {
      id: 3,
      name: 'Yoga',
      duration: '45 min',
      calories: '180 cal',
      difficulty: 'Beginner',
      icon: '🧘‍♀️',
      color: '#45B7D1'
    },
    {
      id: 4,
      name: 'Weight Lifting',
      duration: '60 min',
      calories: '400 cal',
      difficulty: 'Advanced',
      icon: '🏋️‍♂️',
      color: '#96CEB4'
    },
    {
      id: 5,
      name: 'Cycling',
      duration: '40 min',
      calories: '350 cal',
      difficulty: 'Intermediate',
      icon: '🚴‍♂️',
      color: '#FFEAA7'
    },
    {
      id: 6,
      name: 'Swimming',
      duration: '30 min',
      calories: '250 cal',
      difficulty: 'Intermediate',
      icon: '🏊‍♂️',
      color: '#DDA0DD'
    }
  ];

  // Enhanced functions with persistent storage
  const markExerciseComplete = async (exercise) => {
    if (!completedExercises.includes(exercise.id)) {
      const newCompletedExercises = [...completedExercises, exercise.id];
      setCompletedExercises(newCompletedExercises);
      await saveCompletedExercises(newCompletedExercises);
      
      // Update daily stats
      const calories = parseInt(exercise.calories.replace(' cal', ''));
      const minutes = parseInt(exercise.duration.replace(' min', ''));
      
      const newStats = {
        workouts: dailyStats.workouts + 1,
        calories: dailyStats.calories + calories,
        minutes: dailyStats.minutes + minutes
      };
      
      setDailyStats(newStats);
      await saveDailyStats(newStats);

      Alert.alert(
        'Exercise Completed! 🎉',
        `Great job completing ${exercise.name}!\n\nYou burned ${exercise.calories} and exercised for ${exercise.duration}.`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    } else {
      Alert.alert('Already Completed', 'You have already completed this exercise today!');
    }
  };

  const toggleFavorite = async (exerciseId) => {
    const isCurrentlyFavorite = favoriteExercises.includes(exerciseId);
    const exercise = exercises.find(ex => ex.id === exerciseId);
    
    const newFavorites = isCurrentlyFavorite 
      ? favoriteExercises.filter(id => id !== exerciseId)
      : [...favoriteExercises, exerciseId];
    
    setFavoriteExercises(newFavorites);
    await saveFavoriteExercises(newFavorites);
    
    Alert.alert(
      isCurrentlyFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      `${exercise.name} has been ${isCurrentlyFavorite ? 'removed from' : 'added to'} your favorites!`
    );
  };

  const startExerciseTimer = (exercise) => {
    Alert.alert(
      `Start ${exercise.name}`,
      `Ready to begin your ${exercise.duration} workout?\n\nThis will burn approximately ${exercise.calories}.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Start Workout',
          onPress: () => {
            Alert.alert(
              'Workout Started! 💪',
              `Timer started for ${exercise.name}. Good luck with your workout!`,
              [
                {
                  text: 'Complete Workout',
                  onPress: () => markExerciseComplete(exercise)
                }
              ]
            );
          },
        },
      ]
    );
  };

  const showExerciseOptions = (exercise) => {
    const isCompleted = completedExercises.includes(exercise.id);
    const isFavorite = favoriteExercises.includes(exercise.id);

    Alert.alert(
      exercise.name,
      `${exercise.difficulty} • ${exercise.duration} • ${exercise.calories}`,
      [
        {
          text: 'View Details',
          onPress: () => handleExercisePress(exercise.id),
        },
        {
          text: isCompleted ? 'Already Completed ✅' : 'Start Workout',
          onPress: () => isCompleted ? null : startExerciseTimer(exercise),
          style: isCompleted ? 'cancel' : 'default'
        },
        {
          text: isFavorite ? 'Remove from Favorites 💔' : 'Add to Favorites ❤️',
          onPress: () => toggleFavorite(exercise.id),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const getFilteredExercises = () => {
    switch (filterType) {
      case 'completed':
        return exercises.filter(ex => completedExercises.includes(ex.id));
      case 'favorites':
        return exercises.filter(ex => favoriteExercises.includes(ex.id));
      case 'beginner':
        return exercises.filter(ex => ex.difficulty === 'Beginner');
      case 'intermediate':
        return exercises.filter(ex => ex.difficulty === 'Intermediate');
      case 'advanced':
        return exercises.filter(ex => ex.difficulty === 'Advanced');
      case 'incomplete':
        return exercises.filter(ex => !completedExercises.includes(ex.id));
      default:
        return exercises;
    }
  };

  // Clear all user data (useful for testing or reset functionality)
  const clearUserData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(getStorageKey('completedExercises')),
        AsyncStorage.removeItem(getStorageKey('favoriteExercises')),
        AsyncStorage.removeItem(getStorageKey('dailyStats'))
      ]);
      
      setCompletedExercises([]);
      setFavoriteExercises([]);
      setDailyStats({ workouts: 0, calories: 0, minutes: 0 });
      
      Alert.alert('Success', 'All data has been cleared!');
    } catch (error) {
      console.error('Error clearing user data:', error);
      Alert.alert('Error', 'Failed to clear data.');
    }
  };

  const stats = [
    { label: 'Workouts', value: dailyStats.workouts.toString(), color: '#FF6B6B' },
    { label: 'Calories', value: dailyStats.calories > 1000 ? `${(dailyStats.calories/1000).toFixed(1)}k` : dailyStats.calories.toString(), color: '#4ECDC4' },
    { label: 'Minutes', value: dailyStats.minutes.toString(), color: '#45B7D1' },
  ];

  const handleSignout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?\n\nDon\'t worry, your progress will be saved!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            signout();
            navigation.replace('Welcome');
          },
        },
      ]
    );
  };

  const handleExercisePress = (exerciseId) => {
    navigation.navigate('ExerciseDetail', { exerciseId });
  };

  const FilterButton = ({ type, label, count }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filterType === type && styles.activeFilterButton
      ]}
      onPress={() => setFilterType(type)}
    >
      <Text style={[
        styles.filterButtonText,
        filterType === type && styles.activeFilterButtonText
      ]}>
        {label} {count > 0 && `(${count})`}
      </Text>
    </TouchableOpacity>
  );

  const ExerciseCard = ({ exercise, index }) => (
    <Animated.View
      style={[
        styles.exerciseCard,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity 
        style={[
          styles.cardContent, 
          { 
            borderLeftColor: exercise.color,
            opacity: completedExercises.includes(exercise.id) ? 0.8 : 1
          }
        ]}
        onPress={() => handleExercisePress(exercise.id)}
        onLongPress={() => showExerciseOptions(exercise)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
          <View style={styles.exerciseInfo}>
            <View style={styles.exerciseNameRow}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {favoriteExercises.includes(exercise.id) && (
                <Text style={styles.favoriteIcon}>❤️</Text>
              )}
              {completedExercises.includes(exercise.id) && (
                <Text style={styles.completedIcon}>✅</Text>
              )}
            </View>
            <Text style={styles.exerciseDifficulty}>{exercise.difficulty}</Text>
          </View>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exercise.duration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exercise.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const filteredExercises = getFilteredExercises();

  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header Section */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hi, Welcome Back</Text>
            <Text style={styles.userName}>{getUserName()}! 👋</Text>
          </View>
          <View style={styles.headerButtons}>
            {/* Add a reset button for testing purposes */}
            <TouchableOpacity 
              style={[styles.resetButton, { marginRight: 10 }]} 
              onPress={clearUserData}
            >
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleSignout}>
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Section */}
        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.statsRow}>
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: stat.color + '15' }]}>
                <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statText}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <Text style={styles.sectionTitle}>Exercise Filters</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <FilterButton type="all" label="All" count={exercises.length} />
            <FilterButton type="favorites" label="Favorites" count={favoriteExercises.length} />
            <FilterButton type="completed" label="Completed" count={completedExercises.length} />
            <FilterButton type="incomplete" label="Remaining" count={exercises.length - completedExercises.length} />
            <FilterButton type="beginner" label="Beginner" count={exercises.filter(ex => ex.difficulty === 'Beginner').length} />
            <FilterButton type="intermediate" label="Intermediate" count={exercises.filter(ex => ex.difficulty === 'Intermediate').length} />
            <FilterButton type="advanced" label="Advanced" count={exercises.filter(ex => ex.difficulty === 'Advanced').length} />
          </ScrollView>
        </View>

        {/* Exercises Section */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>
            {filterType === 'all' ? 'All Exercises' : 
             filterType === 'favorites' ? 'Favorite Exercises' :
             filterType === 'completed' ? 'Completed Exercises' :
             filterType === 'incomplete' ? 'Remaining Exercises' :
             `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Exercises`}
          </Text>
          <Text style={styles.sectionSubtitle}>
            Tap to view details • Long press for options
          </Text>
          
          {filteredExercises.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {filterType === 'favorites' ? 'No favorite exercises yet!' :
                 filterType === 'completed' ? 'No completed exercises today!' :
                 filterType === 'incomplete' ? 'All exercises completed! 🎉' :
                 'No exercises found!'}
              </Text>
            </View>
          ) : (
            filteredExercises.map((exercise, index) => (
              <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    opacity: 0.7,
  },
  resetText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  statsContainer: {
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statText: {
    fontSize: 12,
    color: '#a0a0a0',
    textTransform: 'uppercase',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#333344',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#4ECDC4',
  },
  filterButtonText: {
    color: '#a0a0a0',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#ffffff',
  },
  exercisesSection: {
    padding: 20,
  },
  exerciseCard: {
    marginBottom: 15,
  },
  cardContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  favoriteIcon: {
    fontSize: 12,
    marginLeft: 8,
  },
  completedIcon: {
    fontSize: 12,
    marginLeft: 4,
  },
  exerciseDifficulty: {
    fontSize: 14,
    color: '#a0a0a0',
    backgroundColor: '#333344',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#4ECDC4',
    fontWeight: 'bold',
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a0a0',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
  },
});