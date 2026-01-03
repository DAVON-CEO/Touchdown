import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { useColorScheme } from 'react-native';
import { DataProvider } from './context/DataContext';
import RootNavigator from './navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const scheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <DataProvider>
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
          <RootNavigator />
        </NavigationContainer>
      </DataProvider>
    </SafeAreaProvider>
  );
}