import React from 'react';

const LoadingAction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-2 text-lg text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingAction;
