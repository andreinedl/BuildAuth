import { View, NativeModules, Pressable } from "react-native"
import { Text, Input, H1, H3, Button, Stack, XStack, YStack, Image } from "tamagui"
import { Toast, useToastController, useToastState } from '@tamagui/toast'
import { useTranslation } from 'react-i18next';
import { router } from "expo-router";
import { useState } from "react";
import React from 'react'
import { LogIn } from "@tamagui/lucide-icons";

//imports from local files

import i18n from "./others/locale"
import PasswordInput from "./others/PasswordInput"

export default function LoginScreen() {
    const [native, setNative] = React.useState(false)
    const text = useTranslation().t

    function SignInComponent() {
        const toast = useToastController()
        return (
            <YStack
                gap="$3"
                paddingTop="$4"
            >
                <Input placeholder={text('LoginUsernamePlaceholder')} minWidth={400} autoFocus={true} />
                <PasswordInput />

                <Button icon={LogIn}>
                    {text('LoginButton')}
                </Button>
            </YStack>    
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <H1>
                {text('LoginGreetingH1')}
            </H1>
            <H3>
                {text('LoginGreetingH2')}
            </H3>
            <SignInComponent />
        </View>
    )
}