import { useState, useEffect, useRef } from "react";
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Modal, Portal, Button, Surface, TextInput } from "react-native-paper";
import Text from "../Text";
import theme from "../../theming/theme";
import { PaperOtpInput } from 'react-native-paper-otp-input';
import { useBluetooth } from "../../contexts/BluetoothContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "react-native-paper-toast";
import i18n from "../../localization/locale";

export default function PinModal() {
    const { modalVisibility, setModalVisibility, sendPIN } = useBluetooth()
    const [otp, setOtp] = useState<string>(null)
    const { user } = useAuth();
    const toast = useToast()

    /*useEffect(() => {
        setModalVisibility(modalVisibility);
    }, [modalVisibility]);*/

    const handleSend = () => {
        if(otp.length < 6 || otp.length == undefined) {
            toast.show({ message: i18n.t('PinNotValid'), duration: 2000, type: 'error' });
            return;
        } else {
            console.log(user)
            sendPIN(parseInt(otp), user);
            closeModal()
        }
    }

    const closeModal = () => {
        setModalVisibility(false);
    };

    return (
        <Portal>
            <Modal 
                visible={modalVisibility} 
                onDismiss={() => closeModal()} 
                contentContainerStyle={styles.modalContainer}
                style={styles.modal}
                dismissableBackButton={true}
            >
                <View style={styles.content}>
                    <Text variant="headlineMedium" textVariant="bold">PIN</Text>
                    <Text variant="titleMedium" textVariant="normal" style={{ marginTop: 15 }}>
                        {i18n.t('PleaseEnterPin')}
                    </Text>
                    <PaperOtpInput 
                        maxLength={6} 
                        onPinChange={(pin) => {setOtp(pin)}}
                        containerStyle={styles.otpContainer}
                        otpContainerStyle={{ justifyContent: "space-between" }}
                        otpBoxStyle={styles.otpBox}
                        otpBorderFocusedColor={theme.colors.primary}
                        otpTextStyle={{ color: theme.colors.onSurface }}
                    /> 
                    <Button 
                        mode="contained" 
                        onPress={() => handleSend()} 
                        theme={{ roundness: 2 }} 
                        style={styles.unlockButton}
                    >
                        {i18n.t('Submit')}
                    </Button>
                    <Button onPress={() => closeModal()} style={styles.closeButton} buttonColor="white" theme={{ roundness: 2 }}>Close</Button>
                </View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        margin: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        backgroundColor: theme.colors.surface,
        padding: 20,
        borderRadius: 10,
        margin: 10,
    },
    content: {
        justifyContent: "center",
        alignItems: "center",
    },
    otpContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    otpBox: {
        backgroundColor: theme.colors.surface,
        borderRadius: 5,
        margin: 3
    },
    unlockButton: {
        width: "70%",
    },
    closeButton: {
        marginTop: 10,
        width: "30%"
    }
});