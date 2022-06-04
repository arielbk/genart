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
const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });
    // WebGL background color
    renderer.setClearColor('#111', 1);
    // Setup a camera
    const camera = new THREE.OrthographicCamera();
    // Setup your scene
    const scene = new THREE.Scene();
    // Setup a geometry
    // const geometry = new THREE.SphereGeometry(1.3, 5, 35);
    const geometry = new THREE.TorusGeometry(1, 1, 10);
    let palette = random_1.default.pick(nice_color_palettes_1.default);
    // Setup a mesh with geometry + material
    for (let i = 0; i < 40; i++) {
        // Setup a material
        const material = new THREE.MeshBasicMaterial({
            color: random_1.default.pick(palette),
            wireframe: random_1.default.value() > 0.5,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(random_1.default.range(-1, 0.5), random_1.default.range(-1, 0.5), random_1.default.range(-1, 0.5));
        mesh.scale.set(random_1.default.range(-1, 1), random_1.default.range(-1, 1), random_1.default.range(-1, 1));
        mesh.scale.multiplyScalar(0.2);
        scene.add(mesh);
    }
    const spotLight = new THREE.SpotLight('white');
    spotLight.position.set(1, 1, 1);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add(spotLight);
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
            camera.near = -100;
            camera.far = 100;
            // Set position & look at world center
            camera.position.set(zoom, zoom, zoom);
            camera.lookAt(new THREE.Vector3());
            // Update the camera
            camera.updateProjectionMatrix();
        },
        // Update & render your scene here
        render({ time }) {
            const repeatTime = 10;
            let direction = time % repeatTime > repeatTime / 2 ? 'left' : 'right';
            const difference = time < 60 ? time * 0.00001 : 0.004;
            camera.rotation.y =
                direction === 'right'
                    ? camera.rotation.y + difference
                    : camera.rotation.y - difference;
            renderer.render(scene, camera);
        },
        // Dispose of events & renderer for cleaner hot-reloading
        unload() {
            renderer.dispose();
        },
    };
};
(0, canvas_sketch_1.default)(sketch, settings);
