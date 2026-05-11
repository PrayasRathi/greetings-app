import { useCallback } from 'react';

export const useCanvas = () => {
  const drawGreeting = useCallback(async (canvas, template, user) => {
    if (!canvas || !template || !user) return;

    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 800;

    canvas.width = width;
    canvas.height = height;

    // 1. Draw background image
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = template.imageUrl;
    
    await new Promise((resolve) => {
      bgImg.onload = resolve;
      bgImg.onerror = resolve; // Continue or handle error gracefully
    });

    // Draw image and cover the canvas
    const imgAspect = bgImg.width / bgImg.height;
    const canvasAspect = width / height;
    let renderW, renderH, x, y;

    if (imgAspect > canvasAspect) {
      renderH = height;
      renderW = height * imgAspect;
      x = (width - renderW) / 2;
      y = 0;
    } else {
      renderW = width;
      renderH = width / imgAspect;
      x = 0;
      y = (height - renderH) / 2;
    }

    ctx.drawImage(bgImg, x, y, renderW, renderH);

    // 2. Draw semi-transparent black rectangle at the top
    const bannerHeight = 80;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, bannerHeight);

    // 3. Draw user's name in white
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(user.displayName || 'Friend', width / 2, bannerHeight / 2);

    // 4. Draw user's circular avatar at top-left
    const avatarRadius = 45;
    const avatarX = 60;
    const avatarY = 40;

    const avatarImg = new Image();
    avatarImg.crossOrigin = "anonymous";
    avatarImg.src = user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default';

    let avatarLoaded = false;
    await new Promise((resolve) => {
      avatarImg.onload = () => {
        avatarLoaded = true;
        resolve();
      };
      avatarImg.onerror = () => {
        avatarLoaded = false;
        resolve();
      };
    });

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    if (avatarLoaded) {
      // Draw white background for avatar in case it's transparent
      ctx.fillStyle = 'white';
      ctx.fillRect(avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      ctx.drawImage(avatarImg, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
    } else {
      // Fallback: Colored circle with initial
      ctx.fillStyle = '#22C55E'; // Theme green
      ctx.fillRect(avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 40px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const initial = (user.displayName || 'G').charAt(0).toUpperCase();
      ctx.fillText(initial, avatarX, avatarY);
    }
    ctx.restore();

    // Draw stroke border for avatar
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Draw quote text at the bottom with gradient overlay
    const gradient = ctx.createLinearGradient(0, height - 200, 0, height);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height - 200, width, 200);

    ctx.fillStyle = 'white';
    ctx.font = '24px Inter';
    ctx.textAlign = 'center';
    
    // Wrap text logic
    const wrapText = (text, maxWidth) => {
      const words = text.split(' ');
      let line = '';
      const lines = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      return lines;
    };

    const lines = wrapText(template.quote, width - 100);
    const lineHeight = 35;
    const startY = height - (lines.length * lineHeight) - 40;
    
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), width / 2, startY + (index * lineHeight));
    });

    return canvas.toDataURL('image/png');
  }, []);

  return { drawGreeting };
};
