export const generateComplementaryColorPalettes = (count: any) => {
  const colorPalettes = [];

  for (let i = 1; i <= count; i++) {
    const baseColor = getRandomHexColor();
    const palette = {
      name: `Palette ${i}`,
      colors: generateVariationsOfBaseColor(baseColor),
    };
    colorPalettes.push(palette);
  }

  return colorPalettes;
}

const generateVariationsOfBaseColor = (baseColor: any) => {
  const colorVariations = [baseColor];
  
  for (let i = 1; i < 5; i++) {
    const variation = generateVariationOfColor(baseColor);
    colorVariations.push(variation);
  }

  return colorVariations;
}

const generateVariationOfColor = (baseColor: any) => {
  const variation = adjustColorBrightness(baseColor, randomBrightnessVariation());
  return variation;
}

const adjustColorBrightness = (hexColor: any, percentage: any) => {
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  r = Math.min(255, Math.max(0, r * percentage));
  g = Math.min(255, Math.max(0, g * percentage));
  b = Math.min(255, Math.max(0, b * percentage));

  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const randomBrightnessVariation = () => {
  return .6 + Math.random() * 0.4; // Varies the brightness between 80% and 120%
}

const getRandomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const hexToRgb = (hex: any) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export const gradientString = (start: any, end: any) => {
  const startRgb = hexToRgb(start);
  const endRgb = hexToRgb(end);
  return `linear-gradient(180deg, rgba(${startRgb?.r}, ${startRgb?.g}, ${startRgb?.b}, 1) 0%, rgba(${endRgb?.r}, ${endRgb?.g}, ${endRgb?.b}, 1) 100%)`;
};

export const shuffle = (array: string[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export default generateComplementaryColorPalettes;
