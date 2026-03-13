/**
 * Image compression utility for avatar uploads
 * Compresses images to reduce file size while maintaining quality
 */

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

/**
 * Compresses an image file using canvas
 * @param file - Original image file
 * @param options - Compression options
 * @returns Promise<Blob> - Compressed image blob
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 512,
    maxHeight = 512,
    quality = 0.7,
    mimeType = "image/jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Create canvas and draw resized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw white background for transparent images
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Gets the optimal mime type for compression based on file type
 */
export function getOptimalMimeType(file: File): string {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  // Prefer WebP for smaller file sizes with good quality
  // Fall back to JPEG for compatibility
  if (fileExtension === "png") {
    return "image/jpeg"; // PNG often has transparency, convert to JPEG for smaller size
  }

  return "image/jpeg";
}

/**
 * Compresses avatar image for upload
 * Optimized for profile pictures (square, smaller dimensions)
 */
export async function compressAvatar(file: File): Promise<Blob> {
  // Optimal settings for avatars
  return compressImage(file, {
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.8,
    mimeType: getOptimalMimeType(file),
  });
}

/**
 * Validates image file for avatar upload
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Image must be JPEG, PNG, WebP, or GIF",
    };
  }

  // Check file size (5MB max for avatar)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image must be less than 5MB",
    };
  }

  return { valid: true };
}

/**
 * Creates a preview URL for a file (before upload)
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL when done
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
