import { Text } from "../components/Text"
import { View } from 'react-native'
import { useAuth } from "../contexts/AuthContext"
import { useContext, useEffect, useState } from "react";
export default function UserInfo() {
    const { user } = useAuth();

    return (
        <View>
            <Text variant='titleMedium' textVariant='regular'>User Info</Text>
            <Text variant='titleMedium' textVariant='regular'>{user.firstName}</Text>
        </View>
    )
}