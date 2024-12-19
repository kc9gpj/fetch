import React from 'react';
import { Dog } from '../types';

interface DogCardProps {
    dog: Dog;
    isFavorite?: boolean;
    onToggleFavorite?: (dog: Dog) => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite = false, onToggleFavorite }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={dog.img}
                alt={dog.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{dog.name}</h3>
                    {onToggleFavorite && (
                        <button
                            onClick={() => onToggleFavorite(dog)}
                            className="text-red-500 hover:text-red-700"
                        >
                            {isFavorite ? '❤️' : '🤍'}
                        </button>
                    )}
                </div>
                <p className="text-gray-600">{dog.breed}</p>
                <div className="mt-2 text-sm text-gray-500">
                    <p>Age: {dog.age} years</p>
                    <p>Location: {dog.zip_code}</p>
                </div>
            </div>
        </div>
    );
};

export default DogCard;