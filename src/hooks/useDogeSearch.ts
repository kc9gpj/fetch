import { useState, useEffect, useCallback } from 'react';
import { Doge } from '@/types';

const PAGE_SIZE = 25;

interface SearchParams {
    breeds?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: number;
    sort?: string;
}

export const useDogeSearch = () => {
    const [doges, setDoges] = useState<Doge[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [prevCursor, setPrevCursor] = useState<string | null>(null);
    const [breeds, setBreeds] = useState<string[]>([]);
    const [currentFilters, setCurrentFilters] = useState<SearchParams>({
        breeds: [],
        sort: 'breed:asc',
        size: PAGE_SIZE
    });

    const fetchBreeds = useCallback(async () => {
        try {
            const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch breeds');
            const breedList = await response.json();
            setBreeds(breedList);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch breeds');
        }
    }, []);

    const searchDoges = async (params: SearchParams) => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();

            if (params.breeds && params.breeds.length > 0) {
                params.breeds.forEach(breed => {
                    queryParams.append('breeds', breed);
                });
            }

            if (typeof params.ageMin === 'number') {
                queryParams.append('ageMin', params.ageMin.toString());
            }

            if (typeof params.ageMax === 'number') {
                queryParams.append('ageMax', params.ageMax.toString());
            }

            if (params.size) queryParams.append('size', params.size.toString());
            if (params.sort) queryParams.append('sort', params.sort);
            if (params.from) queryParams.append('from', params.from.toString());

            const searchUrl = `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams}`;

            const searchResponse = await fetch(searchUrl, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const searchData = await searchResponse.json();

            setTotal(searchData.total);
            setNextCursor(searchData.next || null);
            setPrevCursor(searchData.prev || null);

            if (searchData.resultIds && searchData.resultIds.length > 0) {
                const dogesResponse = await fetch(
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

                const dogesData = await dogesResponse.json();
                setDoges(dogesData);
            } else {
                setDoges([]);
            }
        } catch (err) {
            console.error('Search error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setDoges([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (nextCursor) {
            const fromParam = new URLSearchParams(nextCursor).get('from');
            searchDoges({
                ...currentFilters,
                from: fromParam ? Number(fromParam) : undefined
            });
        }
    };

    const handlePrev = () => {
        if (prevCursor) {
            const fromParam = new URLSearchParams(prevCursor).get('from');
            searchDoges({
                ...currentFilters,
                from: fromParam ? Number(fromParam) : undefined
            });
        }
    };

    useEffect(() => {
        fetchBreeds();
    }, [fetchBreeds]);

    return {
        doges,
        loading,
        error,
        total,
        nextCursor,
        prevCursor,
        breeds,
        searchDoges,
        handleNext,
        handlePrev
    };
};