import { TamaguiProvider } from '@tamagui/core'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { View, NativeModules } from 'react-native'
import { Stack, Redirect } from 'expo-router'
import { useColorScheme } from 'react-native'
import { useFonts } from 'expo-font'
import LoginScreen from './login'
import { LinearGradient } from 'expo-linear-gradient';

import { tamaguiConfig } from '../tamagui.config'

import { Slot } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <ThemeProvider value={DarkTheme}>
          <LinearGradient colors={['#181818', "#111111", 'transparent']} style={{ width: "100%", height: "100%" }}>
            <LoginScreen />
          </LinearGradient>
      </ThemeProvider>
    </TamaguiProvider>
  )
}