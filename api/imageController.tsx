'use server'

import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

type Data = {
  success: boolean;
  message: string;
  compressedImagePath?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('Request received:', req.method, req.body);
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { imagePath, outputQuality } = req.body;

    if (!imagePath || !outputQuality) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: imagePath or outputQuality',
      });
    }

    const inputPath = path.resolve(imagePath);
    const outputPath = path.resolve(
      path.dirname(imagePath),
      `compressed-${path.basename(imagePath)}`
    );

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({
        success: false,
        message: 'Image file not found',
      });
    }

    await sharp(inputPath)
      .jpeg({ quality: parseInt(outputQuality, 10) })
      .toFile(outputPath);

    res.status(200).json({
      success: true,
      message: 'Image compressed successfully',
      compressedImagePath: outputPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}