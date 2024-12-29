import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Dialog, Portal, TextInput, Switch, Button, Text, Checkbox } from "react-native-paper";
import i18n from "../../localization/locale";
import { useAuth, User } from "../../contexts/AuthContext";
import theme from "../../theming/theme";
import { useToast } from "react-native-paper-toast";

export default function CreateUserDialog() {
    const toast = useToast(); // https://github.com/kuasha420/react-native-paper-toast
    const { createDialogVisibility, createUser, setCreateDialogVisibility } = useAuth() 

    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [allowed, setAllowed] = useState<boolean>();
    const [admin, setAdmin] = useState<boolean>();

    
    const showDialog = () => setCreateDialogVisibility(true);

    //reset the values each time you close the dialog
    const hideDialog = () => { 
        setCreateDialogVisibility(false) 
        setUsername('');
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setAllowed(false);
        setAdmin(false);
    }

    const handleSave = () => {
        createUser(username, email, firstName, lastName, password, allowed, admin).then((response) => {
            if (response === 'success') {
                toast.show({ message: i18n.t('UserCreated'), duration: 2000, type: 'success' });
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
            <Dialog visible={createDialogVisibility} onDismiss={hideDialog}>
                <Dialog.Title style={{ textAlign: 'center' }}>
                    {i18n.t('CreateUserDialogText')}
                </Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={{ marginBottom: 15 }}
                        mode="outlined"
                        left={<TextInput.Icon icon="account" style={{ backgroundColor: 'transparent' }}/>}
                        theme={{ roundness: 12 }}
                    />
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
                    <Button
                        mode="outlined"
                        onPress={() => {
                            hideDialog();
                        }}
                        style={{ marginTop: 15 }}
                        theme={theme}
                    >
                        {i18n.t('Cancel')}
                    </Button>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}