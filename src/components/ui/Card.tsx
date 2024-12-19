import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
            {children}
        </h3>
    );
};

export const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <p className={`mt-1 text-sm text-gray-500 ${className}`}>
            {children}
        </p>
    );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
};