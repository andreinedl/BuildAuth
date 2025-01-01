// https://callstack.github.io/react-native-paper/docs/components/BottomNavigation/

import * as React from 'react';
import { useState, useEffect } from 'react';
import { SafeAreaView, KeyboardAvoidingView, View, Platform } from 'react-native';
import { BottomNavigation, Portal } from 'react-native-paper';
import theme from  '../theming/theme';
import i18n from '../localization/locale';
import { Slot } from 'expo-router';
import PinModal from '../components/Modals/PinModal'
import { useBluetooth } from '../contexts/BluetoothContext';
import { useAuth } from '../contexts/AuthContext';

//Routes
import Home from "./Home"
import UserInfo from "./UserInfo"
import AdminDashboard from "./AdminDashboard"

const HomeRoute = () => <Home />
const UserInfoRoute = () => <UserInfo />
const AdminDashboardRoute = () => <AdminDashboard />

export default function TabLayout() {
    const { user } = useAuth()

    if(user.admin) {
        const [index, setIndex] = React.useState(0);
            const [routes] = React.useState([
            { key: 'home', title: i18n.t('HomeTab'), icon: 'home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
            { key: 'userInfo', title: i18n.t('UserInfoTab'), icon: 'account', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
            { key: 'adminDashboard', title: i18n.t('AdminDashboardTab'), icon: 'cog', focusedIcon: 'cog', unfocusedIcon: 'cog-outline'}
        ]);

        const renderScene = BottomNavigation.SceneMap({
            home: HomeRoute,
            userInfo: UserInfoRoute,
            adminDashboard: AdminDashboardRoute
        }); 

        return (
            <BottomNavigation
              navigationState={{ index, routes }}
              onIndexChange={setIndex}
              renderScene={renderScene}
              barStyle={{ backgroundColor: theme.colors.background}}
            />
        );
    } else {
        const [index, setIndex] = React.useState(0);
            const [routes] = React.useState([
            { key: 'home', title: i18n.t('HomeTab'), icon: 'home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
            { key: 'userInfo', title: i18n.t('UserInfoTab'), icon: 'account', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
        ]);

        const renderScene = BottomNavigation.SceneMap({
            home: HomeRoute,
            userInfo: UserInfoRoute,
        }); 

        return (
            <BottomNavigation
              navigationState={{ index, routes }}
              onIndexChange={setIndex}
              renderScene={renderScene}
              barStyle={{ backgroundColor: theme.colors.background}}
            />
        );
    }
}