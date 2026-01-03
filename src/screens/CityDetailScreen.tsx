import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { RootTabParamList, CitiesStackParamList } from '../navigation/RootNavigator';
import { openDeepLink } from '../utils/linking';

type CityDetailScreenRouteProp = RouteProp<CitiesStackParamList, 'CityDetail'>;

export default function CityDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<CityDetailScreenRouteProp>();
  const { cityId } = route.params;
  const { loading, cities, getPeopleByCity, getContactMethodsForPerson, contactMethods } = useData();
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }
  const city = cities.find(c => c.id === cityId);
  const people = getPeopleByCity(cityId).sort((a, b) => {
    const order: any = { GREEN: 0, YELLOW: 1, ARCHIVE: 2 };
    return order[a.tier] - order[b.tier];
  });
  return (
    <View style={styles.container}>
      <Text style={styles.cityName}>{city?.name}</Text>
      <FlatList
        data={people}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const methods = getContactMethodsForPerson(item.id);
          return (
            <View style={styles.personRow}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => navigation.navigate('PersonDetail', { personId: item.id })}
              >
                <Text style={styles.personName}>{item.name || '(No Name)'}</Text>
                <Text style={styles.tier}>Tier: {item.tier}</Text>
              </Pressable>
              <View style={styles.contactIcons}>
                {methods.map(method => {
                  const icon = getPlatformIcon(method.platform);
                  return (
                    <Pressable
                      key={method.id}
                      onPress={() => openDeepLink(method.deepLink)}
                      style={styles.iconButton}
                    >
                      <Ionicons name={icon} size={20} color="#007AFF" />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>No people in this city.</Text>}
      />
    </View>
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
    flex: 1,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  personName: {
    fontSize: 18,
  },
  tier: {
    fontSize: 12,
    color: '#777',
  },
  contactIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});