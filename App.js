import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/SignUpScreen';
import ChatScreen from './screens/ChatScreen';
import FunctionScreen from './screens/FunctionScreen';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={{
        tabBarActiveTintColor: '#1e3a8a',
        tabBarIndicatorStyle: { backgroundColor: '#1e3a8a', height: 4, borderRadius: 2 },
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 16, marginTop:20 },
        tabBarStyle: { height: 60 }, // <-- aumenta a altura da barra das abas
        swipeEnabled: true,
        animationEnabled: true,
        tabBarIndicatorContainerStyle: { backgroundColor: '#e0e7ff' },
      }}
      sceneContainerStyle={{
        backgroundColor: '#f9fafb',
      }}
    >
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Recursos" component={FunctionScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
