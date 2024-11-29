// access-app/app/login/Login.tsx
import { View, KeyboardAvoidingView, Keyboard } from "react-native";
import { useContext, useState } from "react";
import { Surface } from 'react-native-paper';
import { theme } from "../theming/theme";
import { i18n } from "../localization/locale";
import { useToast } from 'react-native-paper-toast';
import LoginHeader from "../components/LoginComponents/LoginHeader";
import LoginInputs from "../components/LoginComponents/LoginInputs";
import LoginButton from "../components/LoginComponents/LoginButton";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }) {
    const { login, user } = useAuth();
    const toast = useToast(); // https://github.com/kuasha420/react-native-paper-toast
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function loginAction() {
        Keyboard.dismiss();
        await login(username, password).then((response) => {
            console.log(response)
            if(response == "authenticated") {
                toast.show({ message: i18n.t('LoginSuccess'), duration: 2000, type: 'success' });
                navigation.navigate("Home");
            } else if(response == "timeout") {
                toast.show({ message: i18n.t('APIUnreachable'), duration: 2000, type: 'error'});
            } else if(response == "failed") {
                toast.show({ message: i18n.t('LoginFailed'), duration: 2000, type: 'error'});
            } else {
                toast.show({ message: i18n.t('UnknownError'), duration: 2000, type: 'error'});
            }
        })
    }

    return (
        <View style={{ backgroundColor: theme.colors.background, height: "100%", width: "100%", justifyContent: "center", alignItems: "center", flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1, justifyContent: "center", height: "100%", width: "100%"}}>
                <Surface elevation={4} style={{
                    backgroundColor: theme.colors.surface,
                    width: "90%",
                    height: "auto", 
                    alignSelf: 'center',
                    borderRadius: 20,
                }}>
                    <LoginHeader />
                    <LoginInputs 
                        username={username} 
                        setUsername={setUsername} 
                        password={password} 
                        setPassword={setPassword} 
                    />
                    <LoginButton 
                        label={i18n.t("LoginButton")} 
                        mode="contained" 
                        theme={{ roundness: 2 }} 
                        style={{ marginTop: 15, marginBottom: 20 }} 
                        labelStyle={{ fontSize: 15 }} 
                        onPress={loginAction} 
                    />
                </Surface>
            </KeyboardAvoidingView>
        </View>
    );
}