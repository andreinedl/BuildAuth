import { View } from "react-native"
import PasswordInput from "./PasswordInput"
import { TextInput } from 'react-native-paper';
import { i18n } from "../../localization/locale";

export default function LoginInputs() {
    return (
            <View style={{ 
                paddingTop: 20, 
                justifyContent: 'space-between',
                alignContent: "center", 
                alignItems: "center", 
                gap: 10 
            }}>
                <TextInput 
                    label={i18n.t('LoginUsernamePlaceholder')} 
                    mode="outlined" 
                    style={{ 
                        width: "95%", 
                        height: 55 
                    }}
                />
                <PasswordInput label={i18n.t("LoginPasswordPlaceholder")} mode="outlined" 
                    style={{ 
                        width: "95%", 
                        height: 55 
                    }} />
            </View>
    )
}