import React from "react"
import { View } from "react-native";
import { useEffect, useState } from "react";
import { Surface, ActivityIndicator } from "react-native-paper";
import Text from "../Text";

import BTScanningCard from "./BTEnabledCards/BTScanningCard"
import BTConnectedCard from "./BTEnabledCards/BTConnectedCard";
import BTLostConnection from "./BTEnabledCards/BTLostConnection";

//Bluetooth
import { useBluetooth } from "../../contexts/BluetoothContext";

export default function BTEnabledCard() {
    const { isConnected, lostConnection } = useBluetooth();
    
    if(isConnected) {
        return <BTConnectedCard />
    } else if (isConnected === false && lostConnection === true) {
        return <BTLostConnection />
    } else {
        return <BTScanningCard />
    }
}
