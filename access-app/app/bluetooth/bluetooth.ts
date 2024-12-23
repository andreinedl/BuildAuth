import { BleManager, State } from 'react-native-ble-plx';
import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

const serviceUUID: string = '0ffe0862-658c-4783-a3d6-9d31211c795f';
const LockStatusCharacteristicUUID: string = '3d46c16c-17ac-45c7-8638-0e75b4fed4e7';

interface Bluetooth {
  requestBluetoothPermissions: () => Promise<Boolean>;
  lockStatus: Boolean;
  isConnected: Boolean;
  BtManager: BleManager;
  enableBluetooth: () => Promise<void>;
}

function useBluetooth(): Bluetooth {
  const [lockStatus, setLockStatus] = useState<Boolean>(false); // false = unlocked, true = locked
  const [isConnected, setIsConnected] = useState<Boolean>(false);

  const BtManager = new BleManager();
  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Bluetooth Permission',
          message: 'This app needs access to your Bluetooth to connect to devices.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const enableBluetooth = async () => {
    await BtManager.enable();
  };

  return {
    requestBluetoothPermissions,
    lockStatus,
    isConnected,
    BtManager,
    enableBluetooth
  };
}

export default useBluetooth;