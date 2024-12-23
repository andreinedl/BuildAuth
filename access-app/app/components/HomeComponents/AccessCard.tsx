import React from 'react';
import { View } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { Surface, Icon } from 'react-native-paper'
//import Text from "../../components/Text"
import Text from 'react-native-paper'
import i18n from '../../localization/locale'
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import useInterval from 'use-interval'
import BTEnabledCard from './BTEnabledCard'
import BTDisabledCard from './BTDisabledCard'
import BTNotSupportedCard from './BTNotSupportedCard'
import theme from  '../../theming/theme'
import useBluetooth from '../../bluetooth/bluetooth';
import LoadingCard from './LoadingCard'

export default function AccessCard() {
    const { BtManager } = useBluetooth()

    const [bluetoothEnabled, setBluetoothEnabled] = useState<Boolean>()
    const [bluetoothSupported, setBluetoothSupported] = useState<Boolean>()
    const [bluetoothPermissions, setBluetoothPermissions] = useState<Boolean>()

    useEffect(() => {
        const subscription = BtManager.onStateChange((state) => {
          switch (state) {
            case 'PoweredOn':
              setBluetoothPermissions(true);
              setBluetoothSupported(true);
              setBluetoothEnabled(true);
              break;
            case 'PoweredOff':
              setBluetoothPermissions(true);
              setBluetoothSupported(true);
              setBluetoothEnabled(false);
              break;
            case 'Unsupported':
              setBluetoothPermissions(true);
              setBluetoothSupported(false);
              setBluetoothEnabled(false);
              break;
            case 'Unauthorized':
              setBluetoothPermissions(false);
              setBluetoothSupported(true);
              setBluetoothEnabled(false);
              break;
            default:
              break;
          }
        }, true);
    
        return () => {
          subscription.remove();
        };
      }, [BtManager]);

    return (
        <>
            {bluetoothSupported ? (
                bluetoothEnabled ? (
                    <BTEnabledCard />
                ) : (
                    <BTDisabledCard />
                )
            ) : (
                <BTNotSupportedCard />
            )}
        </>
    )
}