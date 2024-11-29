//Screens
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import LoginScreen from './(auth)/Login';
import TabLayout from './(tabs)/_layout';
import { useAuth } from './contexts/AuthContext';

export default function Stack() {
    const { isAuthenticated } = useAuth()

    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer independent={true}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <Stack.Screen name="Home" component={TabLayout} />
            ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
            )}
        </Stack.Navigator>
      </NavigationContainer>
    )
}