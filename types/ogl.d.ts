// Type declarations for ogl (Open Graphics Library)
declare module 'ogl' {
  export interface OGLRenderingContext extends WebGL2RenderingContext {
    canvas: HTMLCanvasElement;
    renderer: Renderer;
  }

  export class Renderer {
    constructor(options?: {
      width?: number;
      height?: number;
      dpr?: number;
      alpha?: boolean;
      depth?: boolean;
      stencil?: boolean;
      antialias?: boolean;
      premultipliedAlpha?: boolean;
      preserveDrawingBuffer?: boolean;
      powerPreference?: string;
      autoClear?: boolean;
      webgl?: number;
    });
    gl: OGLRenderingContext;
    setSize(width: number, height: number): void;
    render(options: { scene: Mesh | Transform }): void;
  }

  export class Program {
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, options: {
      vertex: string;
      fragment: string;
      uniforms?: Record<string, { value: any }>;
      transparent?: boolean;
      cullFace?: number | null;
      frontFace?: number;
      depthTest?: boolean;
      depthWrite?: boolean;
      depthFunc?: number;
    });
    uniforms: Record<string, { value: any }>;
  }

  export class Mesh {
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, options: {
      geometry: Geometry | Triangle;
      program: Program;
      mode?: number;
    });
  }

  export class Geometry {
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, attributes?: Record<string, {
      size: number;
      data: Float32Array | Uint16Array | Uint32Array;
    }>);
  }

  export class Triangle extends Geometry {
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext);
  }

  export class Transform {
    constructor();
    position: Vec3;
    rotation: Vec3;
    scale: Vec3;
    addChild(child: Transform | Mesh): void;
    removeChild(child: Transform | Mesh): void;
  }

  export class Vec2 {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    set(x: number, y?: number): this;
  }

  export class Vec3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    set(x: number, y?: number, z?: number): this;
  }

  export class Color {
    constructor(color?: string | number | number[]);
    r: number;
    g: number;
    b: number;
    set(color: string | number | number[]): this;
  }
}
