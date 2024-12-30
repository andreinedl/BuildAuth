import { useAuth } from "../../contexts/AuthContext";
import { View, ScrollView } from 'react-native';
import React, { useState } from "react";
import { List, Surface, Divider, Button } from "react-native-paper";
import theme from "../../theming/theme";
import convertTimestamp from "../../utils/convertTimestamp";

interface Props {
    visible: boolean;
}

export default function AccessLogs({ visible }: Props) {
    const { logs } = useAuth();
    return (
        <ScrollView 
            style={{ 
                width: "90%", 
                height: "40%", 
                marginTop: 10,
                display: visible ? 'flex' : 'none',
            }} 
            persistentScrollbar={true}
        >   
            {logs.map((log, index) => (
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
            ))}
        </ScrollView>
    )
}
