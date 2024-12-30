import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
    return (
        <div className={`bg-white rounded-lg shadow-md ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }: CardProps) => {
    return (
        <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = '' }: CardProps) => {
    return (
        <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
            {children}
        </h3>
    );
};

export const CardDescription = ({ children, className = '' }: CardProps) => {
    return (
        <p className={`mt-1 text-sm text-gray-500 ${className}`}>
            {children}
        </p>
    );
};

export const CardContent = ({ children, className = '' }: CardProps) => {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
};