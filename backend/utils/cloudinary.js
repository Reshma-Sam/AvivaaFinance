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
 * Uploads a base64 string to Cloudinary.
 * Supports both images and PDF documents.
 * PDFs are fetched via the backend proxy (/pdf-proxy) — never opened directly
 * in the browser — so no fl_attachment trick is needed.
 * @param {string} base64Data - Base64 encoded string data.
 * @param {string} folder - Destination folder on Cloudinary.
 * @returns {Promise<string>} - Cloudinary secure URL or original base64 as fallback.
 */
export const uploadToCloudinary = async (base64Data, folder = 'avivaa') => {
  if (!base64Data) return null;

  // If already a Cloudinary URL (re-save scenario), return as-is
  if (typeof base64Data === 'string' && base64Data.startsWith('http')) {
    return base64Data;
  }

  // Fallback to raw Base64 if Cloudinary is not configured
  if (!isCloudinaryConfigured) {
    return base64Data;
  }

  try {
    const isPdf = typeof base64Data === 'string' && base64Data.startsWith('data:application/pdf');

    const options = {
      folder,
      resource_type: 'auto', // handles both images and PDFs
    };

    if (isPdf) {
      // Give PDF a clean filename without extension in public_id
      // Cloudinary will add .pdf automatically via format
      options.public_id = `agreement_${Date.now()}`;
      options.format = 'pdf';
    }

    const uploadResponse = await cloudinary.uploader.upload(base64Data, options);
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed, falling back to Base64:', error.message);
    return base64Data;
  }
};

/**
 * Parses a Cloudinary secure/standard URL and deletes the asset from Cloudinary.
 * Handles different resource types (image, raw) and version segments.
 * @param {string} url - The Cloudinary asset URL.
 */
export const deleteFromCloudinary = async (url) => {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return;
  }
  if (!isCloudinaryConfigured) {
    return;
  }
  
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return;
    
    const resourceType = parts[uploadIndex - 1] || 'image';
    const afterUploadParts = parts.slice(uploadIndex + 1);
    
    let publicIdWithExtensionParts = afterUploadParts;
    if (afterUploadParts[0] && afterUploadParts[0].startsWith('v') && !isNaN(afterUploadParts[0].substring(1))) {
      publicIdWithExtensionParts = afterUploadParts.slice(1);
    }
    
    const publicIdWithExtension = publicIdWithExtensionParts.join('/');
    
    let publicId = publicIdWithExtension;
    if (resourceType !== 'raw') {
      const dotIndex = publicIdWithExtension.lastIndexOf('.');
      if (dotIndex !== -1) {
        publicId = publicIdWithExtension.substring(0, dotIndex);
      }
    }
    
    console.log(`Deleting Cloudinary asset. Resource type: ${resourceType}, Public ID: ${publicId}`);
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Failed to delete asset from Cloudinary:', error.message);
  }
};

