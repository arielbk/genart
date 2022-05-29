const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const seed = random.getRandomSeed();
random.setSeed(5249);

const settings = {
  suffix: seed,
  dimensions: [2048, 2048],
};

const sketch = () => {
  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 20;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v, 0.8)) * 0.05;
        points.push({
          color: random.pick(palette),
          radius,
          position: [u, v],
          rotation: Math.abs(random.noise2D(u, v)),
        });
      }
    }
    return points;
  };

  const points = createGrid();
  const margin = 400;

  return ({ context, width, height }) => {
    // white background
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);

    points.forEach(({ radius, position, color, rotation }) => {
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width * 0.4, 0, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.fill();

      context.save();

      context.fillStyle = color;
      context.font = `${radius * width * 0.5}px "Monospace"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('⚫️⬜️', 0, 0);

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
