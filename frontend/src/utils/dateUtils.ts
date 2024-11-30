export const formatTimeAgo = (uploadDate: Date | string): string => {
    if (!uploadDate) return 'Invalid date';
  
    const uploadedDate = new Date(uploadDate);
    if (isNaN(uploadedDate.getTime())) return 'Invalid date'; // Sjekker om datoen er ugyldig
  
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - uploadedDate.getTime()) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  