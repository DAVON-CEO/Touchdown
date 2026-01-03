import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/date';
import { Ionicons } from '@expo/vector-icons';

export default function TripsScreen() {
  const navigation = useNavigation<any>();
  const { trips, cities } = useData();
  const sortedTrips = [...trips].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const renderItem = ({ item }: { item: any }) => {
    const city = cities.find(c => c.id === item.cityId);
    return (
      <Pressable
        onPress={() => navigation.navigate('AddEditTrip', { tripId: item.id })}
        style={({ pressed }) => [styles.item, pressed && { backgroundColor: '#eee' }]}
      >
        <Text style={styles.city}>{city?.name || 'Unknown'}</Text>
        <Text style={styles.dates}>{formatDate(item.startDate)} → {formatDate(item.endDate)}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTrips}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>No trips yet.</Text>}
      />
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditTrip')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  city: {
    fontSize: 18,
  },
  dates: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 4,
  },
});