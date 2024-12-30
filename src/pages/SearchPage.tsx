import { useFavorites } from '../hooks/useFavorites';
import SearchFilters, { SearchFilters as Filters } from '../components/SearchFilters';
import DogeCard from '../components/DogeCard';
import Pagination from '../components/Pagination';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Doge } from '@/types';
import { Heart } from 'lucide-react';
import { useDogeSearch } from '@/hooks/useDogeSearch';

const PAGE_SIZE = 25;

const SearchPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { doges, loading, error, total, nextCursor, prevCursor, breeds, searchDoges, handleNext, handlePrev } = useDogeSearch();
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        handleSearch({
            breeds: [],
            sort: 'breed:asc'
        });
    }, []);

    const handleSearch = (filters: Filters) => {
        setCurrentPage(1);
        searchDoges({
            ...filters,
            size: PAGE_SIZE
        });
    };

    const handleNextPage = () => {
        if (canGoNext) {
            setCurrentPage(prev => prev + 1);
            handleNext();
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            handlePrev();
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleToggleFavorite = (doge: Doge) => {
        const isFavorite = favorites.some(fav => fav.id === doge.id);
        if (isFavorite) {
            removeFavorite(doge.id);
        } else {
            addFavorite(doge);
        }
    };

    const canGoNext = !!nextCursor && currentPage * PAGE_SIZE < total;

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Doge</h1>
                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/favorites')}
                            className="flex items-center gap-2"
                        >
                            Favorites ({favorites.length})
                            <Heart className="h-5 w-5 text-red-500 fill-current" />
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
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading dogs...</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {doges.map((doge: Doge) => (
                                        <DogeCard
                                            key={doge.id}
                                            doge={doge}
                                            isFavorite={favorites.some(fav => fav.id === doge.id)}
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    ))}
                                </div>

                                {doges.length > 0 && (
                                    <div className="mt-6">
                                        <Pagination
                                            total={total}
                                            pageSize={PAGE_SIZE}
                                            hasNext={canGoNext}
                                            hasPrev={!!prevCursor && currentPage > 1}
                                            onNext={handleNextPage}
                                            onPrev={handlePrevPage}
                                            currentPage={currentPage}
                                        />
                                    </div>
                                )}

                                {doges.length === 0 && !loading && (
                                    <div className="text-center py-12 text-gray-500">
                                        No doges found matching your criteria
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