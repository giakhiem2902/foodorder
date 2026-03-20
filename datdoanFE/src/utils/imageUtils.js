/**
 * Utility function to get full image URL
 * Backend returns URLs like "/uploads/categories/filename"
 * We need to prepend the API base URL
 */
export const getImageUrl = (relativePath) => {
  if (!relativePath) return null;
  
  // If it's already a full URL, return as is
  if (relativePath.startsWith('http')) {
    return relativePath;
  }
  
  // Get API base URL from environment or default
  const baseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:8080';
  
  // Ensure path starts with /
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  return `${baseUrl}${path}`;
};
