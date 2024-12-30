import { useAuth } from "../../contexts/AuthContext";
import { View, ScrollView } from 'react-native';
import { List, Surface, Divider, IconButton } from "react-native-paper";
import Text from "../Text";
import i18n from "../../localization/locale";
import theme from "../../theming/theme";

export default function AccessLogs() {
    const { logs, getLogs } = useAuth();

    return (
        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", marginTop: 40 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                <Text variant='headlineMedium' textVariant='bold'>
                    Access logs:
                </Text>

                <IconButton icon='refresh-circle' onPress={getLogs} size={30}/>
            </View>
        
            <ScrollView 
                style={{ 
                    width: "90%", 
                    height: "40%", 
                    marginTop: 30,
                }} 
                persistentScrollbar={true}
            >   
                {/*Reverse the logs array so the new logs will be the first ones*/}
                {logs.toReversed().map((log, index) => (
                    <Surface 
                        key={index}
                        elevation={2} 
                        style={{ 
                            marginBottom: 10,
                            borderRadius: 12,
                            overflow: 'hidden'
                        }}
                    >
                        <List.Accordion
                            title={log.username}
                            left={props => <List.Icon {...props} icon="account-clock" />}
                            style={{ 
                                backgroundColor: theme.colors.surface,
                            }}
                            titleStyle={{
                                fontWeight: 'bold'
                            }}
                        >
                            <Divider />
                            <List.Item
                                title={new Date(log.timestamp).toLocaleString()}
                                description={log.message}
                                left={props => <List.Icon {...props} icon="message-text" />}
                                titleStyle={{
                                    fontSize: 14,
                                    color: theme.colors.secondary
                                }}
                                descriptionStyle={{
                                    marginTop: 5
                                }}
                            />
                        </List.Accordion>
                    </Surface>
                ))}
            </ScrollView>
        </View>
    );
}