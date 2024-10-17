import { TouchableOpacity, View,  } from 'react-native';
import { TextInput, Icon } from 'react-native-paper';
import { useState } from 'react';

export default function PasswordInput(props) {
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
        <TextInput 
            label={props.label}
            secureTextEntry={passwordHidden}
            right={<TextInput.Icon icon={passwordHidden ? "eye-outline" : "eye-off-outline"} onPress={togglePasswordVisibility}/>}
            mode={props.mode}
            style={props.style}
            theme={props.theme}
        />
    )
}