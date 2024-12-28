import React from 'react';
import { View } from "react-native";
import { Surface, Icon, ActivityIndicator, Text, Button } from "react-native-paper";
import i18n from "../../../localization/locale";

import { useBluetooth } from '../../../contexts/BluetoothContext';

export default function BTLostConnection() {
    const { connectToDevice } = useBluetooth();

    return (
        <View style={{ marginTop: 45, width: "100%", height: "25%", justifyContent: "center", alignItems: "center" }}>
            <Surface elevation={5} style={{ width: "82%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", gap: 15, flexShrink: 1 }}>
                <Icon source={"signal-off"} size={65}/>
                <Text variant='titleMedium'>{i18n.t("BluetoothLostConnectionText")}</Text>
                <Button mode="contained" onPress={connectToDevice} theme={{ roundness: 2 }} style={{ width: 250 }}>Reconnect</Button>
            </Surface>
        </View>
    );
}