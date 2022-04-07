import React, {useEffect, useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  Text,
  HStack,
  ScrollView,
  VStack,
  StatusBar,
  Divider,
  Button,
  Image,
} from 'native-base';
import SelectionIcon from './images/logoFinal';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getSavedDevices,storeNewDevice} from './LocalStorage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const config = {
  dependencies: {
    'linear-gradient': require('react-native-linear-gradient').default,
  },
};

const LoginPage = ({navigation}) => {
//Cair2: CO2 monitor for covid-19 mitigation
  return (
    <NativeBaseProvider config={config}>
      <Box
        flex={1}
        bg="blueGray.800"
        alignItems="center">
    
        <Box bg="red" height="50%" py="7">  
        {/* <Image width="350" height="250" source={logo} alt="logo"/> */}
        <SelectionIcon height="100%"/>
        </Box>   
        <Box
        borderRadius={12}
         flex={1}
         width="100%"
         alignItems="center"
         borderBottomLeftRadius={0}
         borderBottomRightRadius={0}
         bg={{
          linearGradient: {
            colors: ['#679CC0', '#075EA9'],
            start: [0, 0],
            end: [0, 1],
          },
        }}>
        <Text width="80%" color="cyan.900" textAlign="center" pb="1" pt="4" fontSize="lg">
          Login to a new device
        </Text>
        <Text width="80%" color="cyan.900" textAlign="center" pb="3" fontSize="md">
          scan QR code on the device to login
        </Text>
        <Button  variant="subtle"  onPress={() => navigation.navigate('QR code scanning')} leftIcon={<Icon name="qrcode-scan" size={30} color="#06b6d4" />}>
      Add new device
      </Button>
        <Text width="80%" color="cyan.900" textAlign="center" pb="3" pt="4" fontSize="lg">
          OR
        </Text>

        <Button  variant="subtle" onPress={() => navigation.navigate('Existing Devices')} leftIcon={<Icon name="folder-clock-outline" size={30} color="#06b6d4" />}>
      Open Existing Device
      </Button>
     </Box>
      </Box>
    </NativeBaseProvider>
  );
};
export default LoginPage;
