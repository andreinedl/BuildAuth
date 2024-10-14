import { Input, Stack, XStack, ZStack, Text, YStack, Button} from 'tamagui';
import { TouchableOpacity, View,  } from 'react-native';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import i18n from "./locale";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function PasswordInput() {
    const text = useTranslation().t
    const [passwordHidden, setPasswordHidden] = useState(true)

    function togglePasswordVisibility() {
        {passwordHidden ? setPasswordHidden(false) : setPasswordHidden(true)}
    }

    return (
        <Stack position='relative' flex={1} zIndex={2}>
            <Input 
                placeholder={text("LoginPasswordPlaceholder")} 
                secureTextEntry={passwordHidden}
                flex={1}
            />
            <Button style={{ position: 'absolute', right: 10, top: '50%',  transform: [{ translateY: '-50%'}] }} chromeless size={'$1'} onPress={togglePasswordVisibility}>
                {passwordHidden ? <Eye/> : <EyeOff/>}
            </Button>
        </Stack>
    )
}