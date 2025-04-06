'use server'

import fs, { existsSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import sqlDB from '../../../connect';
import { internalServerError } from '../errorHandler';

interface ImageProp extends File {
  id: number;
}

export async function GET(res: NextResponse) {
  console.log(res.status);
  try {
    const images: ImageProp[] = await new Promise((resolve, reject) => {
      sqlDB.all('SELECT * FROM images', (err, rows) => {
        if (err) {
          reject(err);
          return internalServerError(`Failed to fetch images: ${err.message}`);
        } else {
          resolve(rows as ImageProp[]);
        }
      });
    })

    return NextResponse.json({
      success: true,
      message: 'Images fetched successfully',
      resp: images
    }, { status: 200 })
  } catch {
    return internalServerError('Failed to fetch images');
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
              reject(err);
              return internalServerError(`Error saving to database: ${err.message}`);
            } else {
              // Save original file
              await writeFile(originalPath, buffer);
              // Save compressed file
              await writeFile(compressedPath, outputBuffer);
              resolve();
              return successResponse('Image details saved to database successfully.')
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
              reject(err);
              return createResponse(`Error fetching new image from database: ${err.message}`, 500)
            } else {
              resolve(row as ImageProp);
            }
          });
      });
      return successResponse('Image uploaded successfully', [newImage]);
    }
  } catch {
    return createResponse('Error compressing image', 500)
  }
}

export async function DELETE(req: NextRequest) {
  const { id, name, originalFile, compressedFile } = await req.json();

  if (!id || !name) {
    return cleanDatabase();
  }

  try {
    await new Promise<void>((resolve, reject) => {
      sqlDB.run('DELETE FROM images WHERE id = ?', [id], function (err) {
        if (err) {
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
                reject(err);
              } else {
                resolve();
              }
            });
          }

          if (existsSync(compressedImagePath)) {
            fs.unlink(compressedImagePath, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          }
        }
      });
    });
    return successResponse('Image deleted successfully');
  } catch {
    return createResponse('Error deleting image', 500)
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
        return createResponse(`Error deleting compressed images directory: ${err.message}`);
      } else {
        return successResponse('Original images directory deleted successfully')
      }
    });

    fs.rm(compressedDir, { recursive: true, force: true }, (err) => {
      if (err) {
        return createResponse(`Error deleting compressed images directory: ${err.message}`);
      } else {
        return successResponse('Compressed images directory deleted successfully')
      }
    });

    return successResponse('Database cleaned successfully', null);
  } catch (error) {
    console.error(error);
    return createResponse('Error cleaning database', 500)
  }
}

function createResponse(message: string, status: number = 500, success: boolean = false, resp: ImageProp[] | null = null) {
  return new Response(
    JSON.stringify({
      success,
      message,
      resp
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

function successResponse(message: string, resp: ImageProp[] | null = null) {
  return NextResponse.json({
    success: true,
    message,
    resp
  }, { status: 200 })
}