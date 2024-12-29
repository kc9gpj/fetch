import { useState, useEffect } from 'react';
import { Doge } from '@/types';
import { useAuth } from '../context/AuthContext';

const getFavoritesKey = (userEmail: string) => `doge_favorites_${userEmail}`;

interface MatchResponse {
    match: string;
}

export const useFavorites = () => {
    const { userData } = useAuth();
    const storageKey = getFavoritesKey(userData?.email || '');

    const [favorites, setFavorites] = useState<Doge[]>(() => {
        if (!userData?.email) return [];
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [];
    });

    const [matchedDoge, setMatchedDoge] = useState<Doge | null>(null);
    const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);

    useEffect(() => {
        if (userData?.email) {
            localStorage.setItem(storageKey, JSON.stringify(favorites));
        }
    }, [favorites, userData?.email, storageKey]);

    useEffect(() => {
        if (!userData?.email) {
            setFavorites([]);
        } else {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        }
    }, [userData?.email, storageKey]);

    const addFavorite = (doge: Doge) => {
        setFavorites(prev => {
            if (prev.some(d => d.id === doge.id)) return prev;
            return [...prev, doge];
        });
    };

    const removeFavorite = (dogeId: string) => {
        setFavorites(prev => prev.filter(doge => doge.id !== dogeId));
    };

    const generateMatch = async () => {
        if (favorites.length === 0) {
            throw new Error('No favorites selected');
        }

        setIsGeneratingMatch(true);
        try {
            const matchResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(favorites.map(doge => doge.id))
            });

            if (!matchResponse.ok) throw new Error('Failed to generate match');

            const { match: matchId } = await matchResponse.json() as MatchResponse;

            const dogeResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify([matchId])
            });

            if (!dogeResponse.ok) throw new Error('Failed to fetch matched doge');

            const [matchedDogeData] = await dogeResponse.json() as Doge[];
            setMatchedDoge(matchedDogeData);

            return matchedDogeData;
        } finally {
            setIsGeneratingMatch(false);
        }
    };

    const clearMatchedDoge = () => {
        setMatchedDoge(null);
    };

    return {
        favorites,
        matchedDoge,
        isGeneratingMatch,
        addFavorite,
        removeFavorite,
        generateMatch,
        clearMatchedDoge
    };
};