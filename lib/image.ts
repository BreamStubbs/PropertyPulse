// Client-side image processing for avatars. We resize/crop to a small square
// and re-encode as a compressed JPEG data URL so the synced JSON record stays
// small (no Supabase Storage bucket needed for the simple-sync model).

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB before processing

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = src;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Turn an uploaded image File into a square avatar data URL (center-cropped).
 * @param size output edge length in px (default 256)
 */
export async function fileToAvatarDataUrl(file: File, size = 256): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, etc.).");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("That image is too large. Please pick one under 10 MB.");
  }

  const src = await readAsDataUrl(file);
  const img = await loadImage(src);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image processing isn't supported in this browser.");

  // Cover-fit: scale so the image fills the square, then center-crop.
  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

  return canvas.toDataURL("image/jpeg", 0.85);
}

/**
 * Turn an uploaded image File into a gallery-sized JPEG data URL. Keeps the
 * aspect ratio and downscales so the longest edge is at most `maxEdge` px,
 * keeping the synced record reasonably small.
 */
export async function fileToGalleryDataUrl(file: File, maxEdge = 1280): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, etc.).");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("That image is too large. Please pick one under 10 MB.");
  }

  const src = await readAsDataUrl(file);
  const img = await loadImage(src);

  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image processing isn't supported in this browser.");
  ctx.drawImage(img, 0, 0, w, h);

  return canvas.toDataURL("image/jpeg", 0.82);
}
