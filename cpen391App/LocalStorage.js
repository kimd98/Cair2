import AsyncStorage from '@react-native-async-storage/async-storage';

//adding a new device we want to add device to storage
// 1. fetch existing devices -> turn it into list 
// 2. push new device into list
// 3. turn it back into json format -> store the new data

//retrieving device we want to get a list of all devices 
// 1. fetch existing devices -> turn it into list 

 // json format 
    //  [
    //   {name:"device1", deviceId:1},
    //   {name:"device2", deviceId:2},
    //    {name:"device3", deviceId:3}
    //  ]

// list format: [{name:"life 3301", deviceId:1},{name:"mcld 201", deviceId:2}];


    async function storeSavedDevices(value) {
        try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@saved_devices', jsonValue)
        } catch (e) {
        console.log("Error storing data in local storage")
        }
    }

    //value is in format {name:"", id: int}
    export async function storeNewDevice(value){
        let deviceList = await getSavedDevices();
        deviceList.push(value);
        await storeSavedDevices(deviceList);
    }
   

    
    export async function getSavedDevices() {
        try {
        const jsonValue = await AsyncStorage.getItem('@saved_devices')
        return jsonValue != null ? (JSON.parse(jsonValue)): [];
        } catch(e) {
            console.log("Error retrieving data in local storage")
        }
    }

    export async function removeValue (){
        try {
          await AsyncStorage.removeItem('@saved_devices')
        } catch(e) {
            console.log("Error removing data in local storage")
        }
      
        console.log('Done.')
      }
