import { View } from 'react-native'
import { Surface, Icon } from 'react-native-paper'

//Import from local files
import { Text } from "../components/Text"
import { theme } from '../theming/theme'
import { i18n } from '../localization/locale'

function Header() {
    return (
        <View style={{ justifyContent: "center" , alignContent: "center", alignItems: "center", marginTop: 30}}>
            <Text variant='displaySmall' textVariant='bold'>
                {i18n.t('HomeGreeting')}
            </Text>
        </View>
    )
}

function NfcDisabledTooltip() {
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

function AccessCard() {
    return (
        <View style={{marginTop: 25, width: "100%", height: "23%", justifyContent: "center", alignItems: "center"}}>
            <Surface elevation={5} style={{width: "80%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", gap: 15, flexShrink: 1 }}>
                <Icon source="contactless-payment-circle-outline" size={55}/>
                <Text variant='titleMedium' textVariant='regular'>{i18n.t("CardText")}</Text>
            </Surface>
        </View>
    )
}

function UserInfo() {
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

export default function Home() {
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
                <NfcDisabledTooltip />
                <AccessCard />
                <UserInfo />
            </Surface>
        </View>
    )
}