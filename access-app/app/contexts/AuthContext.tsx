import axios from 'axios';
import React, { createContext, useContext } from "react";
import Spinner from 'react-native-loading-spinner-overlay';
import { ActivityIndicator } from 'react-native-paper';
import { config } from '../config';

interface AuthType {
    login: (username: string, password: string) => Promise<String>;
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
    const [loginMessage, setLoginMessage] = React.useState('');

    const login = async (username: string, password: string): Promise<String> => {
        try {
            setLoading(true);
            const response = await axios.post(`${config.apiUrl}/users/auth`, {
                username: username,
                password: password
            }, { timeout: 5000 })
            setUser(response.data.userInfo);
            setAuthenticated(true);
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

    const value = {
        isAuthenticated,
		login,
        logout,
        user,
        isLoading, 
        loginMessage
	};

    return (
        <AuthContext.Provider value={value}>
            {children}
            <Spinner visible={isLoading}/>
        </AuthContext.Provider>
    )
}