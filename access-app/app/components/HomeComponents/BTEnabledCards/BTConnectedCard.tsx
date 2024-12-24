import React from 'react';
import { View } from 'react-native';
import { Surface, Icon, Button } from 'react-native-paper';
import Text from '../../Text';
import i18n from "../../../localization/locale";

//Bluetooth
import { useBluetooth } from '../../../contexts/BluetoothContext';

export default function BTConnectedCard() {
    const { lockStatus, deviceRSSI } = useBluetooth();

    if(deviceRSSI < -65) {
        return (
            <View style={{ marginTop: 45, width: "100%", height: "25%", justifyContent: "center", alignItems: "center" }}>
                <Surface elevation={5} style={{ width: "82%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", gap: 15, flexShrink: 1 }}>
                    <Icon source="signal-cellular-1" size={55} />
                    <Text variant='titleMedium' textVariant='regular'>{i18n.t("LowSignalText")}</Text>
                </Surface>
            </View>
        )
    } else {
        return (
            <View style={{ marginTop: 45, width: "100%", height: "25%", justifyContent: "center", alignItems: "center" }}>
              <Surface elevation={5} style={{ width: "82%", height: "100%", borderRadius: 15, justifyContent: "center", alignItems: "center", gap: 15, flexShrink: 1 }}>
                {lockStatus ? (
                  <>
                    <Icon source="lock-outline" size={55} />
                    <Text variant='titleMedium' textVariant='regular'>{i18n.t("SecuredText")}</Text>
                    <Button mode="contained" icon="key" style={{ width: 250 }} buttonColor='greenr'>Unlock</Button>
                  </>
                ) : (
                  <>
                    <Icon source="lock-open-variant-outline" size={55} />
                    <Text variant='titleMedium' textVariant='regular'>{i18n.t("NotSecuredText")}</Text>
                    <Button mode="contained" icon="key" theme={{ roundness: 2 }} style={{ width: 250 }}>Lock</Button>

                  </>
                )}
              </Surface>
            </View>
        )
    }
}