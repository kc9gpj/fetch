import { Doge } from '../types';
import { Heart } from 'lucide-react';

interface DogeCardProps {
    doge: Doge;
    isFavorite?: boolean;
    onToggleFavorite?: (doge: Doge) => void;
}

const DogeCard = ({ doge, isFavorite = false, onToggleFavorite }: DogeCardProps) => {

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={doge.img}
                alt={doge.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{doge.name}</h3>
                    {onToggleFavorite && (
                        <button
                            onClick={() => onToggleFavorite(doge)}
                            className="text-red-500 hover:text-red-700"
                        >
                            {isFavorite ? (
                                <Heart className="h-5 w-5 text-red-500 fill-current" />
                            ) : (
                                <Heart className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    )}
                </div>
                <p className="text-gray-600">{doge.breed}</p>
                <div className="mt-2 text-sm text-gray-500">
                    <p>Age: {doge.age} {doge.age === 1 ? 'year' : 'years'}</p>
                    <p>Zip Code: {doge.zip_code}</p>
                </div>
            </div>
        </div>
    );
};

export default DogeCard;