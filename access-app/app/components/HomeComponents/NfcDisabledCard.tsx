import { View } from "react-native"
import { Surface, Icon } from "react-native-paper"
import { Text } from "../Text"
import { i18n } from "../../localization/locale"

export default function NfcDisabledCard() {
    return (
        <View style={{marginTop: 25, width: "100%", height: "23%", justifyContent: "center", alignItems: "center"}}>
            <Surface elevation={5} style={{width: "80%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", gap: 15, flexShrink: 1 }}>
                <Icon source="cellphone-nfc-off" size={55}/>
                <Text variant='titleMedium' textVariant='regular'>{i18n.t("NfcDisabledText")}</Text>
            </Surface>
        </View>
    )
}