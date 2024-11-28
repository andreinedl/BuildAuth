import { PaperProvider } from 'react-native-paper';
import { View, NativeModules, Text, useColorScheme, StatusBar } from 'react-native'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Raleway_400Regular, Raleway_700Bold, Raleway_700Bold_Italic, Raleway_400Regular_Italic } from '@expo-google-fonts/raleway';
import { theme } from './theming/theme';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-paper-toast';
import * as NavigationBar from 'expo-navigation-bar';

//Screens
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './(auth)/Login';
import TabLayout from './(tabs)/_layout';
import { AuthProvider } from './contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    'Raleway-Bold': Raleway_700Bold,
    'Raleway-Italic': Raleway_400Regular_Italic,
    'Raleway-BoldItalic': Raleway_700Bold_Italic,
    'Raleway-Regular': Raleway_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  //Set NavigationBar color
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(theme.colors.background);
  }, []);

  if (!loaded && !error) {
    return null;
  }

  const backColor = theme.colors.background;

  const Stack = createNativeStackNavigator();

  return (
    <PaperProvider theme={theme}>
      {/* Set statusbar color */}   

        <SafeAreaView style={{ flex: 1 }}>       
        <StatusBar backgroundColor={backColor} barStyle={'light-content'} />
          <ToastProvider>
            <AuthProvider>
              <NavigationContainer independent={true}>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Home" component={TabLayout} />
                </Stack.Navigator>
              </NavigationContainer>
            </AuthProvider>
          </ToastProvider>
        </SafeAreaView>
    </PaperProvider>
  )
}