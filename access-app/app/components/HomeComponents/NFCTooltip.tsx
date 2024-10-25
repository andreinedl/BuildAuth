import { View } from 'react-native'
import { Surface, Icon } from 'react-native-paper'
import { Text } from "../Text"
import { i18n } from '../../localization/locale'

export default function NFCTooltip() {
    return (    
        <View style={{ alignContent: "center", alignItems: "center", marginTop: 12}}>
            <Surface elevation={4} mode={"flat"} style={{ justifyContent: "center", alignContent: "center", alignItems: "center", width: "80%"}}>
                <Text variant='titleMedium' textVariant='regular'>
                    <Icon source="access-point-off" size={40}/>
                    {` ${i18n.t("NfcDisabled")} `}
                </Text>
            </Surface>
        </View>
    )
}
