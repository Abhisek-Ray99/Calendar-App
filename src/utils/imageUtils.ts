
export const prefetchImages = (urls: string[]): Promise<void[]> => {
    const promises = urls.map(src => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); 
        img.src = src;
      });
    });
  
    return Promise.all(promises);
  };