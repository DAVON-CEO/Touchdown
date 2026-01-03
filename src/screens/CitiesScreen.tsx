import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';

export default function CitiesScreen() {
  const navigation = useNavigation<any>();
  const { loading, cities, getPeopleByCity } = useData();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    const count = getPeopleByCity(item.id).length;
    return (
      <Pressable
        onPress={() => navigation.navigate('CityDetail', { cityId: item.id })}
        style={({ pressed }) => [styles.item, pressed && { backgroundColor: '#eee' }]}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.count}>{count} {count === 1 ? 'person' : 'people'}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cities}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>No cities yet. Add people to create cities.</Text>}
      />
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
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  count: {
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
});