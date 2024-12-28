import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Dialog, Portal, Button } from "react-native-paper";
import { useToast } from "react-native-paper-toast";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../localization/locale";
import { Text } from "react-native-paper";
export default function DeleteUserDialog() {
    
    const toast = useToast(); // https://github.com/kuasha420/react-native-paper-toast
    const { userToDelete, setDeleteDialogVisibility, deleteDialogVisibility, deleteUser } = useAuth()

    const showDialog = () => setDeleteDialogVisibility(true);
    const hideDialog = () => setDeleteDialogVisibility(false);

    const handleDelete = () => {
        deleteUser(userToDelete.username).then((response) => {
            if (response === 'success') {
                toast.show({ message: i18n.t('UserDeleted'), duration: 2000, type: 'success' });
            } else if (response === 'timeout') {
                toast.show({ message: i18n.t('APIUnreachable'), duration: 2000, type: 'error' });
            } else {
                toast.show({ message: i18n.t('UnknownError'), duration: 2000, type: 'error' });
            }
        });
    }

    return (
        <Portal>
            <Dialog visible={deleteDialogVisibility} onDismiss={hideDialog}>
                <Dialog.Title style={{ textAlign: 'center' }}>
                    {i18n.t('EditUserDialogTitle')}
                </Dialog.Title>
                <Dialog.Content style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                    <Text>
                        {i18n.t('DeleteUserDialogText')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                    <Button onPress={() => {hideDialog()}}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button onPress={() => {deleteUser(userToDelete.username)}}>
                        {i18n.t('Delete')}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}