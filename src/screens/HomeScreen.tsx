import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useData } from '../context/DataContext';
import { getUpcomingTrip } from '../utils/date';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { loading, trips, cities, people, getPeopleByCity } = useData();
  if (loading) return <View style={styles.containerCentered}><ActivityIndicator /></View>;

  const upcomingTrip = getUpcomingTrip(trips);
  const dueContacts = people.filter(p => !p.lastContactedAt || ((Date.now() - new Date(p.lastContactedAt).getTime()) / 86400000) > 30);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>NOW</Text>
        <Text style={styles.info}>{dueContacts.length} people need contact follow-up</Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate('PeopleTab')}><Text style={styles.buttonText}>Review People</Text></Pressable>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Next Trip</Text>
        {upcomingTrip ? <Text style={styles.cityName}>{cities.find(c => c.id === upcomingTrip.cityId)?.name || 'Unknown City'} • {(getPeopleByCity(upcomingTrip.cityId) || []).length} contacts</Text> : <Text style={styles.info}>No upcoming trips</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({container:{flex:1,padding:16,gap:12,justifyContent:'center'},containerCentered:{flex:1,justifyContent:'center',alignItems:'center'},card:{padding:20,borderRadius:8,backgroundColor:'#f2f2f2'},title:{fontSize:20,fontWeight:'bold',marginBottom:8},cityName:{fontSize:18,fontWeight:'600'},info:{fontSize:15},button:{marginTop:10,backgroundColor:'#007AFF',paddingHorizontal:12,paddingVertical:8,borderRadius:4,alignSelf:'flex-start'},buttonText:{color:'#fff'}});
