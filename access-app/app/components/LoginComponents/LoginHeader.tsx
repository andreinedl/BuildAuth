import { Text } from "../Text"
import { View } from "react-native"
import { i18n } from "../../localization/locale";

export default function LoginHeader() {
    return (
        <View style={{ justifyContent: "center", alignContent: "center", alignItems:"center", marginTop: "10%"}} >
            <Text variant="displayMedium" textVariant="bold">
                {i18n.t('LoginGreetingH1')}
            </Text>
            <Text variant="titleLarge" textVariant="regular">
                {i18n.t('LoginGreetingH2')}
            </Text>
        </View>
    )
}

