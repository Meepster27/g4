import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import ListScreen from './src/screens/ListScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#032541' },
          headerTintColor: '#01d277',
          headerTitleStyle: { fontWeight: '700' },
          cardStyle: { backgroundColor: '#0d0d1a' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '🎬 Movie Lists' }}
        />
        <Stack.Screen
          name="List"
          component={ListScreen}
          options={({ route }) => ({ title: route.params.listName })}
        />
        <Stack.Screen
          name="Detail"
          component={MovieDetailScreen}
          options={{ title: 'Movie Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
