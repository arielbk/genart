import canvasSketch, { Props } from 'canvas-sketch';
import { lerp } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';

const seed = random.getRandomSeed();
random.setSeed(seed);

const settings = {
  suffix: String(seed),
  dimensions: [2048, 2048],
};

type Coordinate = [number, number];

type Point = {
  position: Coordinate;
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

  const points = createGrid(5, 5);
  const margin = 400;

  return ({ context, width, height }: Props) => {
    // white background
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);

    // connect two random points on the grid
    const getRandomPoint = () => {
      const randomIndex = Math.round(random.value() * (points.length - 1));
      return points[randomIndex];
    };
    const uvToXy = ([u, v]: Coordinate): Coordinate => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, width - margin, v);
      return [x, y];
    };

    const createTrapezoidPath = (): Coordinate[] => {
      const [u1, v1] = getRandomPoint().position;
      const [x1, y1] = uvToXy([u1, v1]);
      const [u2, v2] = getRandomPoint().position;
      const [x2, y2] = uvToXy([u2, v2]);

      const point1: Coordinate = [x1, y1];
      const point2: Coordinate = [x2, y2];

      // form a trapezoid with two parallel sides extending to bottom
      const [_, lastY] = uvToXy([0, 1]);
      const point3: Coordinate = [x2, lastY];
      const point4: Coordinate = [x1, lastY];

      return [point1, point2, point3, point4];
    };

    const renderPoints = (points: Coordinate[]) => {
      const [point1, point2, point3, point4] = points;
      // create path
      context.beginPath();
      context.moveTo(point1[0], point1[1]);
      context.lineTo(point2[0], point2[1]);
      context.lineTo(point3[0], point3[1]);
      context.lineTo(point4[0], point4[1]);
      context.closePath();
      // fill with a colour and stroke with background colour
      context.lineWidth = 32;
      context.strokeStyle = '#fff';
      context.stroke();
      context.fillStyle = 'rgba(0, 0, 0, 0.1)';
      context.fill();
    };

    // collect trapezoid paths
    const trapezoids: Coordinate[][] = [];

    // remaining points on grid (that aren't the bottom row)
    let remainingPoints = points
      .filter(({ position }) => position[1] !== 1)
      .map(({ position }) => uvToXy(position));

    // repeat until all grid points are exhausted
    while (remainingPoints.length > 0) {
      trapezoids.push(createTrapezoidPath());
      const takenTrapezoidPoints: Coordinate[] = [];
      trapezoids.forEach((trapezoid) => {
        takenTrapezoidPoints.push(trapezoid[0]);
        takenTrapezoidPoints.push(trapezoid[1]);
      });
      remainingPoints = remainingPoints.filter((point) => {
        return takenTrapezoidPoints.every(
          (takenPoint) =>
            point[0] !== takenPoint[0] || point[1] !== takenPoint[1]
        );
      });
    }

    // layer shapes by their average y position
    trapezoids.sort((a, b) => {
      const aAverageY = (a[0][1] + a[1][1]) / 2;
      const bAverageY = (b[0][1] + b[1][1]) / 2;
      return aAverageY - bAverageY;
    });
    trapezoids.map((trapezoid) => renderPoints(trapezoid));
  };
};

canvasSketch(sketch, settings);
