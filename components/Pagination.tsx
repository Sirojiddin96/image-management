import { ImageProp } from '@/hooks/fetchImage';
import React from 'react'

interface ImageList {
  images: ImageProp[];
  currentPage: number;
  pageSize: number;
  pageHandler: (page: string) => void;
  totalPage: number;
}

const Pagination = ({ images, currentPage, pageHandler, totalPage }: ImageList) => {
  return (
    <>
      {images?.length > 0 && <div className="flex items-center justify-center w-full mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
          onClick={() => pageHandler('previous')}
        >
          Previous
        </button>
        <span className="mx-4 text-gray-700">Page { currentPage } of {totalPage}</span>
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
          onClick={() => pageHandler('next')}
        >
          Next
        </button>
      </div>}
    </>
  )
}

export default Pagination