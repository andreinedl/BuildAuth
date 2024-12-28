import { useState } from "react";
import { Dialog, Portal, TextInput } from "react-native-paper";
import i18n from "../../localization/locale";
import { useAuth } from "../../contexts/AuthContext";

export default function EditUserDialog(userProvided) {
    const { user } = useAuth()
    const [visible, setVisible] = useState(false);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);



    <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>{i18n.t('EditUserDialogTitle')}</Dialog.Title>
        </Dialog>
    </Portal>
}