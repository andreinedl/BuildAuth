import { View, ScrollView, StyleSheet } from "react-native";
import { List, Surface, Divider, Avatar, Text, Button } from "react-native-paper";
import { useAuth } from "../../contexts/AuthContext";
import theme from "../../theming/theme";
import { useState } from "react";
import EditUserDialog from "../Dialogs/EditUserDialog";
import i18n from "../../localization/locale";
import convertTimestamp from "../../utils/convertTimestamp";

export default function AdminUsersList() {
    const { usersList, showEditDialog, showDeleteDialog, getUsersList, showCreateDialog } = useAuth();

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text variant="headlineMedium" style={{ marginBottom: 20, textAlign: 'center' }}>
                Users Management
            </Text>
            <Button icon="reload" onPress={() => getUsersList()}>
                Refresh
            </Button>
            <Button icon="plus" onPress={showCreateDialog} buttonColor="green" textColor="white" style={{ marginBottom: 10, height: 50, justifyContent: 'center' }}>
                {i18n.t('CreateUser')}
            </Button>
            <ScrollView>
                {usersList.map((user, index) => (
                    <Surface
                        key={index}
                        elevation={2}
                        style={{
                            marginBottom: 12,
                            borderRadius: 12,
                            overflow: 'hidden',
                        }}
                    >
                        <List.Accordion
                            title={`${user.firstName} ${user.lastName}`}
                            description={user.email}
                            left={props => (
                                <Avatar.Text
                                    {...props}
                                    size={40}
                                    label={`${user.firstName[0]}${user.lastName[0]}`}
                                    style={{ ...props.style, backgroundColor: theme.colors.surface }}
                                    labelStyle={{ fontWeight: 'condensedBold' }}
                                />
                            )}
                            right={props => (
                                <List.Icon
                                    {...props}
                                    icon={user.admin ? "shield-account" : "account"}
                                    color="white"
                                />
                            )}
                        >
                            <Divider />
                            <List.Item
                                title="Email"
                                description={user.email}
                                left={props => <List.Icon {...props} icon="email" />}
                            />
                            <Divider />
                            <List.Item
                                title="Last Access"
                                description={convertTimestamp(user.lastAccess) || "Never"}
                                left={props => <List.Icon {...props} icon="clock-outline" />}
                            />
                            <Divider />
                            <List.Item
                                title="Status"
                                description={user.allowed ? "Allowed" : "Not Allowed"}
                                left={props => (
                                    <List.Icon
                                        {...props}
                                        icon={user.allowed ? "check-circle" : "close-circle"}
                                        color={user.allowed ? "green" : "red"}
                                    />
                                )}
                            />
                            <Divider />
                            {user.admin ? (<List.Item
                                title="Admin"
                                left={props => (
                                    <List.Icon
                                        {...props}
                                        icon="check-circle"
                                        color="green"
                                    />
                                )}
                            />) : null}
                            <Divider />
                            {/* marginRight is a fix for accordions harcoded left margin */}
                            <View style={{ marginRight: 40, marginTop: 10, marginBottom: 10}}>
                                <Button 
                                    mode="contained"
                                    onPress={() => showEditDialog(user)}
                                    icon="pencil"
                                    textColor="black"
                                    buttonColor="#FFC300"
                                    style={{ marginBottom: 10 }}
                                >
                                    {i18n.t('Edit')}
                                </Button>
                                <Button 
                                    mode="contained"
                                    onPress={() => showDeleteDialog(user)}
                                    icon="delete-forever"
                                    textColor="black"
                                >
                                    {i18n.t('Delete')}
                                </Button>
                            </View>
                        </List.Accordion>
                    </Surface>
                ))}
            </ScrollView>
        </View>
    );
}
