import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CitiesScreen from '../screens/CitiesScreen';
import CityDetailScreen from '../screens/CityDetailScreen';
import PeopleScreen from '../screens/PeopleScreen';
import PersonDetailScreen from '../screens/PersonDetailScreen';
import AddEditPersonScreen from '../screens/AddEditPersonScreen';
import InboxScreen from '../screens/InboxScreen';
import TripsScreen from '../screens/TripsScreen';
import AddEditTripScreen from '../screens/AddEditTripScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Define param types for navigation
export type RootTabParamList = {
  HomeTab: undefined;
  CitiesTab: undefined;
  PeopleTab: undefined;
  TripsTab: undefined;
  SettingsTab: undefined;
};

export type CitiesStackParamList = {
  Cities: undefined;
  CityDetail: { cityId: string };
  PersonDetail: { personId: string };
  AddEditPerson: { personId?: string; initialCityId?: string };
};

export type PeopleStackParamList = {
  People: undefined;
  PersonDetail: { personId: string };
  AddEditPerson: { personId?: string };
  Inbox: undefined;
};

export type TripsStackParamList = {
  Trips: undefined;
  AddEditTrip: { tripId?: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const CitiesStack = createNativeStackNavigator<CitiesStackParamList>();
const PeopleStack = createNativeStackNavigator<PeopleStackParamList>();
const TripsStack = createNativeStackNavigator<TripsStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

// Cities stack component
function CitiesNavigator() {
  return (
    <CitiesStack.Navigator>
      <CitiesStack.Screen name="Cities" component={CitiesScreen} options={{ title: 'Cities' }} />
      <CitiesStack.Screen name="CityDetail" component={CityDetailScreen} options={{ title: 'City' }} />
      <CitiesStack.Screen name="PersonDetail" component={PersonDetailScreen} options={{ title: 'Person' }} />
      <CitiesStack.Screen name="AddEditPerson" component={AddEditPersonScreen} options={{ title: 'Person' }} />
    </CitiesStack.Navigator>
  );
}

// People stack component
function PeopleNavigator() {
  return (
    <PeopleStack.Navigator>
      <PeopleStack.Screen name="People" component={PeopleScreen} options={{ title: 'People' }} />
      <PeopleStack.Screen name="PersonDetail" component={PersonDetailScreen} options={{ title: 'Person' }} />
      <PeopleStack.Screen name="AddEditPerson" component={AddEditPersonScreen} options={{ title: 'Person' }} />
      <PeopleStack.Screen name="Inbox" component={InboxScreen} options={{ title: 'Needs Info' }} />
    </PeopleStack.Navigator>
  );
}

// Trips stack component
function TripsNavigator() {
  return (
    <TripsStack.Navigator>
      <TripsStack.Screen name="Trips" component={TripsScreen} options={{ title: 'Trips' }} />
      <TripsStack.Screen name="AddEditTrip" component={AddEditTripScreen} options={{ title: 'Trip' }} />
    </TripsStack.Navigator>
  );
}

// Settings stack component
function SettingsNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </SettingsStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'CitiesTab') iconName = 'business';
          else if (route.name === 'PeopleTab') iconName = 'people';
          else if (route.name === 'TripsTab') iconName = 'airplane';
          else iconName = 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="CitiesTab" component={CitiesNavigator} options={{ title: 'Cities' }} />
      <Tab.Screen name="PeopleTab" component={PeopleNavigator} options={{ title: 'People' }} />
      <Tab.Screen name="TripsTab" component={TripsNavigator} options={{ title: 'Trips' }} />
      <Tab.Screen name="SettingsTab" component={SettingsNavigator} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}