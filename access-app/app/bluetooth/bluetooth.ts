import { BleManager } from 'react-native-ble-plx'
import { Platform, PermissionsAndroid } from 'react-native'
import { useToast } from 'react-native-paper-toast';

export const manager = new BleManager()
const serviceUUID = '0ffe0862-658c-4783-a3d6-9d31211c795f';  
const characteristicUUID = '3d46c16c-17ac-45c7-8638-0e75b4fed4e7'; 

const requestBluetoothPermission = async () => {
  const toast = useToast(); // https://github.com/kuasha420/react-native-paper-toast
  if (Platform.OS === 'ios') {
    return true
  }
  if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
    const apiLevel = parseInt(Platform.Version.toString(), 10)

    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      return granted === PermissionsAndroid.RESULTS.GRANTED
    }
    if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ])

      return (
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
      )
    }
  }

  toast.show({ message: "No permissions", duration: 2000, type: 'success' });

  return false
}

export function connectToDevice() {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.log(error)
      return
    }
    if (device.name === 'BuildAuth') {
      manager.stopDeviceScan()
      device.connect()
        .then((device) => device.discoverAllServicesAndCharacteristics())
        .then((device) => {
          monitorDevice(device.id)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  })  
}

export async function monitorDevice(deviceID) {
  await manager.monitorCharacteristicForDevice(deviceID, serviceUUID, characteristicUUID, (error, characteristic) => {
    if (error) {
      console.log(error)
      return
    }
    console.log('Value: ', atob(characteristic.value))
  })
}