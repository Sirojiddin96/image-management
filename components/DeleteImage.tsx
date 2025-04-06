import React, { useEffect, useState } from 'react';

interface DeleteImageProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  message?: string;
}

const DeleteImage= ({ isOpen, onClose, onDelete, title, message }: DeleteImageProps) => {
  const [opened, setOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => { setOpen(true) }, 100)
    } else {
      setOpen(false)
    }
  }, [isOpen])
  
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.54)] transition-all duration-200 ease-in-out ${opened ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 z-50">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {message}
        </p>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type='button'
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteImage;