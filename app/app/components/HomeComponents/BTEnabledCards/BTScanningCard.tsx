import React from 'react';
import { View } from "react-native";
import { Surface, Icon, ActivityIndicator, Text } from "react-native-paper";
import i18n from "../../../localization/locale";

export default function BTScanningCard() {
    return (
        <View style={{ marginTop: 45, width: "100%", height: "25%", justifyContent: "center", alignItems: "center" }}>
            <Surface elevation={5} style={{ width: "82%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", gap: 15, flexShrink: 1 }}>
                <ActivityIndicator animating={true} size={'large'}/>
                <Text variant='titleMedium'>{i18n.t("BluetoothScanningText")}</Text>
            </Surface>
        </View>
    );
}