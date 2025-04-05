'use server'

import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sqlDB from '../../../connect';
import { NextRequest } from 'next/server';
import { existsSync } from 'fs';
import fs from 'fs';

interface ImageProp extends File {
  id: number;
}

export async function GET() {
  try {
    const images: ImageProp[] = await new Promise((resolve, reject) => {
      sqlDB.all('SELECT * FROM images', (err, rows) => {
        if (err) {
          console.error('❌ Failed to fetch images:', err.message);
          reject(err);
        } else {
          resolve(rows as ImageProp[]);
        }
      });
    })

    return new Response(
      JSON.stringify({
        resp: images,
        success: true,
        message: 'Images sent successfully'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch images',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const files = formData.getAll('files') as File[];
  try {
    if (!files.length) {
      return new Response(JSON.stringify({ error: 'No files uploaded' }), { status: 400 });
    }

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Create directories if they don’t exist
      const baseDir = path.join(process.cwd(), 'public', 'uploads');
      const originalDir = path.join(baseDir, 'original');
      const compressedDir = path.join(baseDir, 'compressed');

      if (!existsSync(originalDir)) await mkdir(originalDir, { recursive: true });
      if (!existsSync(compressedDir)) await mkdir(compressedDir, { recursive: true });

      // Create file names
      const timestamp = Date.now();
      const safeName = file.name.replace(/\s/g, '');
      const originalFilename = `${timestamp}-${safeName}`;
      const compressedFilename = originalFilename.replace(path.extname(safeName), '.jpg'); // ensure .jpg for compressed

      // Define paths
      const originalPath = path.join(originalDir, originalFilename);
      const compressedPath = path.join(compressedDir, compressedFilename);

      // Define relative paths for uploads
      const originalAbsolutePath = path.join('uploads', 'original', originalFilename);
      const compressedAbsolutePath = path.join('uploads', 'compressed', compressedFilename);

      // Compress the image using sharp
      const outputBuffer = await sharp(buffer)
        .resize({ width: 800, height: 600, fit: 'inside' }) // Resize within 800x600
        .jpeg({ quality: 80 }) // Compress to 80% quality
        .toBuffer();

      // Save to SQLite
      await new Promise<void>((resolve, reject) => {
        sqlDB.run(
          'INSERT INTO images (name, type, size, compressedSize, originalFile, compressedFile) VALUES (?, ?, ?, ?, ?, ?)',
          [file.name, file.type, file.size, outputBuffer.length, originalAbsolutePath, compressedAbsolutePath],
          async (err) => {
            if (err) {
              console.error("Error saving to database:", err.message);
              reject(err);
            } else {
              // Save original file
              await writeFile(originalPath, buffer);
              // Save compressed file
              await writeFile(compressedPath, outputBuffer);
              console.log("Image details saved to database successfully.");
              resolve();
            }
          }
        );
      });

      // Fetch the newly inserted image details
      const newImage = await new Promise<ImageProp>((resolve, reject) => {
        sqlDB.get(
          'SELECT * FROM images WHERE originalFile = ? AND compressedFile = ?',
          [originalAbsolutePath, compressedAbsolutePath],
          (err, row) => {
            if (err) {
              console.error("Error fetching new image from database:", err.message);
              reject(err);
            } else {
              resolve(row as ImageProp);
            }
          });
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Image compressed successfully',
          resp: newImage,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error compressing image',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { id, name, originalFile, compressedFile } = await req.json();

  if (!id || !name) {
    return await cleanDatabase();
  }

  try {
    const result = await new Promise<void>((resolve, reject) => {
      sqlDB.run('DELETE FROM images WHERE id = ?', [id], function (err) {
        if (err) {
          console.error('Error deleting image from database:', err.message);
          reject(err);
        } else {
          // Delete the image files from the server
          const compressedFilePath = compressedFile.split('/');
          const splitCompressedPath = compressedFilePath[compressedFilePath.length - 1];

          const originalFilePath = originalFile.split('/');
          const file = originalFilePath[originalFilePath.length - 1];

          const compressedImagePath = path.join(process.cwd(), 'public', 'uploads', 'compressed', splitCompressedPath);
          const originalImagePath = path.join(process.cwd(), 'public', 'uploads', 'original', file);

          if (existsSync(originalImagePath)) {
            fs.unlink(originalImagePath, (err) => {
              if (err) {
                console.error('Error deleting original image file:', err.message);
                reject(err);
              } else {
                resolve();
                console.log('Original image file deleted successfully.');
              }
            });
          } else {
            console.log('Original image file does not exist, skipping deletion.');
          }

          if (existsSync(compressedImagePath)) {
            fs.unlink(compressedImagePath, (err) => {
              if (err) {
                console.error('Error deleting compressed image file:', err.message);
                reject(err);
              } else {
                resolve();
                console.log('Compressed image file deleted successfully.');
              }
            });
          } else {
            console.log('Compressed image file does not exist, skipping deletion.');
          }
        }
      });
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Image deleted successfully',
        resp: result,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error deleting image',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

async function cleanDatabase() {
  try {
    await new Promise<void>((resolve, reject) => {
      sqlDB.run('DELETE FROM images', function (err) {
        if (err) {
          console.error('Error cleaning database:', err.message);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Delete all image files from the server
    const originalDir = path.join(process.cwd(), 'public', 'uploads', 'original');
    const compressedDir = path.join(process.cwd(), 'public', 'uploads', 'compressed');

    fs.rm(originalDir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error('Error deleting original images directory:', err.message);
      } else {
        console.log('Original images directory deleted successfully.');
      }
    });

    fs.rm(compressedDir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error('Error deleting compressed images directory:', err.message);
      } else {
        console.log('Compressed images directory deleted successfully.');
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database cleaned successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error cleaning database',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

