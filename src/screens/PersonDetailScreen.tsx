import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { PeopleStackParamList, CitiesStackParamList } from '../navigation/RootNavigator';
import { openDeepLink } from '../utils/linking';

// Accept both navigations because PersonDetail can be opened from CitiesStack or PeopleStack
type PersonDetailRouteProp = RouteProp<PeopleStackParamList & CitiesStackParamList, 'PersonDetail'>;

export default function PersonDetailScreen() {
  const navigation = useNavigation<any>();
  const route: any = useRoute<PersonDetailRouteProp>();
  const { personId } = route.params;
  const { people, cities, getContactMethodsForPerson } = useData();
  const person = people.find(p => p.id === personId);
  if (!person) {
    return (
      <View style={styles.centered}>
        <Text>Person not found.</Text>
      </View>
    );
  }
  const contactMethods = getContactMethodsForPerson(person.id);
  const primaryCityName = person.primaryCityId ? cities.find(c => c.id === person.primaryCityId)?.name : null;
  const additionalCityNames = person.additionalCityIds
    .map(cid => cities.find(c => c.id === cid)?.name)
    .filter(Boolean) as string[];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{person.name || '(No Name)'}</Text>
        <Pressable
          onPress={() => navigation.navigate('AddEditPerson', { personId: person.id })}
          style={styles.editButton}
        >
          <Ionicons name="create" size={20} color="#007AFF" />
        </Pressable>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cities</Text>
        <Text style={styles.sectionValue}>{primaryCityName || 'None'}</Text>
        {additionalCityNames.length > 0 && (
          <Text style={styles.sectionValue}>
            Also: {additionalCityNames.join(', ')}
          </Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tier</Text>
        <Text style={styles.sectionValue}>{person.tier}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <Text style={styles.sectionValue}>{person.notes || 'None'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Methods</Text>
        {contactMethods.length === 0 ? (
          <Text style={styles.sectionValue}>No contact methods.</Text>
        ) : (
          contactMethods.map(method => {
            const icon = getPlatformIcon(method.platform);
            return (
              <Pressable
                key={method.id}
                onPress={() => openDeepLink(method.deepLink)}
                style={styles.contactRow}
              >
                <Ionicons name={icon} size={20} color="#007AFF" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactPlatform}>{method.platform}</Text>
                  <Text style={styles.contactValue}>{method.value}</Text>
                </View>
              </Pressable>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

function getPlatformIcon(platform: string): keyof typeof Ionicons.glyphMap {
  switch (platform) {
    case 'PHONE':
      return 'call';
    case 'SMS':
      return 'chatbox';
    case 'INSTAGRAM':
      return 'logo-instagram';
    case 'WHATSAPP':
      return 'logo-whatsapp';
    case 'TELEGRAM':
      return 'send';
    case 'LINKEDIN':
      return 'logo-linkedin';
    case 'TIKTOK':
      return 'logo-tiktok';
    case 'EMAIL':
      return 'mail';
    default:
      return 'call';
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#666',
  },
  sectionValue: {
    fontSize: 16,
    color: '#333',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactPlatform: {
    fontSize: 14,
    fontWeight: '600',
  },
  contactValue: {
    fontSize: 14,
    color: '#555',
  },
});