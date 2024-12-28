import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Dialog, Portal, TextInput, Switch, Button, Text, Checkbox } from "react-native-paper";
import i18n from "../../localization/locale";
import { useAuth, User } from "../../contexts/AuthContext";
import theme from "../../theming/theme";
import { useToast } from "react-native-paper-toast";

export default function userToEditDialog() {
    const toast = useToast(); // https://github.com/kuasha420/react-native-paper-toast
    const { editDialogVisibility, setEditDialogVisibility, userToEdit, editUser } = useAuth() 

    useEffect(() => {
        if (userToEdit) {
            setEmail(userToEdit.email);
            setFirstName(userToEdit.firstName);
            setLastName(userToEdit.lastName);
            setAllowed(userToEdit.allowed);
            setAdmin(userToEdit.admin);
        }
    }, [userToEdit]);
    const showDialog = () => setEditDialogVisibility(true);
    const hideDialog = () => setEditDialogVisibility(false);

    const [email, setEmail] = useState<string>(userToEdit.email);
    const [password, setPassword] = useState<string>();
    const [firstName, setFirstName] = useState<string>(userToEdit.firstName);
    const [lastName, setLastName] = useState<string>(userToEdit.lastName);
    const [allowed, setAllowed] = useState<boolean>(userToEdit.allowed);
    const [admin, setAdmin] = useState<boolean>(userToEdit.admin);

    const handleSave = () => {
        editUser(userToEdit.username, email, firstName, lastName, password, allowed, admin).then((response) => {
            if (response === 'success') {
                toast.show({ message: i18n.t('UserEdited'), duration: 2000, type: 'success' });
                hideDialog();
            } else if (response === 'timeout') {
                toast.show({ message: i18n.t('APIUnreachable'), duration: 2000, type: 'error' });
            } else {
                toast.show({ message: i18n.t('UnknownError'), duration: 2000, type: 'error' });
            }
        });
    }

    return (
        <Portal>
            <Dialog visible={editDialogVisibility} onDismiss={hideDialog}>
                <Dialog.Title style={{ textAlign: 'center' }}>
                    {i18n.t('EditUserDialogTitle')}
                </Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={{ marginBottom: 15 }}
                        mode="outlined"
                        left={<TextInput.Icon icon="email" style={{ backgroundColor: 'transparent' }}/>}
                        theme={{ roundness: 12 }}
                    />
                    <TextInput
                        label={i18n.t('PasswordPlaceholder')}
                        value={password}
                        onChangeText={setPassword}
                        style={{ marginBottom: 15 }}
                        mode="outlined"
                        secureTextEntry
                        left={<TextInput.Icon icon="lock" />}
                        theme={{ roundness: 12 }}
                    />
                    <TextInput
                        label={i18n.t('firstName')}
                        value={firstName}
                        onChangeText={setFirstName}
                        style={{ marginBottom: 15 }}
                        mode="outlined"
                        left={<TextInput.Icon icon="account" />}
                        theme={{ roundness: 12 }}
                    />
                    <TextInput
                        label={i18n.t('lastName')}
                        value={lastName}
                        onChangeText={setLastName}
                        style={{ marginBottom: 15 }}
                        mode="outlined"
                        left={<TextInput.Icon icon="account" />}
                        theme={{ roundness: 12 }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>{i18n.t('Allowed')}</Text>
                        <Checkbox status={allowed ? 'checked' : 'unchecked'} onPress={() => {setAllowed(!allowed)}}/>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text>Admin</Text>
                        <Checkbox status={admin ? 'checked' : 'unchecked'} onPress={() => {setAdmin(!admin)}}/>
                    </View>

                    <Button
                        mode="contained"
                        onPress={() => {
                            handleSave();
                        }}
                        style={{ marginTop: 15 }}
                        theme={theme}
                    >
                        {i18n.t('Save')}
                    </Button>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}