import { useAuth } from "../../contexts/AuthContext";
import { View, FlatList } from 'react-native';
import React from "react";
import { List, Surface, Divider, ActivityIndicator } from "react-native-paper";
import theme from "../../theming/theme";
import convertTimestamp from "../../utils/convertTimestamp";

interface Props {
    visible: boolean;
}

const LogItem = ({ log }) => (
    <Surface 
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
                title={convertTimestamp(log.timestamp)}
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
);

export default function AccessLogs({ visible }: Props) {
    const { logs } = useAuth();

    const renderItem = ({ item }) => (
        <LogItem log={item} />
    );

    if (!visible) return null;

    return (
        <FlatList
            data={logs}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
        />
    );
}
