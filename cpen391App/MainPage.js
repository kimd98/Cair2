import React, { useEffect, useState } from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  Text,
  HStack,
  VStack,
  ScrollView
} from 'native-base';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Notifications from './Notifications';
import ScrollContentViewNativeComponent from 'react-native/Libraries/Components/ScrollView/ScrollContentViewNativeComponent';

const config = {
  dependencies: {
    'linear-gradient': require('react-native-linear-gradient').default,
  },
};


let over1000 = false;

const MainPage = ({route, navigation}) => {

const {deviceId} = route.params; 

const [co2, setCO2] = useState([]);
const [people, setPeople] = useState([]);
const [lastUpdated, setLastUpdated] = useState([]);
const [graphData, setgraphData] = useState(new Array(24).fill(0));
const [graphView, setGraphView] = useState(<LineChart
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
/>);
// const graphData  = new Array(24).fill(0);
const getGraphData = async () => {

  const getAverage = (arr) => {
    let sum=0;
    for(let i=0;i<arr.length;i++){
      sum += arr[i].co2;
    }
    return sum/arr.length;
  }
  
  const getHalfHourAvg= (halfHour)=>{
    const endHalfHoursAgo =  Date.now() -(60000*30*(halfHour+1));
    const startHalfHoursAgo = Date.now() -(60000*30*halfHour);
    const xHalfHourData = jsonResponse.filter( (e)=>{ //x hour of data
      return  endHalfHoursAgo < e.time && e.time < startHalfHoursAgo;
    });
    return (xHalfHourData.length==0) ? 0 : getAverage(xHalfHourData);
  }

  const populateGraphData = ()=> {
    for(let i=0; i<graphData.length;i++){
      graphData[i] = getHalfHourAvg(i);
    }
    graphData.reverse();
    setgraphData(graphData);
  }

  const response = await fetch(`http://cpen391server-env.eba-pefitrhy.us-west-1.elasticbeanstalk.com/data/device${deviceId}`);
  const jsonResponse = await response.json();
  await jsonResponse.sort((a, b) => (b.time) - (a.time)); //sorting in decending order
  populateGraphData();
  const graphViewRender = <LineChart
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
setGraphView(graphViewRender);
};

const getCurrentData =async ()=>{

  const emptyResponse = {
    co2: "N/A",
    people:"N/A",
    time: Date.now()
  }

  const response = await fetch(`http://cpen391server-env.eba-pefitrhy.us-west-1.elasticbeanstalk.com/data/device${deviceId}/new`);
  const jsonResponse = await response.json();
  const lastData = jsonResponse || emptyResponse;
  const timePassed = Math.floor((Date.now() - lastData.time)/60000);  
  setCO2(lastData.co2);
  setPeople(lastData.people);
  setLastUpdated(timePassed);

  if(lastData.co2 > 1000 && !over1000){
    Notifications.sendNotification();
    over1000= true;
  } else{
    over1000=false;
  }
}

useEffect(()=>{
getCurrentData();
getGraphData();
setInterval(getCurrentData,10000); //polling every 10 seconds
setInterval(getGraphData,60000); //polling every minute
return () => {
  setCO2({}); 
  setPeople({});
  setLastUpdated({});
  setgraphData({});
};
},[]);

  return (
    <NativeBaseProvider config={config}>
    <ScrollView
            maxW="100%"
            h="100"
            _contentContainerStyle={{
              minW: '100%',
              minH: '100',
            }}>
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
        {graphView}
        </Box>
      </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
};
export default MainPage;
