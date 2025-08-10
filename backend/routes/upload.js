import express from 'express';
import { supabaseAdmin, STORAGE_BUCKET } from '../config/supabase.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// POST /upload - Upload image to Supabase Storage
router.post('/', uploadSingle, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file to storage',
        error: error.message
      });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileName: fileName,
        fileUrl: urlData.publicUrl,
        fileSize: file.size,
        mimeType: file.mimetype
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;
