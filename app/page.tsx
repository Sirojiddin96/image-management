'use client';
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [images, setImage] = useState<File[]>([]);
  return (
    <main className="flex min-h-[100vh] flex-col items-start justify-start p-4">
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <div className="flex flex-row items-end justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold mb-4">Image Management Tool</h1>
            <p className="mb-4">
              Upload an image to compress it. The compressed image will be saved in the same directory.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <input
              className="border-2 border-gray-300 p-2 rounded-lg display-none"
              multiple
              type="file"
              accept="image/*"
              title="Choose an image file"
              onChange={(e) => {
                console.log(e.target.files);
                const files = e.target.files;
                if (files && files[0]) {
                  const file = files[0];
                  console.log(file);
                  setImage(prev => [...prev, file]);
                }
              }}
            />
          </div>
        </div>
        <div className="w-full flex flex-row gap-2 items-center p-4 rounded-lg border-2 border-gray-300">
          {images.length > 0 ?
            images.map((_, index) => (
              <div key={index} className=" h-40 bg-gray-200 flex items-center justify-center mb-4">
                {(() => {
                  const objectUrl = URL.createObjectURL(images[index]);
                  console.log(objectUrl);
                  return (
                    <Image
                      src={objectUrl}
                      alt="Uploaded Image"
                      width={150}
                      height={150}
                      className="rounded-lg"
                      onLoad={() => URL.revokeObjectURL(objectUrl)}
                    />
                  );
                })()}
              </div>
            )) :
            <div className="h-100 bg-gray-200 flex items-center justify-center w-full">
              <span className="text-gray-500">No images uploaded yet</span>
            </div>
          }
        </div>
        {images.length > 0 && <div className="flex items-center justify-center w-full mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
            onClick={() => console.log("Previous Page")}
          >
            Previous
          </button>
          <span className="mx-4 text-gray-700">Page 1 of 10</span>
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
            onClick={() => console.log("Next Page")}
          >
            Next
          </button>
        </div>}
      </div>

    </main>
  );
}
