import { View } from "react-native"
import { Surface, Icon, Button } from "react-native-paper"
import Text from "../Text"
import i18n from "../../localization/locale"
import useBluetooth from "../../bluetooth/bluetooth"

export default function BTNoPermissionsCard() {
    const { requestBluetoothPermissions } = useBluetooth()

    return (
        <View style={{marginTop: 45, width: "100%", height: "25%", justifyContent: "center", alignItems: "center"}}>
            <Surface elevation={5} style={{width: "82%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", gap: 15, flexShrink: 1 }}>
                <Icon source="contactless-payment-circle-outline" size={55}/>
                <Text variant='titleMedium' textVariant='regular'>{i18n.t("BluetoothNoPermissionsText")}</Text>
                <Button mode="contained" onPress={requestBluetoothPermissions} theme={{ roundness: 2 }}>Give permissions</Button>
            </Surface>
        </View>
    )
}