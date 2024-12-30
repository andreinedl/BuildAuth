import { useAuth } from "../../contexts/AuthContext";
import { View, FlatList } from 'react-native';
import React from "react";
import { List, Surface, ActivityIndicator } from "react-native-paper";
import convertTimestamp from "../../utils/convertTimestamp";

interface Props {
    visible: boolean;
}

const MovementItem = ({ movement }) => (
    <Surface 
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
);

export default function MovementsLogs({ visible }: Props) {
    const { movements } = useAuth();

    const renderItem = ({ item }) => (
        <MovementItem movement={item} />
    );

    if (!visible) return null;

    return (
        <FlatList
            data={movements}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            style={{ marginTop: 10, overflow: "hidden" }}
        />
    );
}
