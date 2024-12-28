import { View } from "react-native";
import { Surface } from "react-native-paper";
import theme from "../theming/theme";
import AdminHeader from "../components/AdminDashboardComponents/AdminHeader";
import AdminUsersList from "../components/AdminDashboardComponents/AdminUsersList";
import EditUserDialog from "../components/Dialogs/EditUserDialog";
import DeleteUserDialog from "../components/Dialogs/DeleteUserDialog";
import CreateUserDialog from "../components/Dialogs/CreateUserDialog";
import { useAuth } from "../contexts/AuthContext";

export default function AdminDashboard() {
    const { editUser } = useAuth()

    return ( 
        <View style={{ backgroundColor: theme.colors.background, height: "100%", width: "100%", flex: 1, justifyContent: "center" }}>
            <Surface elevation={4} style={{
                backgroundColor: theme.colors.surface,
                width: "95%",
                height: "97%", 
                alignSelf: 'center',
                borderRadius: 20,
            }}>
                <AdminHeader />
                <AdminUsersList />
            </Surface>
            <EditUserDialog/>
            <DeleteUserDialog/>
            <CreateUserDialog/>
        </View>
    )
}