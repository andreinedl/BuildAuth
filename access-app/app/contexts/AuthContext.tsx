import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext } from "react";
import { config } from '../config';

interface AuthType {
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    user: {
        username: string;
        email: string;
        lastAccess: string;
        allowed: string;
        firstName: string;
        lastName: string;
    };
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthType>(undefined);

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const userInfo = {
        username: '',
        email: '',
        lastAccess: '',
        allowed: '',
        firstName: '',
        lastName: '',
    }

    const [user, setUser] = React.useState(userInfo);
    const [isAuthenticated, setAuthenticated] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await axios.post(`${config.apiUrl}/users/auth`, {
                username: username,
                password: password
            });
            if (response.status === 200) {
                setUser(response.data.userInfo);
                setAuthenticated(true);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
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

    const value = {
        isAuthenticated,
		login,
        logout,
        user,
        isLoading
	};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}