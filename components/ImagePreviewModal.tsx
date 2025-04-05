import Image from 'next/image';
import React, { useEffect } from 'react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageUrl, isOpen, onClose }) => {
  const [opened, setOpen] = React.useState(false);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => { setOpen(true) }, 200)
    }else{
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
            src={`/${imageUrl}`}
            alt="Uploaded Image"
            width={500}
            height={500}
            priority={true}
            style={{ objectFit: 'cover' }}
            className="rounded-lg mr-3"
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;