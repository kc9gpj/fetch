import { useState } from 'react';
import { Dog } from '../types';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Dog[]>([]);
    const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addFavorite = (dog: Dog) => {
        setFavorites(prev => {
            if (prev.find(d => d.id === dog.id)) return prev;
            return [...prev, dog];
        });
    };

    const removeFavorite = (dogId: string) => {
        setFavorites(prev => prev.filter(dog => dog.id !== dogId));
    };

    const generateMatch = async () => {
        if (favorites.length === 0) {
            setError('Please add some dogs to your favorites first');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(favorites.map(dog => dog.id))
            });

            if (!response.ok) throw new Error('Failed to generate match');

            const { match: matchId } = await response.json();

            const dogResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify([matchId])
            });

            if (!dogResponse.ok) throw new Error('Failed to fetch matched dog');

            const [matchedDogData] = await dogResponse.json();
            setMatchedDog(matchedDogData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate match');
        } finally {
            setLoading(false);
        }
    };

    return {
        favorites,
        matchedDog,
        loading,
        error,
        addFavorite,
        removeFavorite,
        generateMatch
    };
};