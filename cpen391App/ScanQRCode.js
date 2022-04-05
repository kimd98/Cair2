import { RNCamera } from 'react-native-camera'
import React, { useCallback, useState } from 'react';
import {getSavedDevices,storeNewDevice, removeValue} from './LocalStorage'
import {
    StyleSheet,
    Animated,
    View,
    Text,
    Button
} from 'react-native';
 

export default function ScanQRCode({navigation}) {
    const [flash, setFlash] = useState(false)
    let hasScanned = false;
    const onBarCodeRead = useCallback(async(result) => {
        if(!hasScanned){
            hasScanned=true;
        const { data } = result;
        const deviceJson = JSON.parse(data);
        //await removeValue();
        await storeNewDevice(deviceJson);
        navigation.navigate('Existing Devices');
        }
    }, [])


    return (
        <View style={styles.container}>
            <RNCamera
                captureAudio={false}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                style={[styles.preview]}
                type={RNCamera.Constants.Type.back}
                flashMode={flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                onBarCodeRead={onBarCodeRead}
            >
                <View style={{
                    width: 500,
                    height: '20%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }} />
 
                <View style={[{ flexDirection: 'row' }]}>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', height: 300, width: 300 }} />
                    <View style={{ width: 300, height: 300 }}>
                    {/*  */}
                    </View>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', height: 300, width: 300 }} />
                </View>
 
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: 500, alignItems: 'center' }}>
                    <Text style={styles.rectangleText}>Recognizing QR Code ...</Text>
                    <View style={{ backgroundColor: 'rgba(0,0,0,0)', height: 30, width: 500 }} />
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
        flex: 1,
        flexDirection: 'row'
    },
    preview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangleContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rectangle: {
        height: '20%',
        width: 200,
        borderWidth: 1,
        borderColor: '#7687AD',
        backgroundColor: 'transparent',
        borderRadius: 10,
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10,
        fontSize: 25
    },
    border: {
        flex: 0,
        width: 196,
        height: 2,
        backgroundColor: '#7687AD',
        borderRadius: 50
    }
});
