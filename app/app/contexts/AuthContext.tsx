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
    getLogs: () => Promise<void>;
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

    //edit user
    editDialogVisibility: boolean,
    setEditDialogVisibility: (value: boolean) => void,
    userToEdit: User,
    showEditDialog: (user: User) => void
    editUser: (username : string, email: string, firstName: string, lastName: string, password: string, allowed: boolean, admin: boolean) => Promise<String>;

    //delete user
    deleteUser: (username: string) => Promise<String>;
    setDeleteDialogVisibility: (value: boolean) => void;
    userToDelete: User;
    showDeleteDialog: (user: User) => void;
    deleteDialogVisibility: boolean;

    //create user
    createUser: (username : string, email: string, firstName: string, lastName: string, password: string, allowed: boolean, admin: boolean) => Promise<String>;
    setCreateDialogVisibility: (value: boolean) => void;
    showCreateDialog: () => void;
    createDialogVisibility: boolean;
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
        allowed: false, 
        firstName: '',
        lastName: '',
        admin: false,
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
    const [userToEdit, setUserToEdit] = React.useState<User>(userInfo);

    //delete user
    const [deleteDialogVisibility, setDeleteDialogVisibility] = React.useState<boolean>(false);
    const [userToDelete, setUserToDelete] = React.useState<User>(userInfo);

    //create user
    const [createDialogVisibility, setCreateDialogVisibility] = React.useState<boolean>(false);

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

    //Get logs
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

    //Get users list
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

    //Edit user dialog + logic
    const showEditDialog = (user: User) => {
        if (!user) return;
        setUserToEdit(user);
        setEditDialogVisibility(true);
    }

    const editUser = async (username : string, email: string, firstName: string, lastName: string, password: string, allowed: boolean, admin: boolean) : Promise<String> => {
        try {
            setLoading(true);
            
            if(password === '' || password === undefined) {
                password = undefined;
            } else {
                password = password;
            }

            const response = await axios.post(`${config.apiUrl}/users/edit`, {
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                allowed: allowed,
                admin: admin
            }, { timeout: 5000 })
            setLoading(false);
            getUsersList();
            return "success";
        } catch (error) {
            if (!error.response) {
                setLoading(false);
                return "timeout";
            } else {
                setLoading(false);
                return "failed";
            }
        }
    }

    //Delete user dialog + logic
    const deleteUser = async (username: string) => {
        try {
            setLoading(true);
            const response = await axios.post(`${config.apiUrl}/users/delete`, {
                username: username
            }, { timeout: 5000 })
            setLoading(false);
            getUsersList();
            setDeleteDialogVisibility(false);
            return "success";
        } catch (error) {
            if (!error.response) {
                setLoading(false);
                setDeleteDialogVisibility(false);
                return "timeout";
            } else {
                setLoading(false);
                setDeleteDialogVisibility(false);
                return "failed";
            }
        }
    }

    const showDeleteDialog = (user: User) => {
        if (!user) return;
        setUserToDelete(user);
        setDeleteDialogVisibility(true);
    }

    //Create user dialog + logic
    const createUser = async (username : string, email: string, firstName: string, lastName: string, password: string, allowed: boolean, admin: boolean) : Promise<String> => {
        try {
            setLoading(true);
            const response = await axios.post(`${config.apiUrl}/users/create`, {
                username: username,
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                allowed: allowed,
            }, { timeout: 5000 })
            setLoading(false);
            getUsersList();
            return "success";
        } catch (error) {
            if (!error.response) {
                setLoading(false);
                return "timeout";
            } else {
                setLoading(false);
                return "failed";
            }
        }
    }

    const showCreateDialog = () => {
        setCreateDialogVisibility(true);
    }

    const value = {
        //Auth
        isAuthenticated,
		login,
        logout,
        getUsersList,
        getLogs,
        user,
        isLoading, 
        loginMessage,
        logs,
        usersList,

        //Edit user
        editDialogVisibility,
        setEditDialogVisibility,
        userToEdit,
        showEditDialog,
        editUser,

        //Delete user
        deleteUser,
        setDeleteDialogVisibility,
        userToDelete,
        showDeleteDialog,
        deleteDialogVisibility,

        //Create user
        createUser,
        createDialogVisibility,
        setCreateDialogVisibility,
        showCreateDialog
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