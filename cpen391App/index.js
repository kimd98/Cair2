/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExistingDevicesPage from './ExistingDevicesPage';
import MainPage from './MainPage';
import LoginPage from './LoginPage';

AppRegistry.registerComponent(appName, () => App);

const Stack = createNativeStackNavigator();

function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator  initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginPage}  />
          <Stack.Screen name="Existing Devices" component={ExistingDevicesPage} />
          <Stack.Screen name="Dashboard" component={MainPage}  
            options={({ route }) => ({ title: route.params.name })} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }