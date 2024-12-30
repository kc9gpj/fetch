import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import DogeCard from '../components/DogeCard';
import Button from '../components/ui/Button';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const {
        favorites,
        matchedDoge,
        isGeneratingMatch,
        removeFavorite,
        generateMatch,
        clearMatchedDoge
    } = useFavorites();
    const [error, setError] = useState<string>('');

    const handleGenerateMatch = async () => {
        try {
            setError('');
            await generateMatch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate match');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Your Favorite Dogs</h1>
                    <Button onClick={() => navigate('/search')}>Back to Search</Button>
                </div>

                {matchedDoge && (
                    <div className="mb-8 bg-blue-50 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">You've Been Matched!</h2>
                            <Button variant="outline" onClick={clearMatchedDoge}>Close</Button>
                        </div>
                        <div className="max-w-sm mx-auto">
                            <DogeCard doge={matchedDoge} />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 text-red-500 text-center">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            Your Favorites ({favorites.length})
                        </h2>
                        <Button
                            onClick={handleGenerateMatch}
                            disabled={favorites.length === 0 || isGeneratingMatch}
                        >
                            {isGeneratingMatch ? 'Generating...' : 'Generate Match'}
                        </Button>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>You haven't added any doges to your favorites yet.</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => navigate('/search')}
                            >
                                Go Find Some Doges
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favorites.map(doge => (
                                <DogeCard
                                    key={doge.id}
                                    doge={doge}
                                    isFavorite={true}
                                    onToggleFavorite={() => removeFavorite(doge.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FavoritesPage;