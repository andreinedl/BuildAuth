import { View } from 'react-native'
import { Surface, Icon, Portal } from 'react-native-paper'
import theme from  '../theming/theme'

//Import components
import Header from '../components/HomeComponents/HomeHeader'
import AccessCard from '../components/HomeComponents/AccessCard'
import AccessLogs from '../components/HomeComponents/LogsMovementsSwitch'
import { useEffect } from 'react'
import { useBluetooth } from '../contexts/BluetoothContext'
import LogsMovementsSwitch from '../components/HomeComponents/LogsMovementsSwitch'
import PinModal from '../components/Modals/PinModal'

export default function Home() {
    const { connectToDevice } = useBluetooth();

    useEffect(() => {
        connectToDevice();
    }, [])

    return (
        <View style={{ backgroundColor: theme.colors.background, height: "100%", width: "100%", flex: 1, justifyContent: "center" }}>
            <Surface elevation={4} style={{
                backgroundColor: theme.colors.surface,
                width: "95%",
                height: "97%", 
                alignSelf: 'center',
                borderRadius: 20,
            }}>
                <Header />
                <AccessCard />
                <LogsMovementsSwitch />
            </Surface>
            <PinModal/>
        </View>
    )
}