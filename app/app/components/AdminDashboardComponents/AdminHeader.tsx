import { View } from "react-native";
import theme from "../../theming/theme";
import Text from "../Text";

export default function AdminHeader() {
    return (
        <View style={{ justifyContent: "center", alignContent: "center", "alignItems": "center", marginTop: 20 }}>
            <Text variant="headlineLarge" textVariant="bold">⚙️ Admin Dashboard</Text>
        </View>
    )
}