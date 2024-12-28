import { View } from 'react-native'
import Text from "../../components/Text"
import i18n from '../../localization/locale'
import { useContext } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
    const { user } = useAuth();
    return (
        <View style={{ justifyContent: "center" , alignContent: "center", marginTop: 20, marginLeft: 15}}>
            <Text variant='headlineLarge' textVariant='bold'>
                {i18n.t('HomeGreeting', {name: `${user.firstName}` })}
            </Text>
        </View>
    )
}