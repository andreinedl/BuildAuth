import { useAuth } from "../../contexts/AuthContext";
import { View, ScrollView } from 'react-native';
import React, { useState } from "react";
import { List, Surface, Divider, Button, SegmentedButtons } from "react-native-paper";
import i18n from "../../localization/locale";
import AccessLogs from "./AccessLogs";
import MovementsLogs from "./MovementsLogs";

export default function LogsMovementsSwitch() {
    const { getLogs, getMovements } = useAuth();
    const [segmentedButtonValue, setSegmentedButtonValue] = useState('logs');

    const onRefresh = () => {
        if(segmentedButtonValue === 'logs') {
            getLogs();
        } else {
            getMovements();
        }
    }

    return (
        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center", marginTop: 40, flex: 1, marginBottom: 20 }}>
            <SegmentedButtons 
                value={segmentedButtonValue} 
                onValueChange={value => setSegmentedButtonValue(value)} 
                style={{ marginTop: 10, width: '90%' }}
                buttons={[
                    {
                        value: 'logs',
                        label: i18n.t('AccessLogs'),
                    },
                    {
                        value: 'movements',
                        label: i18n.t('Movements'),
                    },
                ]}
            />

            <Button mode="contained" icon="refresh" onPress={onRefresh} style={{ marginTop: 10, width: "60%"}}>Refresh</Button>
            <View style={{ flex: 1, width: "90%", marginTop: 10 }}>
                <AccessLogs visible={segmentedButtonValue === 'logs'} />
                <MovementsLogs visible={segmentedButtonValue === 'movements'} />
            </View>

        </View>
    )
}