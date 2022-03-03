import React, { useEffect, useState } from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  StatusBar,
} from 'native-base';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const config = {
  dependencies: {
    'linear-gradient': require('react-native-linear-gradient').default,
  },
};
const roomName = 'LIFE 3302 Lab';
const graphData = Array.from({length: 24}, () =>
  Math.floor(Math.random() * (1500 - 400 + 1) + 400),
);

const MainPage = () => {

const [co2, setCO2] = useState([]);
const [people, setPeople] = useState([]);
const [lastUpdated, setLastUpdated] = useState([]);

const getData = async () => {
  const response = await fetch("http://cpen391server-env.eba-pefitrhy.us-west-1.elasticbeanstalk.com/data/device1");
  const jsonResponse = await response.json()
  await jsonResponse.sort((a, b) => (b.time) - (a.time)); //sorting in decending order
  const lastData = jsonResponse[0];
  const timePassed = Math.floor((Date.now() - lastData.time)/60000);
  const twelveHoursAgo = Date.now() -(60000*60*12);
  const graphData = jsonResponse.filter((e)=>{ //filter only the last 12 hours of data
    return e.time > twelveHoursAgo;
  });
  //TODO: in the graphData you want to filter the data into half hour time fragments, calcuate the average for each one, and add as a point in the graph 
  console.log(graphData); 
  setCO2(lastData.co2);
  setPeople(lastData.people);
  setLastUpdated(timePassed);
};

useEffect(()=>{
getData();
});

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
        <>
          <StatusBar barStyle="dark-content" />
          <Box safeAreaTop shadow="7" w="100%" bg="white" alignItems="center">
            <HStack py="3" justifyContent="space-between" w="80%">
              <Heading isTruncated size="xl">
                {roomName}
              </Heading>
              <Icon name="edit" size={30} color="black" />
            </HStack>
          </Box>
        </>
        <Text width="80%" pb="1" pt="4" fontSize="md">
          CO2 Level
        </Text>
        <Box bg="white" shadow="9" rounded="md" width="80%" px="6" py="4">
          <VStack space="2">
            <HStack space="2" alignItems="center">
              <Heading ext size="4xl">
                {co2}
              </Heading>
              <Text fontSize="2xl">ppm</Text>
            </HStack>
            <Text fontSize="sm" textAlign="right">
              Last Updated: {lastUpdated} minutes ago
            </Text>
          </VStack>
        </Box>
        {/*number of people card*/}
        <Text width="80%" pb="1" pt="4" fontSize="md">
          Number of people
        </Text>
        <Box
          bg="white"
          alignItems="center"
          shadow="9"
          rounded="md"
          width="80%"
          px="6"
          py="4">
          <HStack space="2" alignItems="center">
            <Heading ext size="2xl">
              {people}
            </Heading>
            <Text fontSize="2xl">people</Text>
          </HStack>
        </Box>

        {/**/}
        <Text width="80%" pb="1" pt="4" fontSize="md">
          CO2 level history
        </Text>
        <Box>
          <LineChart
            data={{
              labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
              datasets: [
                {
                  data: graphData,
                },
              ],
            }}
            width={Dimensions.get('window').width * 0.8} // from react-native
            height={Dimensions.get('window').height * 0.35}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: 'black',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(7, 94, 169, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#CEDED8',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};
export default MainPage;
