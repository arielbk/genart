import canvasSketch from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
  suffix: String(seed),
  dimensions: [2048, 2048],
};

type Point = {
  position: [number, number];
};

const sketch = () => {
  const createGrid = (width = 6, height = 6) => {
    const points: Point[] = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const u = width <= 1 ? 0.5 : x / (width - 1);
        const v = height <= 1 ? 0.5 : y / (height - 1);
        points.push({
          position: [u, v],
        });
      }
    }
    return points;
  };

  const points = createGrid(6, 6);
  const margin = 400;

  return ({ context, width, height }) => {
    // white background
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);

    points.forEach(({ position }) => {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // the dot for the current grid point
      context.beginPath();
      context.arc(x, y, width * 0.005, 0, Math.PI * 2, false);
      context.fillStyle = '#ccc';
      context.fill();
      context.closePath();
    });
  };
};

canvasSketch(sketch, settings);
