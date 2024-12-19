import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import DogCard from '../components/DogCard';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const {
        favorites,
        matchedDog,
        loading,
        error,
        removeFavorite,
        generateMatch
    } = useFavorites();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Your Favorite Dogs</h1>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/search')}
                        >
                            Back to Search
                        </Button>
                        <Button onClick={handleLogout}>Logout</Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {error && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {matchedDog && (
                    <div className="mb-8 p-6 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">🎉 You've Been Matched!</h2>
                        <div className="max-w-sm mx-auto">
                            <DogCard dog={matchedDog} />
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        Your Favorites ({favorites.length})
                    </h2>
                    <Button
                        onClick={generateMatch}
                        disabled={favorites.length === 0 || loading}
                    >
                        {loading ? 'Generating Match...' : 'Generate Match'}
                    </Button>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">
                            You haven't added any dogs to your favorites yet.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => navigate('/search')}
                        >
                            Go Find Some Dogs
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {favorites.map(dog => (
                            <DogCard
                                key={dog.id}
                                dog={dog}
                                isFavorite={true}
                                onToggleFavorite={() => removeFavorite(dog.id)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FavoritesPage;