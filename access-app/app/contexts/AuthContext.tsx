import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext } from "react";
import { config } from '../config';

interface AuthType {
    login: (username: string, password: string) => Promise<boolean>;
    user: {
        username: string;
        email: string;
        lastAccess: string;
        allowed: string;
        firstName: string;
        lastName: string;
    };
    isLoading: boolean;
}

const AuthContext = createContext<Partial<AuthType>>({});

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
    const [isLoading, setLoading] = React.useState(false);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await axios.post(`${config.apiUrlLocal}/users/auth`, {
                username: username,
                password: password
            });
            if (response.status === 200) {
                console.log(response)
                setUser(response.data.userInfo);
                return true;
            } else {
                console.log(response)
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const value = {
		login,
        user,
        isLoading
	};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}