import { View } from "react-native"
import { Surface, Icon, Button } from "react-native-paper"
import Text from "../Text"
import i18n from "../../localization/locale"
import theme from  "../../theming/theme"

//blueooth
import { useBluetooth } from '../../contexts/BluetoothContext'

export default function BTDisabledCard() {
    const { enableBluetooth } = useBluetooth()

    return (
        <View style={{marginTop: 45, width: "100%", height: "25%", justifyContent: "center", alignItems: "center"}}>
            <Surface elevation={5} style={{width: "82%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", gap: 15, flexShrink: 1 }}>
                <Icon source="bluetooth-off" size={55}/>
                <Text variant='titleMedium' textVariant='regular'>{i18n.t("BluetoothDisabledText")}</Text>
                <Button mode="contained" onPress={enableBluetooth} theme={{ roundness: 2 }}>Enable</Button>
            </Surface>
        </View>
    )
}