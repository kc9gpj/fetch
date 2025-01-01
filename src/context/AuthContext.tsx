import React, { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    userData: User | null;
    login: (name: string, email: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AUTH_COOKIE_NAME = 'user_session';
const SESSION_DURATION = 60 * 60 * 1000;

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const sessionData = Cookies.get(AUTH_COOKIE_NAME);
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const expirationTime = new Date(session.expiresAt).getTime();
                return Date.now() <= expirationTime;
            } catch {
                return false;
            }
        }
        return false;
    });

    const [userData, setUserData] = useState<User | null>(() => {
        const sessionData = Cookies.get(AUTH_COOKIE_NAME);
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                return session.user;
            } catch {
                return null;
            }
        }
        return null;
    });

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

            const expirationTime = Date.now() + SESSION_DURATION;
            const sessionData = {
                user: { name, email },
                expiresAt: new Date(expirationTime).toISOString()
            };

            Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(sessionData), {
                expires: 1 / 24,
                sameSite: 'strict'
            });

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
            Cookies.remove(AUTH_COOKIE_NAME);
            setIsAuthenticated(false);
            setUserData(null);
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
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