import React from 'react';
import { useState, useEffect, useRef } from 'react'
import BTEnabledCard from './BTEnabledCard'
import BTDisabledCard from './BTDisabledCard'
import BTNotSupportedCard from './BTNotSupportedCard'
import AccountNotAllowedCard from './AccountNotAllowedCard';

//Bluetooth
import { BtManager } from '../../contexts/BluetoothContext';
import { useBluetooth } from '../../contexts/BluetoothContext';
import { useAuth } from '../../contexts/AuthContext';

export default function AccessCard() {
    const [bluetoothEnabled, setBluetoothEnabled] = useState<Boolean>()
    const [bluetoothSupported, setBluetoothSupported] = useState<Boolean>()
    const [bluetoothPermissions, setBluetoothPermissions] = useState<Boolean>()
    const { user } = useAuth();

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

    if(user.allowed) {
        if(bluetoothSupported) {
            if(bluetoothEnabled) {
                return <BTEnabledCard />
            } else {
                return <BTDisabledCard />
            }
        } else {
            return <BTNotSupportedCard />
        }
    } else {
        return <AccountNotAllowedCard />
    }
}