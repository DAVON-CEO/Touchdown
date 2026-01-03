import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';

export default function InboxScreen() {
  const navigation = useNavigation<any>();
  const { people } = useData();
  const needsInfo = people.filter(p => !p.name || !p.primaryCityId);

  const renderItem = ({ item }: { item: any }) => {
    const missingName = !item.name;
    const missingCity = !item.primaryCityId;
    let subtitle = [] as string[];
    if (missingName) subtitle.push('missing name');
    if (missingCity) subtitle.push('missing city');
    return (
      <Pressable
        onPress={() => navigation.navigate('AddEditPerson', { personId: item.id })}
        style={({ pressed }) => [styles.item, pressed && { backgroundColor: '#eee' }]}
      >
        <Text style={styles.name}>{item.name || '(No Name)'}</Text>
        <Text style={styles.subtitle}>{subtitle.join(' & ')}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={needsInfo}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>No incomplete records!</Text>}
      />
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
  name: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
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