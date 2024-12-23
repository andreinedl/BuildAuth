// access-app/app/components/LoginComponents/LoginInputs.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity } from "react-native";
import { TextInput, Icon } from 'react-native-paper';
import i18n from "../../localization/locale";

export default function LoginInputs({username, password, setUsername, setPassword}) {
    const [passwordHidden, setPasswordHidden] = useState(true)

    function togglePasswordVisibility() {
        {passwordHidden ? setPasswordHidden(false) : setPasswordHidden(true)}
    }

    function EyeComponent() {
        return (
            <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon source="eye" size={20}/>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ 
            paddingTop: 20, 
            justifyContent: 'space-between',
            alignContent: "center", 
            alignItems: "center", 
            gap: 10 
        }}>
            {/*Username input*/}
            <TextInput
                label={i18n.t('LoginUsernamePlaceholder')} 
                mode="outlined" 
                style={{ 
                    width: "95%", 
                    height: 55 
                }}
                value={username}
                onChangeText={username => setUsername(username)}
            />
            {/*Password input*/}
            <TextInput 
                label={i18n.t("LoginPasswordPlaceholder")}
                secureTextEntry={passwordHidden}
                right={<TextInput.Icon icon={passwordHidden ? "eye-outline" : "eye-off-outline"} onPress={togglePasswordVisibility}/>}
                mode="outlined"
                style={{ 
                    width: "95%", 
                    height: 55 
                }}
                value={password}
                onChangeText={password => setPassword(password)}
            />
        </View>
    )
};