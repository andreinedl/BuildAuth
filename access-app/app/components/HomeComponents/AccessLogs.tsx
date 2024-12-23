import { useAuth } from "../../contexts/AuthContext";
import { View, ScrollView } from 'react-native';
import { List } from "react-native-paper";
import { Text } from "../Text";
import { i18n } from "../../localization/locale";
import { theme } from "../../theming/theme";
export default function AccessLogs () {
    const { logs } = useAuth();

    return (
        <View style={{ justifyContent: "center" , alignContent: "center", alignItems: "center", marginTop: 40}}>
            <Text variant='headlineMedium' textVariant='bold'>
                Access logs:
            </Text>
        
            <ScrollView style={{ width: "90%", height: "40%", marginTop: 30, backgroundColor: theme.colors.background }} persistentScrollbar={true}>
                {logs.map((log, index) => {
                    return (
                        <List.Accordion title={log.username} left={props => <List.Icon {...props} icon="key" />} style={{ backgroundColor: "transparent" }}>
                            <List.Item
                                key={index}
                                title={log.timestamp}
                                description={log.message}
                            />
                        </List.Accordion>
                    )
                })}
            </ScrollView>
        </View>
    )
}