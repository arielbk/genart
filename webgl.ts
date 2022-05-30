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

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor('#fff', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.SphereGeometry(1, 32, 16);
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const palette = random.pick(palettes);

  // Setup a mesh with geometry + material
  for (let i = 0; i < 40; i++) {
    // Setup a material
    const material = new THREE.MeshBasicMaterial({
      color: random.pick(palette),
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.4);
    scene.add(mesh);
  }

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.0;

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

      camera.aspect = viewportWidth / viewportHeight;
    },
    // Update & render your scene here
    render({ time }) {
      // mesh.rotation.y = time * 0.2;
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};
canvasSketch(sketch, settings);
