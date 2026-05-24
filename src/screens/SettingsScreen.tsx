import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showNoRelationshipOnly, setShowNoRelationshipOnly] = useState(false);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Reminders</Text>
      <View style={styles.row}><Text style={styles.label}>Enable notifications</Text><Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} /></View>
      <Text style={styles.paragraph}>When enabled, Touchdown can remind you to follow up with people you haven’t contacted recently.</Text>
      <Text style={styles.header}>People Filters</Text>
      <View style={styles.row}><Text style={styles.label}>Highlight missing relationship type</Text><Switch value={showNoRelationshipOnly} onValueChange={setShowNoRelationshipOnly} /></View>
      <Text style={styles.paragraph}>Use this to curate contact records that still need relationship metadata.</Text>
      <Text style={styles.header}>Data</Text>
      <Text style={styles.paragraph}>All data remains local on your device. Relationship type is optional and nullable for imports.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({container:{padding:20},header:{fontSize:20,fontWeight:'bold',marginBottom:12,marginTop:4},paragraph:{fontSize:15,marginBottom:14,lineHeight:21,color:'#333'},row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10},label:{fontSize:16}});
