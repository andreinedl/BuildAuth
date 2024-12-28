import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Icon, Button, Portal } from 'react-native-paper';
import Text from '../../Text';
import i18n from "../../../localization/locale";

//Bluetooth
import { useBluetooth } from '../../../contexts/BluetoothContext';

export default function BTConnectedCard() {
    const { lockStatus, deviceRSSI, setModalVisibility, requestCode } = useBluetooth();

    const openModal = () => {
        requestCode();
        setModalVisibility(true);
    }
    const closeModal = () => setModalVisibility(false);

    if(deviceRSSI < -65) {
        return (
            <View style={styles.container}>
                <Surface elevation={5} style={styles.surface}>
                    <Icon source="signal-cellular-1" size={55} />
                    <Text variant='titleMedium' textVariant='regular'>{i18n.t("LowSignalText")}</Text>
                </Surface>
            </View>
        )
    } else {
        return (
            <>
                <View style={styles.container}>
                    <Surface elevation={5} style={styles.surface}>
                        {lockStatus ? (
                            <>
                                <Icon source="lock-outline" size={55} />
                                <Text variant='titleMedium' textVariant='regular'>{i18n.t("SecuredText")}</Text>
                                <Button mode="contained" icon="key" style={styles.button} buttonColor='green' onPress={openModal}>
                                    Unlock
                                </Button>
                            </>
                        ) : (
                            <>
                                <Icon source="lock-open-variant-outline" size={55} />
                                <Text variant='titleMedium' textVariant='regular'>{i18n.t("NotSecuredText")}</Text>
                                <Button mode="contained" icon="key" theme={{ roundness: 2 }} style={styles.button} onPress={openModal}>
                                    Lock
                                </Button>
                            </>
                        )}
                    </Surface>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 45,
        width: "100%",
        height: "25%",
        minHeight: "25%",
        justifyContent: "center",
        alignItems: "center"
    },
    surface: {
        width: "82%",
        height: 200,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
        //flexShrink: 1
    },
    button: {
        width: 250
    }
});