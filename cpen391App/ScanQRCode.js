import { RNCamera } from 'react-native-camera'
import React, { useCallback, useState } from 'react';
import {getSavedDevices,storeNewDevice, removeValue} from './LocalStorage'
import {
    Dimensions,
    StyleSheet,
    // Animated,
    View,
    Text,
    Button
} from 'react-native';
 

const win = Dimensions.get("window");
const screen_height = win.height;
const screen_width = win.width;


export default function ScanQRCode({navigation}) {
    const [flash, setFlash] = useState(false)
    let hasScanned = false;
    const onBarCodeRead = useCallback(async(result) => {
        if(!hasScanned){
            hasScanned=true;
            const { data } = result;
            const deviceJson = JSON.parse(data);
            await storeNewDevice(deviceJson);
            navigation.navigate('Existing Devices');
        }
    }, [])


    return (
        <View style={styles.container}>
            <RNCamera
                captureAudio={false}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                type={RNCamera.Constants.Type.back}
                flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                onBarCodeRead={onBarCodeRead}
            >
                <View style={styles.topview} >
                    <Text style={styles.text}>Recognizing QR Code ...</Text>
                </View>
 
                <View style={styles.middleview}>
                    <View style={styles.leftrightspace} />
                    <View style={{ width: '75%'}} />
                    <View style={styles.leftrightspace} />
                </View>
 
                <View style={styles.bottomview}>
                    <View style={styles.buttonspace} />
                    <Button onPress={() => {
                        setFlash(!flash)
                    }} color="#F5A83D" title={(flash ? 'Turn off ' : 'Turn on ') + 'flashlight'} />
                </View>
            </RNCamera>
        </View>
    )
}

  
const styles = StyleSheet.create({
    container: {
        width: screen_width,
        height: screen_height,
        flex: 1
    },
    topview:{
        width: screen_width, 
        height: (screen_height-3*screen_width/4)/2, 
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    middleview:{
        flexDirection: 'row', 
        width: screen_width, 
        height: 3*screen_width/4
    },
    bottomview:{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%', 
        height: (screen_height-3*screen_width/4)/2,
        alignItems: 'center'
    },
    buttonspace:{
        backgroundColor: 'rgba(0, 0, 0, 0)',
        width: screen_width,
        height: screen_height*0.08
    },
    leftrightspace:{
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '12.5%',
        height: 3*screen_width/4
    },
    text: {
        flex: 0,
        color: '#FFFFFF',
        marginTop: 3*(screen_height-3*screen_width/4)/8 ,
        fontSize: 25,
        textAlign: 'center'
    }
});
