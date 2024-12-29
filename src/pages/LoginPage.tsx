import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

interface FormData {
    name: string;
    email: string;
}

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
    const [error, setError] = useState<string>('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email) {
            setError('Please fill in all fields');
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        const success = await login(formData.name, formData.email);
        if (success) {
            navigate('/search');
        } else {
            setError('Login failed. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0">
            <div className="w-full max-w-md mx-auto px-4">
                <Card>
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-2xl font-bold text-center">Fetch Doge Adoption</CardTitle>
                        <CardDescription className="text-center">
                            Find your perfect furry friend
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="text"
                                name="name"
                                label="Name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <Input
                                type="email"
                                name="email"
                                label="Email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}
                            <Button type="submit" variant="primary" className="w-full">
                                Start Finding Doges
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;