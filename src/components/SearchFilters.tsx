import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

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

const SearchFilters: React.FC<SearchFiltersProps> = ({ breeds, onSearch }) => {
    const [filters, setFilters] = useState<SearchFilters>({
        breeds: [],
        sort: 'breed:asc'
    });

    const [selectedBreed, setSelectedBreed] = useState<string>('');

    const handleAddBreed = () => {
        if (selectedBreed && !filters.breeds.includes(selectedBreed)) {
            setFilters(prev => ({
                ...prev,
                breeds: [...prev.breeds, selectedBreed]
            }));
            setSelectedBreed('');
        }
    };

    const handleRemoveBreed = (breed: string) => {
        setFilters(prev => ({
            ...prev,
            breeds: prev.breeds.filter(b => b !== breed)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(filters);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Breed</label>
                <div className="flex gap-2">
                    <select
                        value={selectedBreed}
                        onChange={(e) => setSelectedBreed(e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 shadow-sm p-2"
                    >
                        <option value="">Select breed...</option>
                        {breeds.map(breed => (
                            <option key={breed} value={breed}>{breed}</option>
                        ))}
                    </select>
                    <Button type="button" onClick={handleAddBreed}>Add</Button>
                </div>
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
                <Input
                    type="number"
                    label="Min Age"
                    value={filters.ageMin || ''}
                    onChange={(e) => setFilters(prev => ({
                        ...prev,
                        ageMin: e.target.value ? Number(e.target.value) : undefined
                    }))}
                />
                <Input
                    type="number"
                    label="Max Age"
                    value={filters.ageMax || ''}
                    onChange={(e) => setFilters(prev => ({
                        ...prev,
                        ageMax: e.target.value ? Number(e.target.value) : undefined
                    }))}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Sort By</label>
                <select
                    value={filters.sort}
                    onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
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

            <Button type="submit" className="w-full">Apply Filters</Button>
        </form>
    );
};

export default SearchFilters;