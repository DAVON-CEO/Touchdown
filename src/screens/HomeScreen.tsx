import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import { getUpcomingTrip } from '../utils/date';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { loading, trips, cities, getPeopleByCity } = useData();
  if (loading) {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator />
      </View>
    );
  }
  const upcomingTrip = getUpcomingTrip(trips);
  let content;
  if (upcomingTrip) {
    const city = cities.find(c => c.id === upcomingTrip.cityId);
    const peopleCount = city ? getPeopleByCity(city.id).length : 0;
    content = (
      <View style={styles.card}>
        <Text style={styles.title}>Next Trip</Text>
        <Text style={styles.cityName}>{city?.name || 'Unknown City'}</Text>
        <Text style={styles.info}>{peopleCount} known {peopleCount === 1 ? 'person' : 'people'}</Text>
        <Pressable
          style={styles.button}
          onPress={() => {
            if (city) {
              // Navigate to city detail in Cities tab
              navigation.navigate('CitiesTab', {
                screen: 'CityDetail',
                params: { cityId: city.id },
              });
            }
          }}
        >
          <Text style={styles.buttonText}>View City</Text>
        </Pressable>
      </View>
    );
  } else {
    content = (
      <View style={styles.card}>
        <Text style={styles.title}>No Upcoming Trips</Text>
        <Text style={styles.info}>Schedule a trip to plan your connections.</Text>
      </View>
    );
  }
  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cityName: {
    fontSize: 28,
    fontWeight: '600',
    marginVertical: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});