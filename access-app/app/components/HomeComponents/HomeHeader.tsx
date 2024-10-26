import { View } from 'react-native'
import { Text } from "../../components/Text"
import { i18n } from '../../localization/locale'
import { userInfo } from '../../api/user'

export default function Header() {
    return (
        <View style={{ justifyContent: "center" , alignContent: "center", marginTop: 10, marginLeft: 15}}>
            <Text variant='headlineLarge' textVariant='bold'>
                {i18n.t('HomeGreeting', {name: userInfo.firstName })}
            </Text>
        </View>
    )
}