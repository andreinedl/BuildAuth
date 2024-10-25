import { View, NativeModules, Pressable, KeyboardAvoidingView } from "react-native"
import { router } from "expo-router";
import { useState } from "react";
import React from 'react'
import { Surface } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { theme } from "../theming/theme";
import { i18n } from "../localization/locale";

//import components

import LoginHeader from "../components/LoginComponents/LoginHeader";
import LoginInputs from "../components/LoginComponents/LoginInputs";
import LoginButton from "../components/LoginComponents/LoginButton";

export default function LoginScreen() {
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