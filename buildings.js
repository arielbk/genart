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
    const points = createGrid(6, 6);
    const margin = 400;
    return ({ context, width, height }) => {
        // white background
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);
        points.forEach(({ position }) => {
            const [u, v] = position;
            const x = (0, math_1.lerp)(margin, width - margin, u);
            const y = (0, math_1.lerp)(margin, height - margin, v);
            // the dot for the current grid point
            context.beginPath();
            context.arc(x, y, width * 0.005, 0, Math.PI * 2, false);
            context.fillStyle = '#ccc';
            context.fill();
            context.closePath();
        });
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
        const [u1, v1] = getRandomPoint().position;
        const [x1, y1] = uvToXy([u1, v1]);
        const [u2, v2] = getRandomPoint().position;
        const [x2, y2] = uvToXy([u2, v2]);
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineWidth = 8;
        context.stroke();
        // form a trapezoid with two parallel sides extending to bottom
        const [_, lastY] = uvToXy([0, 1]);
        context.moveTo(x1, y1);
        context.lineTo(x1, lastY);
        context.moveTo(x2, y2);
        context.lineTo(x2, lastY);
        context.lineTo(x1, lastY);
        context.stroke();
        // fill with a colour and stroke with background colour
        // repeat until all grid points are exhausted
        // layer shapes by their average y position
    };
};
(0, canvas_sketch_1.default)(sketch, settings);
