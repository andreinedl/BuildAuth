import Text from "../components/Text"
import { View } from 'react-native'
import { Button, Icon, Surface, List } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext"
import { useContext, useEffect, useState } from "react";
import theme from  "../theming/theme";
import i18n from "../localization/locale";

export default function UserInfo() {
    const { user, logout } = useAuth();

    return (
        <View style={{ backgroundColor: theme.colors.background, height: "100%", width: "100%", flex: 1, justifyContent: "center" }}>
            <Surface elevation={4} style={{
                backgroundColor: theme.colors.surface,
                width: "95%",
                height: "97%", 
                alignSelf: 'center',
                borderRadius: 20,
                overflow: "hidden",
                padding: 10
            }}>
                <View style={{ flex: 1 }}>
                    {/* Account icon + full name */}
                    <View style={{ alignContent: "center", justifyContent: "center", alignItems: "center", paddingTop: 30 }}>
                        <Icon source="account-circle-outline" size={130}/>
                        <Text variant='headlineMedium' textVariant='normal'>{`${user.firstName} ${user.lastName}`}</Text>
                    </View>

                    {/* Account info */}
                    <View style={{ marginLeft: 15, marginTop: 20, flex: 1 }}>
                        <List.Section>
                            <List.Subheader>Account info:</List.Subheader>
                            <List.Item 
                                title={i18n.t("email")}
                                description={user.email}
                                left={() => <List.Icon icon="email" />} />
                            <List.Item
                                title={i18n.t("username")}
                                description={`${user.username}`}
                                left={() => <List.Icon icon="account" />}
                            />
                            <List.Item
                                title={i18n.t("firstName")}
                                description={`${user.firstName}`}
                                left={() => <List.Icon icon="account" />}
                            />
                            <List.Item
                                title={i18n.t("lastName")}
                                description={`${user.lastName}`}
                                left={() => <List.Icon icon="account" />}
                            />
                        </List.Section>
                    </View>

                    {/* Account actions */}
                    <View style={{ marginBottom: 20 }}>
                        <Button 
                            icon="logout" 
                            mode="contained" 
                            theme={{ roundness: 2 }} 
                            style={{ minWidth: 200, alignSelf: "center" }} 
                            labelStyle={{ fontSize: 15 }} 
                            onPress={logout}>
                                {i18n.t("logout")}
                        </Button>
                    </View>
                </View>
            </Surface>
        </View>
    )
}