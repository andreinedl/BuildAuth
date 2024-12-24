import { BleManager, Device, State } from 'react-native-ble-plx';
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

const serviceUUID: string = '0ffe0862-658c-4783-a3d6-9d31211c795f';
const LockStatusCharacteristicUUID: string = '3d46c16c-17ac-45c7-8638-0e75b4fed4e7';
const BtManager = new BleManager();

interface BluetoothType {
    // Methods
    requestBluetoothPermissions: () => Promise<Boolean>
    enableBluetooth: () => Promise<void>
    connectToDevice: () => void

    // Properties
    isConnected: Boolean;
    lostConnection: Boolean;
    bluetoothState: Boolean;
    lockStatus: Boolean;
    deviceRSSI: number;
}

const useBluetooth = () => {
    return useContext(BluetoothContext);
}

const BluetoothContext = createContext<BluetoothType>(undefined);

const BluetoothProvider = ({ children }: any) => {
    const [isConnected, setIsConnected] = useState<Boolean>(false);
    const [bluetoothState, setBluetoothState] = useState<Boolean>();
    const [lockStatus, setLockStatus] = useState<Boolean>(false);
    const [deviceRSSI, setDeviceRSSI] = useState<number>(0);
    const [lostConnection, setLostConnection] = useState<Boolean>(false);
    
    //monitor rssi task
    const intervalIdRef = useRef(null);

    const enableBluetooth = async () => {
      await BtManager.enable();
    };

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

    const connectToDevice = () => {
        BtManager.stopDeviceScan(); // Ensure any previous scan is stopped
        setLostConnection(false);
        console.log("Scanning for devices");
        BtManager.startDeviceScan(null, null, async (error, device) => {
            if (error) {
                console.log('Error', error);
                return;
            }
    
            if (device.name === 'BuildAuth') {
                BtManager.stopDeviceScan();
                device.connect()
                .then((device) => device.discoverAllServicesAndCharacteristics()
                .then((device) => {
                    setIsConnected(true);
                    monitorLockStatus(device);
                    monitorRSSI(device);
                    monitorDeviceDisconnection(device.id);
                }).catch((error) => {
                    console.log('Error', error);
                    setIsConnected(false);
                })
                )
            }
        })
    }

    const monitorLockStatus = (device: Device) => {
        if (device) {
            device.monitorCharacteristicForService(
                serviceUUID, 
                LockStatusCharacteristicUUID, 
                onChangeLockStatus);
        } else {
          console.log("No Device Connected");
        }
    };
    
    //inspired from https://github.com/friyiajr/BLESampleExpo/blob/main/useBLE.ts
    
    const onChangeLockStatus = (error, characteristic) : void => {
        if (error) {
            console.log('Error', error);
            return error;
        }
        if (characteristic) {
            let decodedData = atob(characteristic.value); // decode base64
            if(decodedData === "true") {
                setLockStatus(true);
            } else {
                setLockStatus(false);
            }
        }
    }

    const monitorRSSI = (device) => {
        if (device) {
          intervalIdRef.current = setInterval(() => {
            device.readRSSI()
              .then((device) => {
                console.log('RSSI', device.rssi);
                setDeviceRSSI(device.rssi);
              })
              .catch((error) => {
                console.log('Error', error);
                disconnect(device);
              });
          }, 2000);
        } else {
          disconnect(device);
        }
      };

    const stopMonitoringRSSI = () => {
        console.log('Stopping monitoring RSSI');
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      };

    //https://dotintent.github.io/react-native-ble-plx/#blemanagerondevicedisconnected
    const monitorDeviceDisconnection = (deviceId: string) => {
        BtManager.onDeviceDisconnected(deviceId, (error, device) => {
            if (error) {
                console.log('Error', error);
                return;
            }
            setIsConnected(false);
            setLostConnection(true);
        });
    }

    const disconnect = async (device) => {
        if (device) {
            try {
                console.log("Disconnecting from device");
                stopMonitoringRSSI();
                setIsConnected(false);
                setLostConnection(true);
                await device.cancelConnection();
            } catch (error) {
                console.log('Error', error);
            }
        }
    }
    
    const value = {
        enableBluetooth,
        requestBluetoothPermissions,
        connectToDevice,
        isConnected,
        lostConnection,
        bluetoothState,
        lockStatus,
        deviceRSSI,
	};

    return (
        <BluetoothContext.Provider value={value}>
            {children}
        </BluetoothContext.Provider>
    )
}

export default BluetoothProvider;
export { useBluetooth, BtManager };