import React, { useState } from 'react';

interface SearchFiltersProps {
    breeds: string[];
    onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
    breeds: string[];
    ageMin?: number;
    ageMax?: number;
    sort: string;
}

const SearchFilters = ({ breeds, onSearch }: SearchFiltersProps) => {
    const [filters, setFilters] = useState<SearchFilters>({
        breeds: [],
        sort: 'breed:asc'
    });

    const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBreed = e.target.value;
        if (newBreed && !filters.breeds.includes(newBreed)) {
            const newFilters = {
                ...filters,
                breeds: [...filters.breeds, newBreed]
            };
            setFilters(newFilters);
            onSearch(newFilters);
        }
    };

    const handleRemoveBreed = (breed: string) => {
        const newFilters = {
            ...filters,
            breeds: filters.breeds.filter(b => b !== breed)
        };
        setFilters(newFilters);
        onSearch(newFilters);
    };

    const handleAgeChange = (key: 'ageMin' | 'ageMax', value: string) => {
        const numValue = value === '' ? undefined : Number(value);
        const newFilters = {
            ...filters,
            [key]: numValue
        };
        setFilters(newFilters);
        onSearch(newFilters);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilters = {
            ...filters,
            sort: e.target.value
        };
        setFilters(newFilters);
        onSearch(newFilters);
    };

    return (
        <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Breed</label>
                <select
                    value=""
                    onChange={handleBreedChange}
                    className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                >
                    <option value="">Select breed...</option>
                    {breeds.map(breed => (
                        <option key={breed} value={breed}>{breed}</option>
                    ))}
                </select>
                <div className="flex flex-wrap gap-2 mt-2">
                    {filters.breeds.map(breed => (
                        <span
                            key={breed}
                            className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                        >
                            {breed}
                            <button
                                type="button"
                                onClick={() => handleRemoveBreed(breed)}
                                className="ml-1 text-blue-700 hover:text-blue-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                    <input
                        type="number"
                        min={0}
                        value={filters.ageMin ?? ''}
                        onChange={(e) => handleAgeChange('ageMin', e.target.value)}
                        className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
                    <input
                        type="number"
                        min={0}
                        value={filters.ageMax ?? ''}
                        onChange={(e) => handleAgeChange('ageMax', e.target.value)}
                        className="w-full rounded-md border border-gray-300 shadow-sm p-2"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Sort By</label>
                <select
                    value={filters.sort}
                    onChange={handleSortChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                >
                    <option value="breed:asc">Breed (A-Z)</option>
                    <option value="breed:desc">Breed (Z-A)</option>
                    <option value="age:asc">Age (Young to Old)</option>
                    <option value="age:desc">Age (Old to Young)</option>
                    <option value="name:asc">Name (A-Z)</option>
                    <option value="name:desc">Name (Z-A)</option>
                </select>
            </div>
        </div>
    );
};

export default SearchFilters;