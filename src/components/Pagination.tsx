interface PaginationProps {
    total: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
    onNext: () => void;
    onPrev: () => void;
    currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
    total,
    pageSize,
    hasNext,
    hasPrev,
    onNext,
    onPrev,
    currentPage
}) => {
    const startRange = ((currentPage - 1) * pageSize) + 1;
    const endRange = Math.min(currentPage * pageSize, total);

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border rounded-lg">
            <div className="flex-1 flex justify-between items-center">
                <button
                    onClick={onPrev}
                    disabled={!hasPrev}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${hasPrev
                        ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                        }`}
                >
                    Previous
                </button>

                <span className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startRange}</span>{' '}
                    to <span className="font-medium">{endRange}</span>{' '}
                    of <span className="font-medium">{total}</span> results
                </span>

                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${hasNext
                        ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;