import React, { useState, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

export default function PeopleScreen() {
  const navigation = useNavigation<any>();
  const { people, cities, loading } = useData();
  const [query, setQuery] = useState('');
  const [lens, setLens] = useState<'ALL' | 'MISSING_REL'>('ALL');

  const filteredPeople = useMemo(() => {
    return people.filter(p => {
      const nameMatch = (p.name || '').toLowerCase().includes(query.toLowerCase());
      const lensMatch = lens === 'ALL' ? true : !p.relationshipType;
      return nameMatch && lensMatch;
    });
  }, [people, query, lens]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filteredPeople> = {};
    for (const p of filteredPeople) {
      const key = p.primaryCityId ? (cities.find(c => c.id === p.primaryCityId)?.name || 'Unknown City') : 'No City';
      groups[key] = groups[key] || [];
      groups[key].push(p);
    }
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredPeople, cities]);

  if (loading) return <View style={styles.centered}><ActivityIndicator /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" style={{ marginHorizontal: 8 }} />
        <TextInput placeholder="Search people" style={styles.searchInput} value={query} onChangeText={setQuery} />
      </View>
      <View style={styles.lensRow}>
        <Pressable onPress={() => setLens('ALL')} style={[styles.lensBtn, lens === 'ALL' && styles.lensBtnActive]}><Text>All</Text></Pressable>
        <Pressable onPress={() => setLens('MISSING_REL')} style={[styles.lensBtn, lens === 'MISSING_REL' && styles.lensBtnActive]}><Text>No relationship type</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Inbox')} style={styles.inboxButton}><Ionicons name="mail" size={18} color="#007AFF" /></Pressable>
      </View>
      <FlatList
        data={grouped}
        keyExtractor={item => item[0]}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.groupHeader}>{item[0]} ({item[1].length})</Text>
            {item[1].map(person => (
              <Pressable key={person.id} onPress={() => navigation.navigate('PersonDetail', { personId: person.id })} style={styles.item}>
                <Text style={styles.name}>{person.name || '(No Name)'}</Text>
                <Text style={styles.city}>{person.relationshipType || 'No relationship type'}</Text>
              </Pressable>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No people found.</Text>}
      />
      <Pressable style={styles.fab} onPress={() => navigation.navigate('AddEditPerson')}><Ionicons name="add" size={24} color="#fff" /></Pressable>
    </View>
  );
}
const styles = StyleSheet.create({container:{flex:1},centered:{flex:1,justifyContent:'center',alignItems:'center'},searchContainer:{flexDirection:'row',alignItems:'center',paddingHorizontal:8,paddingVertical:6,borderBottomWidth:1,borderColor:'#eee'},searchInput:{flex:1,height:40},lensRow:{flexDirection:'row',alignItems:'center',padding:8,gap:8},lensBtn:{paddingHorizontal:10,paddingVertical:6,borderWidth:1,borderColor:'#ddd',borderRadius:12},lensBtnActive:{backgroundColor:'#eef6ff',borderColor:'#007AFF'},inboxButton:{marginLeft:'auto',padding:6},groupHeader:{fontWeight:'700',fontSize:15,paddingHorizontal:16,paddingTop:10,paddingBottom:4,color:'#333'},item:{paddingVertical:10,paddingHorizontal:20,borderBottomWidth:1,borderColor:'#f0f0f0'},name:{fontSize:17},city:{fontSize:13,color:'#666'},empty:{textAlign:'center',marginTop:20,color:'#888'},fab:{position:'absolute',right:20,bottom:20,backgroundColor:'#007AFF',width:56,height:56,borderRadius:28,justifyContent:'center',alignItems:'center'}});
