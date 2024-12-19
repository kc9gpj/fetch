import React, { createContext, useState, useContext, ReactNode } from 'react';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userData, setUserData] = useState<User | null>(null);

    const login = async (name: string, email: string): Promise<boolean> => {
        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email })
            });

            if (!response.ok) throw new Error('Login failed');

            setIsAuthenticated(true);
            setUserData({ name, email });
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } finally {
            setIsAuthenticated(false);
            setUserData(null);
        }
    };

    const value: AuthContextType = {
        isAuthenticated,
        userData,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;