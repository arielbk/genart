declare var global: any;

declare module 'nice-color-palettes' {
  const palettes: string[][];
  export default palettes;
}

declare module 'glslify' {
  export default function glsl(code: string): string;
}
