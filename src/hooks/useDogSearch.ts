import { useState, useEffect, useCallback } from 'react';
import { Dog } from '../types';

interface SearchParams {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: number;
    sort?: string;
}

export const useDogSearch = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [prevCursor, setPrevCursor] = useState<string | null>(null);
    const [breeds, setBreeds] = useState<string[]>([]);

    const fetchBreeds = useCallback(async () => {
        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch breeds');
            const breedList = await response.json();
            setBreeds(breedList);
        } catch (err) {
            console.error('Error fetching breeds:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch breeds');
        }
    }, []);

    const searchDogs = useCallback(async (params: SearchParams) => {
        setLoading(true);
        setError(null);

        try {
            // First, get the dog IDs
            const searchParams = new URLSearchParams();
            if (params.breeds?.length) searchParams.append('breeds', JSON.stringify(params.breeds));
            if (params.zipCodes?.length) searchParams.append('zipCodes', JSON.stringify(params.zipCodes));
            if (params.ageMin) searchParams.append('ageMin', params.ageMin.toString());
            if (params.ageMax) searchParams.append('ageMax', params.ageMax.toString());
            if (params.size) searchParams.append('size', params.size.toString());
            if (params.from) searchParams.append('from', params.from.toString());
            if (params.sort) searchParams.append('sort', params.sort);

            console.log('Fetching dogs with params:', params);

            const searchResponse = await fetch(
                `https://frontend-take-home-service.fetch.com/dogs/search?${searchParams}`,
                { credentials: 'include' }
            );

            if (!searchResponse.ok) throw new Error('Search failed');

            const searchData = await searchResponse.json();
            setTotal(searchData.total);
            setNextCursor(searchData.next || null);
            setPrevCursor(searchData.prev || null);

            if (searchData.resultIds.length) {
                const dogsResponse = await fetch(
                    'https://frontend-take-home-service.fetch.com/dogs',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(searchData.resultIds)
                    }
                );

                if (!dogsResponse.ok) throw new Error('Failed to fetch dogs');

                const dogsData: Dog[] = await dogsResponse.json();
                setDogs(dogsData);
            } else {
                setDogs([]);
            }
        } catch (err) {
            console.error('Error searching dogs:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBreeds();
    }, [fetchBreeds]);

    return {
        dogs,
        loading,
        error,
        total,
        nextCursor,
        prevCursor,
        breeds,
        searchDogs
    };
};