'use client';
import { useState } from "react";
import JSZip from "jszip";
import ImageCard from "@/components/ImageCard";
import PageHeader from "@/components/PageHeader";
import useFetchImages, { ImageProp } from "@/hooks/fetchImage";
import LoadingAction from "@/components/LoadingAction";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import DeleteImage from "@/components/DeleteImage";

const Home = () => {
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [image, setImage] = useState<ImageProp>({} as ImageProp);
  const [imagePath, setImagePath] = useState<string>('');
  const [type, setType] = useState<string>('' as string);
  const [deleteInfo, setDeleteInfo] = useState({
    title: '',
    message: '',
  });

  const {
    images,
    loading,
    deleteImage,
    cleanDatabase, handleImageUpload } = useFetchImages('/api/images')

  const handleImageDelete = async (image: ImageProp) => {
    if (image.id) {
      await deleteImage(image);
    } else {
      cleanDatabase();
    }
    setDeleteOpen(false);
  };

  const downloadImage = async (image: ImageProp) => {
    const zip = new JSZip();
    const originalFilePromise = fetch(`/${image.originalFile}`).then(res => res.blob());
    const compressedFilePromise = fetch(`/${image.compressedFile}`).then(res => res.blob());
    Promise.all([originalFilePromise, compressedFilePromise]).then(([originalBlob, compressedBlob]) => {
      zip.file(image.originalFile, originalBlob);
      zip.file(image.compressedFile, compressedBlob);

      zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `images_${image.id}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  }

  return (
    <main className="flex min-h-[100vh] flex-col items-start justify-start p-4">
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <PageHeader handleImageUpload={handleImageUpload}
          disabled={images.length === 0}
          cleanDatabase={() => {
            setDeleteInfo({
              title: 'Clean Database',
              message: 'Are you sure you want to clean the database? This action cannot be undone.',
            })
            setDeleteOpen(true);
          }} />
        <div className="w-full min-h-[75vh] flex flex-col md:flex-row flex-wrap gap-2 items-start p-4 rounded-lg border-1 border-gray-300 overflow-auto">
          {images?.length > 0 && !loading ?
            images.map((_) => (
              <ImageCard
                key={'id_' + _.id}
                image={_}
                handleImageDelete={() => {
                  setDeleteOpen(true);
                  setImage(_);
                  setDeleteInfo({
                    title: 'Delete Image',
                    message: 'Are you sure you want to delete this image? This action cannot be undone.',
                  });
                }}
                handleImagePreview={(imageUrl, type) => {
                  setType(type)
                  setImagePath(imageUrl);
                  setPreviewOpen(true);
                }}
                handleDownloadImage={() => downloadImage(_)}
              />
            )) :
            <div className="flex min-h-[75vh] flex-row items-center justify-center w-full">
              {loading ? (
                <LoadingAction />
              ) : (
                <div key={'no-image'} className="min-h-[75vh] bg-gray-200 flex items-center justify-center w-full">
                  <span className="text-gray-500">No images uploaded yet</span>
                </div>
              )}
            </div>
          }
        </div>
      </div>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setPreviewOpen(false)}
        imageUrl={imagePath}
        type={type}
      />
      <DeleteImage
        isOpen={isDeleteOpen}
        title={deleteInfo.title}
        message={deleteInfo.message}
        onClose={() => {
          setDeleteOpen(false);
          setImage({} as ImageProp);
          setDeleteInfo({
            title: '',
            message: '',
          });
        }}
        onDelete={() => handleImageDelete(image)}
      />
    </main>
  );
}
export default Home;
