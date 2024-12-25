import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Modal, Portal, Button, Surface } from "react-native-paper";
import theme from "../../../../theming/theme";
import Text from "../../../Text";
import { PaperOtpInput } from 'react-native-paper-otp-input';

export default function UnlockModal(props: { visible: boolean, onClose: Function }) {
    const [modalVisibility, setModalVisibility] = useState(props.visible);
    const [otp, setOtp] = useState<string>(null)

    useEffect(() => {
        setModalVisibility(props.visible);
    }, [props.visible]);

    const handleClose = () => {
        setModalVisibility(false);
        props.onClose();
    };

    return (
        <Portal>
            <Modal 
                visible={modalVisibility} 
                onDismiss={() => handleClose()} 
                contentContainerStyle={styles.modalContainer}
                style={styles.modal}
                dismissableBackButton={true}
            >
                <View style={styles.content}>
                    <Text variant="headlineMedium" textVariant="bold">Unlock</Text>
                    <Text variant="titleMedium" textVariant="normal" style={{ marginTop: 15 }}>
                        Please enter the PIN displayed on the screen:
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
                        onPress={() => handleClose()} 
                        theme={{ roundness: 2 }} 
                        style={styles.unlockButton}
                    >
                        Unlock
                    </Button>
                    <Button onPress={() => handleClose()}>Close</Button>
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
        backgroundColor: theme.colors.background,
        padding: 20,
        borderRadius: 10,
        margin: 20,
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
    },
    unlockButton: {
        width: "70%",
    }
});