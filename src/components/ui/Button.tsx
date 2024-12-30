import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
}

function Button({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {

    const styles = {
        base: 'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant: {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
            secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
            outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        },
        size: {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        }
    }

    const classes = `${styles.base} ${styles.variant[variant]} ${styles.size[size]} ${className}`

    return (
        <button
            className={classes}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button