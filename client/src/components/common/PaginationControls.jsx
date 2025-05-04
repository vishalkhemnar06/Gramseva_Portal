// client/src/components/common/PaginationControls.jsx
import React from 'react';

const PaginationControls = ({ currentPage, totalPages, onPageChange, isLoading = false }) => {

  // Basic buttons - enhance styling and logic later
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  return (
    <div className="mt-6 flex justify-center items-center space-x-2">
      <button
        onClick={handlePrev}
        disabled={currentPage <= 1 || isLoading}
        className="px-4 py-2 border rounded bg-white hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
      >
        « Prev
      </button>
      <span className="px-3 py-1 text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages || isLoading}
        className="px-4 py-2 border rounded bg-white hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
      >
        Next »
      </button>
      {/* Add more sophisticated page number links later if desired */}
    </div>
  );
};

export default PaginationControls;