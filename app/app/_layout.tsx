import { PaperProvider } from 'react-native-paper';
import { View, NativeModules, Text, useColorScheme, StatusBar, KeyboardAvoidingView } from 'react-native'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Raleway_400Regular, Raleway_700Bold, Raleway_700Bold_Italic, Raleway_400Regular_Italic } from '@expo-google-fonts/raleway';
import theme from  './theming/theme';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-paper-toast';
import * as NavigationBar from 'expo-navigation-bar';
import AuthProvider from './contexts/AuthContext';
import BluetoothProvider from './contexts/BluetoothContext';

//import stack screens
import Stack from './Stack';

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

  return (
    <PaperProvider theme={theme}>
      {/* Set statusbar color */}   
      <SafeAreaView style={{ flex: 1 }}>  
        <StatusBar backgroundColor={backColor} barStyle={'light-content'} />
          <ToastProvider>
            <AuthProvider>
              <BluetoothProvider>
                <Stack />
              </BluetoothProvider>
            </AuthProvider>
          </ToastProvider>
        </SafeAreaView>
    </PaperProvider>
  )
}