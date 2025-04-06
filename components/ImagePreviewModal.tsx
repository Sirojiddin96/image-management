import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  type: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, isOpen, type, onClose }) => {
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-200 ease-in-out ${opened ? 'opacity-100' : 'opacity-0'}`}>
      <button
        type='button'
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-50 w-15 h-15 text-5xl cursor-pointer"
      >
        &times;
      </button>
      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl">
        <div className="p-4">
          <Image
            src={`/api/image?file=${imageUrl}`}
            alt="Uploaded Image"
            width={350}
            height={350}
            unoptimized={type === 'original'}
            priority={true}
            style={{ objectFit: 'contain', height: '80vh', width: 'auto' }}
            className="rounded-lg"
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;