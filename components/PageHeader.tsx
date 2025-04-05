import React from 'react'

interface HeaderProps {
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  cleanDatabase: () => void
  disabled: boolean
}

const PageHeader = (props: HeaderProps) => {
  return (
    <div className="flex flex-row items-end justify-between w-full">
      <div>
        <h1 className="text-2xl font-bold mb-4">Image Management Tool</h1>
        <p className="mb-4">
          Upload an image to compress it. The compressed image will be saved in the same directory.
        </p>
      </div>
      <div className="flex flex-row flex-wrap justify-end items-center gap-2">
        <button
          type="button"
          disabled={props.disabled}
          className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
            props.disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          }`}
          onClick={() => !props.disabled && props.cleanDatabase()}
        >
          Clean Database
        </button>
        <input
          className="border-1 border-gray-300 p-2 rounded-lg display-none"
          multiple
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          title="Choose an image file"
          onChange={(e) =>{
            props.handleImageUpload(e)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

export default PageHeader