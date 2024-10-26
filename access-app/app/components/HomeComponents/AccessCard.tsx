import { View } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { Surface, Icon } from 'react-native-paper'
import { Text } from "../../components/Text"
import { i18n } from '../../localization/locale'
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import useInterval from 'use-interval'
import NfcEnabledCard from './NfcEnabledCard'
import NfcDisabledCard from './NfcDisabledCard'
import NfcNotSupportedCard from './NfcNotSupportedCard'
import { theme } from '../../theming/theme'

import NfcManager from 'react-native-nfc-manager'
import LoadingCard from './LoadingCard'

export default function AccessCard() {
    const [nfcSupported, setNfcSupported] = useState<Boolean>(null);
    const [nfcStatus, setNfcStatus] = useState<Boolean>(null);

    //Check NFC device support
    async function checkNfcSupport() {
        const supported = await NfcManager.isSupported();
        setNfcSupported(supported);
    }

    async function checkNfcStatus() {
        if(nfcSupported == true) {
            const status = await NfcManager.isEnabled();
            setNfcStatus(status);
        }
    }
    // Check NFC state periodically
    useInterval(() => {
        checkNfcStatus();
    }, 1000); // Check every second

    useEffect(() => {
        //Check NFC Support at launch
        checkNfcSupport();
    }, []);


    if(nfcSupported) {
        if(nfcStatus == false) {
            return <NfcDisabledCard />
        } else {
            return <NfcEnabledCard />
        }
    } else if(nfcSupported == false) {
        return <NfcNotSupportedCard />
    } else {
        return <LoadingCard />
    }
}