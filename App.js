import 'react-native-gesture-handler';
import React from 'react';
import { Platform } from 'react-native';

// Style native browser scrollbars on web to match the app's green theme
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const s = document.createElement('style');
  s.textContent = `
    html, body { height: 100%; margin: 0; overflow: hidden; }
    #root { height: 100%; display: flex; flex-direction: column; }
    *::-webkit-scrollbar { width: 8px; height: 0; }
    *::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 4px; }
    *::-webkit-scrollbar-thumb { background: #f5c518; border-radius: 4px; }
    * { scrollbar-width: thin; scrollbar-color: #f5c518 rgba(255,255,255,0.1); }
  `;
  document.head.appendChild(s);
}
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
          headerTintColor: '#f5c518',
          headerTitleStyle: { fontWeight: '700' },
          cardStyle: { flex: 1, backgroundColor: '#0d0d1a' },
          contentStyle: { flex: 1, backgroundColor: '#0d0d1a' },
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
