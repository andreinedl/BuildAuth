import { View, NativeModules, Pressable, KeyboardAvoidingView } from "react-native"
import { router } from "expo-router";
import { useState } from "react";
import React from 'react'
import { Surface } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';

//imports from local files

import PasswordInput from "./components/PasswordInput"
import { theme } from "./theming/theme";
import { Text } from "./components/Text"
import LoginButton from "./components/LoginButton";
import { i18n } from "./localization/locale";

export default function LoginScreen() {
    function LoginHeader() {
        return (
            <View style={{ justifyContent: "center", alignContent: "center", alignItems:"center", marginTop: "10%"}} >
                <Text variant="displayMedium" textVariant="bold">
                    {i18n.t('LoginGreetingH1')}
                </Text>
                <Text variant="titleLarge" textVariant="regular">
                    {i18n.t('LoginGreetingH2')}
                </Text>
            </View>
        )
    }

    function LoginInputs() {
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
                <LoginInputs /> 
                <LoginButton label={i18n.t("LoginButton")} mode="contained" theme={{ roundness: 2 }} style={{ marginTop: 15, marginBottom: 20 }} labelStyle={{ fontSize: 15 }}/>
            </Surface>
            </KeyboardAvoidingView>
        </View>
    )

}