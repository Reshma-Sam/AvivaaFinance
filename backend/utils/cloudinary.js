import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary only if variables are available
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log("Cloudinary configuration loaded successfully.");
} else {
  console.warn("Cloudinary credentials missing in .env. Falling back to local Base64 storage.");
}

/**
 * Converts a Cloudinary raw/image URL for a PDF into a
 * force-download URL using the fl_attachment flag.
 * This bypasses the "untrusted customer" restriction on free accounts.
 */
const makePdfDownloadUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  // Insert fl_attachment into the delivery URL path
  // e.g. /upload/avivaa/... -> /upload/fl_attachment/avivaa/...
  return url.replace('/upload/', '/upload/fl_attachment/');
};

/**
 * Uploads a base64 string to Cloudinary.
 * Supports both images and PDF documents.
 * @param {string} base64Data - Base64 encoded string data.
 * @param {string} folder - Destination folder on Cloudinary.
 * @returns {Promise<string>} - Cloudinary secure URL or original string as fallback.
 */
export const uploadToCloudinary = async (base64Data, folder = 'avivaa') => {
  if (!base64Data) return null;

  // If already a URL (e.g. from previous upload), return as-is
  if (typeof base64Data === 'string' && base64Data.startsWith('http')) {
    return base64Data;
  }

  // Fallback to local Base64 if Cloudinary is not configured
  if (!isCloudinaryConfigured) {
    return base64Data;
  }

  try {
    const isPdf = typeof base64Data === 'string' && base64Data.startsWith('data:application/pdf');
    const options = {
      folder: folder,
      // Use 'auto' for all files — avoids the 'raw' untrusted-customer block
      resource_type: 'auto',
    };

    if (isPdf) {
      options.public_id = `agreement_${Date.now()}`;
      options.format = 'pdf';
    }

    const uploadResponse = await cloudinary.uploader.upload(base64Data, options);
    
    // For PDFs, append fl_attachment so browsers download instead of trying to render inline
    const url = uploadResponse.secure_url;
    return isPdf ? makePdfDownloadUrl(url) : url;
  } catch (error) {
    console.error("Cloudinary upload failed, falling back to Base64:", error.message);
    return base64Data;
  }
};

