import { useState, useEffect } from 'react';

export interface ImageProp extends File {
  id: number;
  compressedFile: string;
  originalFile: string;
  compressedSize: number;
}

const useFetchImages = (apiUrl: string) => {
  const [images, setImages] = useState<ImageProp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setImages(data.resp);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [apiUrl]);

  const deleteImage = async (image: ImageProp) => {
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        body: JSON.stringify({ 
          id: image.id, 
          name: image.name,
          originalFile: image.originalFile,
          compressedFile: image.compressedFile,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setImages((prevImages) => prevImages.filter((img) => img.id !== image.id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    formData.append('files', files[0]);

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImages(prev => [...prev, data.resp[0]]);
      } else {
        throw new Error(data.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };


  const cleanDatabase = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        body: JSON.stringify({ clean: true }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setImages([]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  }

  return { images, loading, error, setImages, deleteImage, handleImageUpload, cleanDatabase };
};

export default useFetchImages;