import { Button, Icon } from 'react-native-paper';
import { View } from 'react-native';
import theme from  '../../theming/theme';
import LoginHeader from './LoginHeader';

export default function LoginButton(props) {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
            <Button mode={props.mode} theme={props.theme} style={props.style} labelStyle={props.labelStyle} onPress={props.onPress}>
                <Icon source="login" size={15} color={theme.colors.onBackground}/> 
                {` ${props.label}`}
            </Button>   
        </View>
    )
}