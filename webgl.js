"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Ensure ThreeJS is in global scope for the 'examples/'
const canvas_sketch_1 = __importDefault(require("canvas-sketch"));
const random_1 = __importDefault(require("canvas-sketch-util/random"));
const THREE = __importStar(require("three"));
const nice_color_palettes_1 = __importDefault(require("nice-color-palettes"));
global.THREE = THREE;
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
const settings = {
    // Make the loop animated
    animate: true,
    // Get a WebGL canvas rather than 2D
    context: 'webgl',
    attributes: { antialias: true },
};
// config
const positionRange = [-0.5, 0.5];
const scaleRange = [-1, 1];
const bgColor = '#eee';
const scalar = 0.2;
const shapes = 1;
const repeatTime = 1;
const shadowColour = 'black';
const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });
    // WebGL background color
    renderer.setClearColor(bgColor, 1);
    // Setup a camera
    const camera = new THREE.OrthographicCamera();
    // Setup your scene
    const scene = new THREE.Scene();
    // Setup a geometry
    // const geometry = new THREE.SphereGeometry(1.3, 5, 35);
    const geometry = new THREE.BoxGeometry(1, 1);
    let palette = random_1.default.pick(nice_color_palettes_1.default);
    const addShapes = () => {
        // Setup a mesh with geometry + material
        for (let i = 0; i < shapes; i++) {
            // Setup a material
            const material = new THREE.MeshToonMaterial({
                color: random_1.default.pick(palette),
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(random_1.default.range(positionRange[0], positionRange[1]), random_1.default.range(positionRange[0], positionRange[1]), random_1.default.range(positionRange[0], positionRange[1]));
            mesh.scale.set(random_1.default.range(scaleRange[0], scaleRange[1]), random_1.default.range(scaleRange[0], scaleRange[1]), random_1.default.range(scaleRange[0], scaleRange[1]));
            mesh.scale.multiplyScalar(scalar);
            scene.add(mesh);
        }
    };
    addShapes();
    const light = new THREE.DirectionalLight('white', 1);
    light.position.set(0, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(shadowColour));
    // draw each frame
    return {
        // Handle resize events here
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            const aspect = viewportWidth / viewportHeight;
            // Ortho zoom
            const zoom = 1;
            // Bounds
            camera.left = -zoom * aspect;
            camera.right = zoom * aspect;
            camera.top = zoom;
            camera.bottom = -zoom;
            // Near/Far
            camera.near = -1000;
            camera.far = 1000;
            // Set position & look at world center
            camera.position.set(zoom, zoom, zoom);
            camera.lookAt(new THREE.Vector3());
            // Update the camera
            camera.updateProjectionMatrix();
        },
        // Update & render your scene here
        render({ time }) {
            let direction = time % repeatTime > repeatTime / 2 ? 'left' : 'right';
            if (direction === 'left' && Math.floor(time) % 3 == 0)
                addShapes();
            const difference = time < 60 ? time * 0.00001 : 0.0004;
            camera.rotation.y =
                direction === 'right'
                    ? camera.rotation.y + difference * 2
                    : camera.rotation.y - difference * 2;
            renderer.render(scene, camera);
        },
        // Dispose of events & renderer for cleaner hot-reloading
        unload() {
            renderer.dispose();
        },
    };
};
(0, canvas_sketch_1.default)(sketch, settings);
