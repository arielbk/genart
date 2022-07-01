// Ensure ThreeJS is in global scope for the 'examples/'
import canvasSketch, { SettingsObject } from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import * as THREE from 'three';
import palettes from 'nice-color-palettes';
global.THREE = THREE;

// Include any additional ThreeJS examples below
import 'three/examples/js/controls/OrbitControls';

const settings: SettingsObject = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  attributes: { antialias: true },
};

type Range = [number, number];

// config
const positionRange: Range = [-0.5, 0.5];
const scaleRange: Range = [-1, 0.5];
const bgColor = '#fff';
const scalar = 0.2;

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
  const geometry = new THREE.BoxGeometry(2, 2);

  let palette = random.pick(palettes);

  // Setup a mesh with geometry + material
  for (let i = 0; i < 40; i++) {
    // Setup a material
    const material = new THREE.MeshStandardMaterial({
      color: random.pick(palette),
      // wireframe: random.value() > 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      random.range(positionRange[0], positionRange[1]),
      random.range(positionRange[0], positionRange[1]),
      random.range(positionRange[0], positionRange[1])
    );
    mesh.scale.set(
      random.range(scaleRange[0], scaleRange[1]),
      random.range(scaleRange[0], scaleRange[1]),
      random.range(scaleRange[0], scaleRange[1])
    );
    mesh.scale.multiplyScalar(scalar);
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight('#999'));

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 0, 4);

  scene.add(light);

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
      const difference = time < 60 ? time * 0.00001 : 0.0004;
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
canvasSketch(sketch, settings);
