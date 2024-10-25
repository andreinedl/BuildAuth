import { View } from 'react-native'
import { Text } from "../../components/Text"
import { i18n } from '../../localization/locale'

export default function Header() {
    return (
        <View style={{ justifyContent: "center" , alignContent: "center", alignItems: "center", marginTop: 30}}>
            <Text variant='displaySmall' textVariant='bold'>
                {i18n.t('HomeGreeting')}
            </Text>
        </View>
    )
}