import React, { useState, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

export default function PeopleScreen() {
  const navigation = useNavigation<any>();
  const { people, cities, loading } = useData();
  const [query, setQuery] = useState('');

  const filteredPeople = useMemo(() => {
    return people.filter(p => (p.name || '').toLowerCase().includes(query.toLowerCase()));
  }, [people, query]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    const primaryCityName = item.primaryCityId ? cities.find(c => c.id === item.primaryCityId)?.name : null;
    return (
      <Pressable
        onPress={() => navigation.navigate('PersonDetail', { personId: item.id })}
        style={({ pressed }) => [styles.item, pressed && { backgroundColor: '#eee' }]}
      >
        <Text style={styles.name}>{item.name || '(No Name)'}</Text>
        <Text style={styles.city}>{primaryCityName || 'No city assigned'}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" style={{ marginHorizontal: 8 }} />
        <TextInput
          placeholder="Search people"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
        <Pressable
          onPress={() => navigation.navigate('Inbox')}
          style={styles.inboxButton}
        >
          <Ionicons name="mail" size={20} color="#007AFF" />
          <Text style={styles.inboxText}>Inbox</Text>
        </Pressable>
      </View>
      <FlatList
        data={filteredPeople}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>No people yet.</Text>}
      />
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditPerson')}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 0,
  },
  inboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  inboxText: {
    marginLeft: 4,
    color: '#007AFF',
    fontSize: 14,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 18,
  },
  city: {
    fontSize: 14,
    color: '#666',
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