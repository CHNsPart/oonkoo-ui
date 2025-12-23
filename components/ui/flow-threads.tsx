"use client"

import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec3 } from 'ogl';

interface FlowingThreadsProps {
  color?: [number, number, number];
  intensity?: number;
  flowSpeed?: number;
  enableInteraction?: boolean;
  className?: string;
}

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragment = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec3 uColor;
uniform float uIntensity;
uniform float uFlowSpeed;
uniform vec2 uMousePos;
uniform float uInteraction;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 uv = vUv;
  uv.x *= uResolution.z;
  
  // Base wave pattern
  float wave = 0.0;
  float detail = 0.0;
  
  // Create layered wave patterns
  for (float i = 1.0; i <= 4.0; i++) {
    float freq = i * 1.5;
    float amp = 0.02 / i;
    float timeOffset = i * 5.0;
    
    wave += amp * sin(uv.x * freq * 6.28318530718 + uTime * uFlowSpeed * i * 0.5 + timeOffset);
    
    // Add noise detail
    vec2 noiseUv = uv * vec2(3.0, 1.0) + uTime * 0.1 * i;
    detail += (noise(noiseUv * i) - 0.5) * amp * 0.3;
  }
  
  // Mouse interaction distortion
  vec2 toMouse = uv - uMousePos;
  float mouseDist = length(toMouse);
  float interactionFactor = smoothstep(0.5, 0.0, mouseDist) * uInteraction * 0.5;
  
  // Apply distortion near mouse
  wave += interactionFactor * sin(uv.x * 10.0 + uTime) * 0.01;
  wave += interactionFactor * (noise(uv * 5.0 + uTime * 0.2) - 0.5) * 0.02;
  
  // Create thread silhouette
  float centerLine = uv.y + wave + detail * 0.5;
  float edgeSharpness = 0.015 * (1.0 + sin(uTime * 0.3) * 0.2);
  float fade = smoothstep(0.45, 0.5, uv.y) * (1.0 - smoothstep(0.5, 0.55, uv.y));
  
  // Thread core and glow
  float core = 1.0 - smoothstep(edgeSharpness, 0.0, abs(uv.y - centerLine));
  float glow = 0.3 * (1.0 - smoothstep(edgeSharpness * 3.0, 0.0, abs(uv.y - centerLine)));
  
  // Final composition
  float alpha = (core + glow) * fade * uIntensity;
  vec3 color = uColor * (core * 0.9 + glow * 0.4);
  
  // Add subtle noise texture
  color *= 0.95 + 0.05 * sin(noise(uv * 50.0 + uTime) * 10.0);
  
  gl_FragColor = vec4(color, alpha);
}
`;

const FlowingThreads: React.FC<FlowingThreadsProps> = ({
  color = [0.2, 0.6, 1.0],
  intensity = 1.0,
  flowSpeed = 1.0,
  enableInteraction = true,
  className = '',
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const mousePos = useRef<number[]>([0.5, 0.5]);
  const targetMousePos = useRef<number[]>([0.5, 0.5]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Initialize renderer
    const renderer = new Renderer({ alpha: true, dpr: Math.min(2, window.devicePixelRatio) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    // Create program
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec3() },
        uColor: { value: new Vec3(...color) },
        uIntensity: { value: intensity },
        uFlowSpeed: { value: flowSpeed },
        uMousePos: { value: new Vec3(0.5, 0.5, 0) },
        uInteraction: { value: enableInteraction ? 1 : 0 }
      }
    });

    // Create fullscreen triangle
    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    // Handle resize
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      program.uniforms.uResolution.value.set(width, height, width / height);
    };

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMousePos.current = [
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      ];
    };

    const handleMouseLeave = () => {
      targetMousePos.current = [0.5, 0.5];
    };

    // Setup events
    window.addEventListener('resize', resize);
    if (enableInteraction) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    
    resize();

    // Animation loop
    const update = (t: number) => {
      // Smooth mouse position transition
      mousePos.current[0] += (targetMousePos.current[0] - mousePos.current[0]) * 0.05;
      mousePos.current[1] += (targetMousePos.current[1] - mousePos.current[1]) * 0.05;
      
      // Update uniforms
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uMousePos.value.set(mousePos.current[0], mousePos.current[1]);
      
      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(update);
    };

    animationFrameId.current = requestAnimationFrame(update);

    // Cleanup
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', resize);

      if (enableInteraction) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }

      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }

      // Properly destroy WebGL context
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) loseContext.loseContext();
    };
  }, [color, intensity, flowSpeed, enableInteraction]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full relative overflow-hidden ${className}`} 
      {...rest} 
    />
  );
};

export default FlowingThreads;