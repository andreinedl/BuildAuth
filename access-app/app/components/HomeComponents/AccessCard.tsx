import { View } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { Surface, Icon } from 'react-native-paper'
//import { Text } from "../../components/Text"
import { Text } from 'react-native-paper'
import { i18n } from '../../localization/locale'
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import useInterval from 'use-interval'
import BTEnabledCard from './BTEnabledCard'
import BTDisabledCard from './BTDisabledCard'
import BTNotSupportedCard from './BTNotSupportedCard'
import { theme } from '../../theming/theme'

import LoadingCard from './LoadingCard'

export default function AccessCard() {
    const [nfcSupported, setNfcSupported] = useState<Boolean>(null);
    const [nfcStatus, setNfcStatus] = useState<Boolean>(null);

    return (
        <Text>xx</Text>
    )
}