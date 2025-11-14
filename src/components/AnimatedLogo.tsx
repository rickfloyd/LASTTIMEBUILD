import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const AnimatedLogo: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      1, // Square aspect for logo
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(144, 144); // 1.5 inch square at 96dpi

    // Globe
    const geometry = new THREE.IcosahedronGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x44aaff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Neon ring
    const ringGeometry = new THREE.RingGeometry(2.5, 2.6, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3bdc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const neonRing = new THREE.Mesh(ringGeometry, ringMaterial);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = -2.5;
    scene.add(neonRing);

    // Animation loop
    let frameId: number;
    const animate = () => {
      globe.rotation.y += 0.01;
      globe.rotation.x += 0.002;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    // Mount renderer
  const mountNode = mountRef.current;
    if (mountNode) {
      mountNode.appendChild(renderer.domElement);
    }
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-[144px] h-[144px] flex items-center justify-center relative">
      {/* Three.js 3D Globe Background */}
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Pink and Blue Candles Overlay */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 144 144" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Candle 1 - Pink */}
        <rect x="32" y="40" width="16" height="64" rx="6" fill="#FF3BDC" opacity="0.9" />
        <rect x="38" y="32" width="4" height="16" rx="2" fill="#FF3BDC" />
        
        {/* Candle 2 - Blue */}
        <rect x="64" y="56" width="16" height="48" rx="6" fill="#3B82F6" opacity="0.9" />
        <rect x="70" y="48" width="4" height="16" rx="2" fill="#3B82F6" />
        
        {/* Candle 3 - Pink */}
        <rect x="96" y="28" width="16" height="76" rx="6" fill="#FF3BDC" opacity="0.9" />
        <rect x="102" y="20" width="4" height="16" rx="2" fill="#FF3BDC" />
        
        {/* Glow effects */}
        <ellipse cx="40" cy="104" rx="14" ry="6" fill="#FF3BDC" fillOpacity="0.25" />
        <ellipse cx="72" cy="104" rx="14" ry="6" fill="#3B82F6" fillOpacity="0.25" />
        <ellipse cx="104" cy="104" rx="14" ry="6" fill="#FF3BDC" fillOpacity="0.25" />
      </svg>
    </div>
  );
};

export default AnimatedLogo;
