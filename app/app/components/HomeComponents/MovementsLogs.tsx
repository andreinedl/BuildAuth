import { useAuth } from "../../contexts/AuthContext";
import { View, ScrollView } from 'react-native';
import React, { useState } from "react";
import { List, Surface, Divider,  } from "react-native-paper";
import convertTimestamp from "../../utils/convertTimestamp";

interface Props {
    visible: boolean;
}

export default function MovementsLogs({ visible }: Props) {
    const { movements } = useAuth();
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
            {movements.map((movement, index) => (
                <Surface 
                    key={index}
                    elevation={2} 
                    style={{ 
                        marginBottom: 10,
                        borderRadius: 12,
                        overflow: 'hidden'
                    }}
                >
                    <List.Item
                        title={movement.message}
                        description={convertTimestamp(movement.timestamp)}
                        left={props => <List.Icon {...props} icon="run-fast" />}
                        titleStyle={{
                            fontWeight: 'bold'
                        }}
                    />
                </Surface>
            ))}
        </ScrollView>
    )
}
