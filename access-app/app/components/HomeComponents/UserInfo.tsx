import { View } from "react-native"
import { Text } from "../Text"
import { i18n } from "../../localization/locale"


export default function UserInfo() {
    return(
        <View>
            <Text variant='titleMedium' textVariant='regular'>
                {i18n.t("UserInfo")}
            </Text>
            <Text variant='bodyLarge' textVariant='regular'>
                {i18n.t("AuthenticatedAs", { name: "Lorem Ipsum"} )}
            </Text>
            <Text variant='bodyLarge' textVariant='regular'>
                {i18n.t("Username", { username: "loremimpsum123"} )}
            </Text>
            <Text variant='bodyLarge' textVariant='regular'>
                {i18n.t("LastAccess", { lastUnlockTime: "sometime..."} )}
            </Text>
        </View>
    )
}