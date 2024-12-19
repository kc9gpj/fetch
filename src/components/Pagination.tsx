import React from 'react';
import Button from './ui/Button';

interface PaginationProps {
    total: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
    onNext: () => void;
    onPrev: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
    total,
    pageSize,
    hasNext,
    hasPrev,
    onNext,
    onPrev
}) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex justify-between flex-1 sm:hidden">
                <Button
                    onClick={onPrev}
                    disabled={!hasPrev}
                    variant="outline"
                >
                    Previous
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!hasNext}
                    variant="outline"
                >
                    Next
                </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{pageSize}</span> of{' '}
                        <span className="font-medium">{total}</span> results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <Button
                            onClick={onPrev}
                            disabled={!hasPrev}
                            variant="outline"
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300"
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={onNext}
                            disabled={!hasNext}
                            variant="outline"
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300"
                        >
                            Next
                        </Button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Pagination;