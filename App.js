/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Button,
  Platform
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import wifi from 'react-native-android-wifi';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isWifiNetworkEnabled, setIsWifiNetworkEnabled] = useState(null)
  const onNetworkConnectionChange = isOnline => {
    setIsConnected(isOnline.isConnected);
  };

  NetInfo.fetch().then(state => {
    if (isConnected !== state.isConnected) {
      onNetworkConnectionChange(state.isConnected);
    }
  }).catch(err => setIsConnected(false));

  useEffect(() => {
    const removeEventListener = NetInfo.addEventListener(onNetworkConnectionChange);
    if(Platform.OS === 'android') {
      askForUserPermissions();
    }
    return () => {
      removeEventListener();
    };
  }, [isConnected]);

  
  const  askForUserPermissions = async() => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Wifi networks',
          'message': 'We need your permission in order to find wifi networks'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        wifi.isEnabled((isEnable) => {
          setIsWifiNetworkEnabled(isEnable)
        })
        
      } else {
        console.log("You will not able to retrieve wifi available networks list");
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const wifiDisable = () => {
    if(Platform.OS === 'android') {
      wifi.setEnabled(false);
      setIsWifiNetworkEnabled(false)
    }
  }

  const wifiEnable = () => {
    if(Platform.OS === 'android') {
      wifi.setEnabled(true);
      setIsWifiNetworkEnabled(true)
    }
  }

  return(
    <View style={{flex:1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
      <Text>{`Network connection: ${isConnected}`}</Text>
      <Text>{` wifi Network connection: ${isWifiNetworkEnabled}`}</Text>

      <Button
          title="Wifi ON"
          onPress={wifiEnable}
        />
      <Button
          title="Wifi OFF"
          onPress={wifiDisable}
        />  
    </View>
  )
}

export default App;
