import React, { useRef, useEffect } from 'react';
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
  TextureLoader,
} from 'three';
import textureURL from './resume.png'; // Replace with the path to your texture


const Constants = {
    CLEAR_COLOR: 0x000000,
    CUBE_COLOR: 0xffffff,
    LIGHT_COLOR: 0xffffff,
    SHADOW_COLOR: 0x000000,
  };


  const Cube = () => {
    const geometry = new BoxGeometry(4.25, 5.5, 0.07);
    const loader = new TextureLoader();
    const texture = loader.load(textureURL); // load the texture
    const material = new MeshStandardMaterial({ map: texture }); // apply the texture
    const cube = new Mesh(geometry, material);
    cube.castShadow = true;
    cube.position.x = -2;
    return cube;
  };
  
  
  const Light = (cameraPosition) => {
    const light = new DirectionalLight(Constants.LIGHT_COLOR, 1);
    light.position.copy(cameraPosition);
    light.castShadow = true;
    return light;
  };

  
function ThreeAnimation() {
  const ref = useRef();

  useEffect(() => {
    const initializeRenderer = () => {
        const renderer = new WebGLRenderer({ alpha: true, antialias: true });
        renderer.setClearColor(Constants.CLEAR_COLOR, 0);
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio); // Set to the device pixel ratio
        const { clientWidth: width, clientHeight: height } = ref.current;
        renderer.setSize(1.1* width * window.devicePixelRatio, 1.1* .75*height * window.devicePixelRatio); // Multiply by device pixel ratio
        ref.current.appendChild(renderer.domElement);
        return renderer;
    };
    

    const initializeScene = () => new Scene();

    const initializeCamera = () => {
      const camera = new PerspectiveCamera(75, ref.current.clientWidth / ref.current.clientHeight, 0.1, 2000);
      camera.position.z = 5;
      return camera;
    };

 

    const renderer = initializeRenderer();
    const scene = initializeScene();
    const camera = initializeCamera();
    const cube = Cube();
    const light = Light(camera.position);
    scene.add(cube, light);


    // Only Shadow Plane is needed.
    const shadowPlane = new Mesh(
      new PlaneGeometry(100, 100),
      new ShadowMaterial({ color: 0x000000 }) // ShadowMaterial is transparent by default
    );
    shadowPlane.rotation.x = - Math.PI / 2;
    shadowPlane.position.y = -5;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

const handleResize = () => {
    const { clientWidth: width, clientHeight: height } = ref.current;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio); // Update to the device pixel ratio on resize
    renderer.setSize(width * window.devicePixelRatio, height * window.devicePixelRatio); // Multiply by device pixel ratio
};

  
    window.addEventListener('resize', handleResize);
    
    cube.rotation.x -= 0.20;
    cube.rotation.y -= 0.25;
    
    let time = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      light.position.copy(camera.position);

      time += 0.01;
      cube.position.y = Math.sin(time) * 0.25 + 0.25; // Adjusted to make sure cube doesn't go below shadowPlane
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);
  
  return <div ref={ref} className="three-animation"></div>;
}

export default ThreeAnimation;
