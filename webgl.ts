// Ensure ThreeJS is in global scope for the 'examples/'
import canvasSketch, { SettingsObject } from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import * as THREE from 'three';
import palettes from 'nice-color-palettes';
import eases from 'eases';
import BezierEasing from 'bezier-easing';

// necessary to use require syntax for this to allow pragmas
const glsl = require('glslify');

global.THREE = THREE;

// Include any additional ThreeJS examples below
import 'three/examples/js/controls/OrbitControls';
import { Mesh, BoxGeometry, ShaderMaterial } from 'three';

const settings: SettingsObject = {
  dimensions: [512, 512],
  fps: 24,
  // duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  attributes: { antialias: true },
};

type Range = [number, number];

// config
const positionRange: Range = [-0.5, 0.5];
const scaleRange: Range = [-1, 1];
const bgColor = '#eee';
const scalar = 0.2;
const shapes = 70;
const repeatTime = 4;
const shadowColour = 'black';
const rotationScalar = 0.5;

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

  let palette = random.pick(palettes);

  const fragmentShader = glsl(/* glsl */ `
    varying vec2 vUv;
    uniform vec3 color;

    void main() {
      gl_FragColor = vec4(color * vUv.x, 1.0);
    }
  `);
  const vertexShader = glsl(/* glsl */ `
    varying vec2 vUv;
    uniform float time;

    #pragma glslify: noise = require('glsl-noise/simplex/4d');

    void main() {
      vUv = uv;
      vec3 pos = position.xyz;
      pos += noise(vec4(position.xyz, time / 5.0));

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `);

  const meshes: Mesh<BoxGeometry, ShaderMaterial>[] = [];
  const addShapes = () => {
    // Setup a mesh with geometry + material
    for (let i = 0; i < shapes; i++) {
      // Setup a material
      const material = new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(random.pick(palette)) },
        },
        // color: random.pick(palette),
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
      meshes.push(mesh);
    }
  };

  addShapes();

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 2, 2);
  scene.add(light);
  scene.add(new THREE.AmbientLight(shadowColour));

  const easeFn = BezierEasing(0.62, -0.07, 0.37, 1.22);

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
      const t = Math.sin((time * Math.PI) / 16);
      scene.rotation.z = easeFn(t);

      meshes.forEach((mesh) => {
        mesh.material.uniforms.time.value = time;
      });
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};
canvasSketch(sketch, settings);
