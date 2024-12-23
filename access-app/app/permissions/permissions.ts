import React from 'react';
import { PermissionsAndroid } from 'react-native';

export const requestBluetoothPermission = async () => {
    await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
    ])
}