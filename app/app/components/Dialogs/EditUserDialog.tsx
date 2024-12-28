import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Dialog, Portal, TextInput, Switch, Button, Text, Checkbox } from "react-native-paper";
import i18n from "../../localization/locale";
import { useAuth, User } from "../../contexts/AuthContext";
import theme from "../../theming/theme";

interface Props {
    user: User
}

export default function EditUserDialog() {

    const { editDialogVisibility, setEditDialogVisibility, editUser } = useAuth() 

    useEffect(() => {
        if (editUser) {
            setEmail(editUser.email);
            setFirstName(editUser.firstName);
            setLastName(editUser.lastName);
            setAllowed(editUser.allowed);
            setAdmin(editUser.admin);
        }
    }, [editUser]);
    const showDialog = () => setEditDialogVisibility(true);
    const hideDialog = () => setEditDialogVisibility(false);

    const [email, setEmail] = useState<string>(editUser.email);
    const [password, setPassword] = useState<string>();
    const [firstName, setFirstName] = useState<string>(editUser.firstName);
    const [lastName, setLastName] = useState<string>(editUser.lastName);
    const [allowed, setAllowed] = useState<boolean>(editUser.allowed);
    const [admin, setAdmin] = useState<boolean>(editUser.admin);

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
                        <Text>"</Text>
                        <Checkbox status={allowed ? 'checked' : 'unchecked'} onPress={() => {setAllowed(!allowed)}}/>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text>Admin</Text>
                        <Checkbox status={admin ? 'checked' : 'unchecked'} onPress={() => {setAdmin(!admin)}}/>
                    </View>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}