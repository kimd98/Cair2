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
  Button,
} from 'native-base';
import SelectionIcon from './images/selection';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getSavedDevices,storeNewDevice} from './LocalStorage'

const config = {
  dependencies: {
    'linear-gradient': require('react-native-linear-gradient').default,
  },
};
//const savedDevices = [{name:"life 3301", deviceId:1},{name:"mcld 201", deviceId:2}];
let savedDevices;
const ExistingDevicesPage = ({navigation}) => {
  const [buttons, setButtons] = useState([]);

  useEffect(()=>{
  
  renderButtons();
  return () => {
    setButtons(<></>);
  };
  },[]);

  const renderButtons = async () => {
  //await storeNewDevice({name:"LAB 3301",deviceId:1});
  savedDevices = await getSavedDevices();
    console.log(savedDevices);

    const views = [];
    for (let i = 0; i < savedDevices.length; i++) {
      views.push(
        <Button
          bg="white"
          alignItems="center"
          shadow="9"
          rounded="md"
          width="80%"
          colorScheme="dark"
          px="6"
          py="4"
          mb="3"
          key={i}
          onPress={() => navigation.navigate('Dashboard', savedDevices[i])}>
          <HStack space="2" alignItems="center">
            <Text fontSize="2xl">{savedDevices[i].name}</Text>
          </HStack>
        </Button>,
      );
    }
    setButtons(views);
  };

  return (
    <NativeBaseProvider config={config}>
      <Box
        flex={1}
        bg={{
          linearGradient: {
            colors: ['#CEDED8', '#075EA9'],
            start: [0, 0],
            end: [0, 1],
          },
        }}
        alignItems="center">
        {/* <>
          <StatusBar barStyle="dark-content" />
          <Box safeAreaTop shadow="7" w="100%" bg="white" alignItems="center">
            <HStack py="3" justifyContent="space-between" w="80%">
              <Heading isTruncated size="xl">
                Existing Devices
              </Heading>
            </HStack>
          </Box>
        </> */}

        {/*device card button*/}
        <Text width="80%" textAlign="center" pb="3" pt="4" fontSize="md">
          Select a device from the following list
        </Text>
        <Box height="50%" mb="7">
          <ScrollView
            maxW="100%"
            h="100"
            _contentContainerStyle={{
              mb: '4',
              minW: '80%',
              minH: '100',
              alignItems: 'center',
            }}>
            {buttons}
          </ScrollView>
        </Box>
        <SelectionIcon height="20%" />
      </Box>
    </NativeBaseProvider>
  );
};
export default ExistingDevicesPage;
