import canvasSketch, { SettingsObject, SketchFunction } from 'canvas-sketch';
import createShader from 'canvas-sketch-util/shader';

// necessary to use require syntax for this to allow pragmas
const glsl = require('glslify');

// Setup our sketch
const settings: SettingsObject = {
  context: 'webgl',
  animate: true,
};

// Your glsl code
const frag = glsl(/* glsl */ `
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require(glsl-hsl2rgb);

  void main () {
    // this is the same as subtracting 0.5 from both vUv values
    vec2 center = vUv - 0.5;
    center.x *= aspect;
    float dist =  length(center);

    float alpha = smoothstep(0.201, 0.2, dist);

    float n = noise(vec3(center * 2.0, time * 0.2));

    vec3 color = hsl2rgb(0.6 + n * 0.3, 0.5, 0.5);

    gl_FragColor = vec4(color, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch: SketchFunction = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width / height,
    },
  });
};

canvasSketch(sketch, settings);
