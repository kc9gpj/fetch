import { useDogSearch } from '../hooks/useDogSearch';
import { useFavorites } from '../hooks/useFavorites';
import SearchFilters, { SearchFilters as Filters } from '../components/SearchFilters';
import DogCard from '../components/DogCard';
import Pagination from '../components/Pagination';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Dog } from '@/types';

const PAGE_SIZE = 25;

const SearchPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { dogs, loading, error, total, nextCursor, prevCursor, breeds, searchDogs } = useDogSearch();
    const { favorites, addFavorite, removeFavorite } = useFavorites();

    useEffect(() => {
        handleSearch({
            breeds: [],
            sort: 'breed:asc'
        });
    }, []);

    const handleSearch = (filters: Filters) => {
        searchDogs({
            ...filters,
            size: PAGE_SIZE
        });
    };

    const handleNext = () => {
        if (nextCursor) {
            searchDogs({
                size: PAGE_SIZE,
                from: Number(new URLSearchParams(nextCursor).get('from'))
            });
        }
    };

    const handlePrev = () => {
        if (prevCursor) {
            searchDogs({
                size: PAGE_SIZE,
                from: Number(new URLSearchParams(prevCursor).get('from'))
            });
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleToggleFavorite = (dog: Dog) => {
        const isFavorite = favorites.some(fav => fav.id === dog.id);
        if (isFavorite) {
            removeFavorite(dog.id);
        } else {
            addFavorite(dog);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Dog</h1>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/favorites')}
                            className="flex items-center gap-2"
                        >
                            Favorites ({favorites.length}) ❤️
                        </Button>
                        <Button onClick={handleLogout}>Logout</Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <SearchFilters breeds={breeds} onSearch={handleSearch} />
                    </div>

                    <div className="lg:col-span-3">
                        {error && (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-12">Loading...</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {dogs.map(dog => (
                                        <DogCard
                                            key={dog.id}
                                            dog={dog}
                                            isFavorite={favorites.some(fav => fav.id === dog.id)}
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    ))}
                                </div>

                                {dogs.length > 0 && (
                                    <div className="mt-6">
                                        <Pagination
                                            total={total}
                                            pageSize={PAGE_SIZE}
                                            hasNext={!!nextCursor}
                                            hasPrev={!!prevCursor}
                                            onNext={handleNext}
                                            onPrev={handlePrev}
                                        />
                                    </div>
                                )}

                                {dogs.length === 0 && !loading && (
                                    <div className="text-center py-12 text-gray-500">
                                        No dogs found matching your criteria
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SearchPage;