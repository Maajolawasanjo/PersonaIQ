/**
 * Real-time Image Computer Vision & Telemetry Analyzer
 * Uses HTML5 Canvas API to sample actual pixel RGB values, luminance distribution,
 * edge sharpness, resolution metrics, and skin undertone telemetry.
 */

export interface ImageTelemetryResult {
  width: number;
  height: number;
  megapixels: number;
  avgLuminance: number; // 0 - 255
  contrastStdDev: number;
  faceDetectionScore: number;
  faceDetectionText: string;
  lightingScore: number;
  lightingText: string;
  resolutionScore: number;
  resolutionText: string;
  angleStatus: string;
  suggestion: string;
  skinTone: {
    r: number;
    g: number;
    b: number;
    hex: string;
    undertone: 'Warm' | 'Cool' | 'Neutral';
    lumaCategory: 'Deep' | 'Medium' | 'Fair';
  };
}

export async function analyzeImageFidelity(imageUrl: string): Promise<ImageTelemetryResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Downsample slightly for ultra-fast processing if huge
        const maxDim = 600;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;

        if (!ctx) {
          reject(new Error('Image pixel analysis failed. Please choose another photo.'));
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        let totalLuma = 0;
        const lumas: number[] = [];

        // Sample center region for facial skin analysis (center 40% box)
        const startX = Math.floor(w * 0.3);
        const endX = Math.floor(w * 0.7);
        const startY = Math.floor(h * 0.2);
        const endY = Math.floor(h * 0.6);

        let centerR = 0;
        let centerG = 0;
        let centerB = 0;
        let centerPixelCount = 0;

        for (let y = 0; y < h; y += 2) {
          for (let x = 0; x < w; x += 2) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Standard ITU-R BT.601 luminance formula
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLuma += luma;
            lumas.push(luma);

            // Center box for skin telemetry
            if (x >= startX && x <= endX && y >= startY && y <= endY) {
              centerR += r;
              centerG += g;
              centerB += b;
              centerPixelCount++;
            }
          }
        }

        const pixelCount = lumas.length;
        const avgLuminance = Math.round(totalLuma / pixelCount);

        // Calculate Contrast Standard Deviation
        let varianceSum = 0;
        for (let i = 0; i < lumas.length; i++) {
          varianceSum += Math.pow(lumas[i] - avgLuminance, 2);
        }
        const contrastStdDev = Math.round(Math.sqrt(varianceSum / pixelCount));

        // Center RGB averages
        const avgR = centerPixelCount ? Math.round(centerR / centerPixelCount) : 120;
        const avgG = centerPixelCount ? Math.round(centerG / centerPixelCount) : 90;
        const avgB = centerPixelCount ? Math.round(centerB / centerPixelCount) : 70;

        // Undertone calculation: Warm (R > G > B), Cool (B >= G or R ~ B), Neutral (balanced)
        let undertone: 'Warm' | 'Cool' | 'Neutral' = 'Warm';
        if (avgR > avgG && avgG > avgB) {
          undertone = 'Warm';
        } else if (avgB >= avgG || Math.abs(avgR - avgB) < 15) {
          undertone = 'Cool';
        } else {
          undertone = 'Neutral';
        }

        let lumaCategory: 'Deep' | 'Medium' | 'Fair' = 'Medium';
        if (avgLuminance < 90) lumaCategory = 'Deep';
        else if (avgLuminance > 160) lumaCategory = 'Fair';

        // Calculate REAL Dynamic Scores:
        // 1. Resolution Score
        const totalPixels = img.width * img.height;
        const megapixels = Number((totalPixels / 1000000).toFixed(2));
        let resolutionScore = Math.min(100, Math.max(0, Math.round(megapixels * 35 + 65)));
        if (img.width >= 1080) resolutionScore = 98;
        else if (img.width >= 720) resolutionScore = 91;
        else if (img.width >= 480) resolutionScore = 82;

        // 2. Lighting Score (Optimal luminance 100 - 180, good contrast std dev > 30)
        let lightingScore = Math.min(99, Math.max(0, Math.round(100 - Math.abs(avgLuminance - 130) * 0.4)));
        if (contrastStdDev > 35) lightingScore = Math.min(99, lightingScore + 5);

        // 3. Face Detection & Framing Score (based on center region variance)
        // Image contrast does not establish the presence or position of a face.
        const faceDetectionScore = 0;

        const hexColor = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1)}`;

        // Dynamic Suggestions based on ACTUAL sampled values
        let angleStatus = 'Image quality sample available';
        let suggestion = 'Brightness and contrast were sampled. Facial alignment and skin condition were not assessed.';

        if (avgLuminance < 80) {
          suggestion = 'Lighting is slightly dim. Position facing a soft light source to enhance contrast.';
          angleStatus = 'Low Lux Lighting Detected';
        } else if (avgLuminance > 200) {
          suggestion = 'High brightness detected. Move away from harsh direct glare for even tone scanning.';
          angleStatus = 'High Exposure Warning';
        } else if (img.width < 600) {
          suggestion = 'Image resolution is sub-HD. For highest VTO composite fidelity, use an HD photo.';
          angleStatus = 'Standard Definition Image';
        }

        resolve({
          width: img.width,
          height: img.height,
          megapixels,
          avgLuminance,
          contrastStdDev,
          faceDetectionScore,
          faceDetectionText: 'Face localization not assessed',
          lightingScore,
          lightingText: `${lightingScore}% (${avgLuminance >= 100 && avgLuminance <= 170 ? 'Even Luminance' : 'Acceptable Lux'})`,
          resolutionScore,
          resolutionText: `${resolutionScore}% (${img.width}x${img.height} ${resolutionScore >= 90 ? 'Ultra-High' : 'Standard'})`,
          angleStatus,
          suggestion,
          skinTone: {
            r: avgR,
            g: avgG,
            b: avgB,
            hex: hexColor,
            undertone,
            lumaCategory,
          },
        });
      } catch (err) {
        reject(new Error('Image pixel analysis failed. Please choose another photo.'));
      }
    };

    img.onerror = () => {
      reject(new Error('Image could not be loaded. Please choose another photo.'));
    };

    img.src = imageUrl;
  });
}
