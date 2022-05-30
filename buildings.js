"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_sketch_1 = __importDefault(require("canvas-sketch"));
const math_1 = require("canvas-sketch-util/math");
const random_1 = __importDefault(require("canvas-sketch-util/random"));
const seed = random_1.default.getRandomSeed();
random_1.default.setSeed(seed);
const settings = {
    suffix: String(seed),
    dimensions: [2048, 2048],
};
const sketch = () => {
    const createGrid = (width = 6, height = 6) => {
        const points = [];
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
    return ({ context, width, height }) => {
        // white background
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);
        // connect two random points on the grid
        const getRandomPoint = () => {
            const randomIndex = Math.round(random_1.default.value() * (points.length - 1));
            return points[randomIndex];
        };
        const uvToXy = ([u, v]) => {
            const x = (0, math_1.lerp)(margin, width - margin, u);
            const y = (0, math_1.lerp)(margin, width - margin, v);
            return [x, y];
        };
        const createTrapezoidPath = () => {
            const [u1, v1] = getRandomPoint().position;
            const [x1, y1] = uvToXy([u1, v1]);
            const [u2, v2] = getRandomPoint().position;
            const [x2, y2] = uvToXy([u2, v2]);
            const point1 = [x1, y1];
            const point2 = [x2, y2];
            // form a trapezoid with two parallel sides extending to bottom
            const [_, lastY] = uvToXy([0, 1]);
            const point3 = [x2, lastY];
            const point4 = [x1, lastY];
            return [point1, point2, point3, point4];
        };
        const renderPoints = (points) => {
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
        const trapezoids = [];
        // remaining points on grid (that aren't the bottom row)
        let remainingPoints = points
            .filter(({ position }) => position[1] !== 1)
            .map(({ position }) => uvToXy(position));
        // repeat until all grid points are exhausted
        while (remainingPoints.length > 0) {
            trapezoids.push(createTrapezoidPath());
            const takenTrapezoidPoints = [];
            trapezoids.forEach((trapezoid) => {
                takenTrapezoidPoints.push(trapezoid[0]);
                takenTrapezoidPoints.push(trapezoid[1]);
            });
            remainingPoints = remainingPoints.filter((point) => {
                return takenTrapezoidPoints.every((takenPoint) => point[0] !== takenPoint[0] || point[1] !== takenPoint[1]);
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
(0, canvas_sketch_1.default)(sketch, settings);
