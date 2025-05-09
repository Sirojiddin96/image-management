import { ImageProp } from '@/hooks/fetchImage'
import { formatSize } from '@/utils/helper'
import Image from 'next/image'
import React from 'react'

interface ImageCardProps {
  key: string
  image: ImageProp
  handleImageDelete?: (path: string) => void
  handleImagePreview?: (path: string, type: string) => void
  handleDownloadImage?: (path: string) => void
}

const ImageCard = ({
  image,
  handleImageDelete,
  handleImagePreview,
  handleDownloadImage,
}: ImageCardProps) => {

  return (
    <div className="w-100 h-72 flex flex-col items-center justify-between p-3 border-1 border-gray-300 rounded-lg">
      <div className="w-full flex flex-row gap-x-3 items-center justify-center">
        <div className="flex flex-col items-start justify-start gap-1">
          <div className="h-46 flex items-center justify-center overflow-hidden relative rounded-lg bg-[rgba(0,0,0,0.2)]">
            <Image
              src={`/api/image?file=${image.compressedFile}`}
              alt="Uploaded Image"
              width={200}
              height={200}
              priority={true}
              style={{objectFit: 'cover', overflow: 'hidden' }}
              className="rounded-lg cursor-pointer overflow-hidden"
              onClick={() => handleImagePreview && handleImagePreview(image.compressedFile, 'compressed')}  
            />
          </div>
          <span className="text-sm text-gray-500">Compressed</span>
          <span className="text-sm text-gray-500">Size: {formatSize(image.compressedSize)} </span>
        </div>
        <div className="flex flex-col items-start justify-start gap-1">
            <div className="h-46 flex items-center justify-center overflow-hidden rounded-lg bg-[rgba(0,0,0,0.2)]">
            <Image
              src={`/api/image?file=${image.originalFile}`}
              alt="Uploaded Image"
              width={200}
              height={200}
              priority={true}
              style={{ objectFit: 'cover', overflow: 'hidden' }}
              className="rounded-lg cursor-pointer overflow-hidden"
              onClick={() => handleImagePreview && handleImagePreview(image.originalFile, 'original')}
            />
            </div>
          <span className="text-sm text-gray-500">Original</span>
          <span className="text-sm text-gray-500">Size: {formatSize(image.size)}</span>
        </div>
      </div>
      <div className="w-full flex flex-row gap-x-3 items-center justify-end mt-2">
        <Image
          src="/svg/delete.svg"
          alt="Compress"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={() => handleImageDelete && handleImageDelete(image.compressedFile)}
        />
        <Image
          src="/svg/download.svg"
          alt="Compress"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={() => handleDownloadImage && handleDownloadImage(image.compressedFile)}
        />
      </div>
    </div>
  )
}

export default ImageCard