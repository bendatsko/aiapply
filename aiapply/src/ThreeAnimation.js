import React, { useState, useRef, useEffect } from 'react';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  DirectionalLight,
  PlaneGeometry,
  ShadowMaterial,
  Vector2,
  Raycaster,
} from 'three';

function ThreeAnimation() {
  const ref = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.setSize(ref.current.clientWidth, ref.current.clientHeight);
    ref.current.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, ref.current.clientWidth / ref.current.clientHeight, 0.1, 1000);

    const len = 11;
    const wid = 8.5;
    const ratio = 2;

    const geometry = new BoxGeometry(wid / ratio, len / ratio, .25);
    const material = new MeshStandardMaterial({ color: 0xffffff });
    const cube = new Mesh(geometry, material);
    cube.castShadow = true;
    scene.add(cube);

    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    light.castShadow = true;
    scene.add(light);

    const shadowGeometry = new PlaneGeometry(2000, 2000);
    const shadowMaterial = new ShadowMaterial({ transparent: true, opacity: 0.5 });
    const shadowPlane = new Mesh(shadowGeometry, shadowMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    camera.position.z = 5;

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(cube);
      setIsHovered(intersects.length > 0);
    };

    const handleResize = () => {
      const width = ref.current.clientWidth;
      const height = ref.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      if (isHovered) cube.position.z -= 0.05;
      else cube.position.z += (0 - cube.position.z) * 0.05;

      cube.rotation.x -= 0.001;
      cube.rotation.y -= 0.001;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <div ref={ref} className="three-animation"></div>;
}

export default ThreeAnimation;
