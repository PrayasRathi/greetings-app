export const downloadImage = (dataUrl, filename = 'greeting.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const shareImage = async (dataUrl, text = 'Check out this greeting!') => {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'greeting.png', { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Greeting',
        text: text,
      });
      return true;
    } else {
      // Fallback for desktop/unsupported browsers
      downloadImage(dataUrl);
      return false;
    }
  } catch (error) {
    console.error('Error sharing image:', error);
    downloadImage(dataUrl);
    return false;
  }
};
