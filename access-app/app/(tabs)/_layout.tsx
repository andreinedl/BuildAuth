// https://callstack.github.io/react-native-paper/docs/components/BottomNavigation/

import * as React from 'react';
import { useState, useEffect } from 'react';
import { BottomNavigation } from 'react-native-paper';
import Home from "./Home"
import UserInfo from "./UserInfo"
import theme from  '../theming/theme';
import i18n from '../localization/locale';
import { Slot } from 'expo-router';

const HomeRoute = () => <Home />
const UserInfoRoute = () => <UserInfo />

export default function TabLayout() {
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