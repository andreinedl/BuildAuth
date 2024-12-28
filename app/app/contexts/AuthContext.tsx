import axios from 'axios';
import React, { createContext, useContext, useState } from "react";
import Spinner from 'react-native-loading-spinner-overlay';
import { ActivityIndicator } from 'react-native-paper';
import config from '../config';

export interface User {
    username: string;
    email: string;
    lastAccess: string;
    allowed: boolean;
    firstName: string;
    lastName: string;
    admin: boolean;
}
interface AuthType {
    login: (username: string, password: string) => Promise<String>;
    logout: () => void;
    getUsersList: () => Promise<void>
    user: User;
    isLoading: boolean;
    isAuthenticated: boolean;
    logs: Array<{
        username: string;
        timestamp: string;
        message: string;
    }>;
    usersList: Array<{
        username: string,
        email: string,
        lastAccess: string,
        allowed: boolean,
        firstName: string,
        lastName: string,
        admin: boolean,
    }>;

    //edit dialog props
    editDialogVisibility: boolean,
    setEditDialogVisibility: (value: boolean) => void,
    editUser: User,
    showEditDialog: (user: User) => void
}

const AuthContext = createContext<AuthType>(undefined);

const useAuth = () => {
	return useContext(AuthContext);
};

const AuthProvider = ({ children }: any) => {
    const userInfo: User = {
        username: '',
        email: '',
        lastAccess: '',
        allowed: false,  // Changed from null to false
        firstName: '',
        lastName: '',
        admin: false,    // Changed from null to false
    }

    let log = {
        username: '',
        timestamp: '',
        message: '',
    }

    const [user, setUser] = React.useState<User>(userInfo);
    const [isAuthenticated, setAuthenticated] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [loginMessage, setLoginMessage] = React.useState('');
    const [logs, setLogs] = React.useState(Array<typeof log>);
    const [usersList, setUsersList] = React.useState<User[]>([])

    //edit dialog props
    const [editDialogVisibility, setEditDialogVisibility] = React.useState<boolean>(false);
    const [editUser, setEditUser] = React.useState<User>(userInfo);

    const login = async (username: string, password: string): Promise<String> => {
        try {
            setLoading(true);
            const response = await axios.post(`${config.apiUrl}/users/auth`, {
                username: username,
                password: password
            }, { timeout: 5000 })
            setUser(response.data.userInfo);
            setAuthenticated(true);
            getLogs()
            getUsersList()
            setLoading(false);
            return "authenticated";
        } catch(error) {
            if (!error.response) {
                setLoading(false);
                return "timeout";
              } else {
                setLoading(false);
                return "failed";
              }
        }
    }

    const logout = async () => {
        try {
            setUser(userInfo);
            setAuthenticated(false);
        } catch (error) {
            console.log(error);
        }
    }

    const getLogs = async() => {
        const response = await axios.get(`${config.apiUrl}/logs/`, { timeout: 5000 })
        let logsData = response.data.map(log => {
            return {
                username: log.username,
                timestamp: log.timestamp,
                message: log.message,
            }
        })
        setLogs(logsData);
    }

    const getUsersList = async() => {
        const response = await axios.get(`${config.apiUrl}/users/`, { timeout: 5000 })
        const usersListData: User[] = response.data.map((userInfo: User) => ({
            username: userInfo.username,
            email: userInfo.email,
            lastAccess: userInfo.lastAccess,
            allowed: userInfo.allowed,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            admin: userInfo.admin,
        }))
        setUsersList(usersListData);
    }

    const showEditDialog = (user: User) => {
        if (!user) return;
        setEditUser(user);
        setEditDialogVisibility(true);
    }

    const value = {
        isAuthenticated,
		login,
        logout,
        getUsersList,
        user,
        isLoading, 
        loginMessage,
        logs,
        usersList,
        editDialogVisibility,
        setEditDialogVisibility,
        editUser,
        showEditDialog
	};

    return (
        <AuthContext.Provider value={value}>
            {children}
            <Spinner visible={isLoading}/>
        </AuthContext.Provider>
    )
}

export default AuthProvider;
export { useAuth };