document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('animation-container');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  camera.position.x = 300; 
  camera.position.y = -276;
  camera.position.z = 500; 
  camera.lookAt(300, -276, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const path = document.querySelector("path");
  const length = path.getTotalLength();
  const vertices = [];
  
  // THIS IS THE MAGIC FOR THE LOOP: repeat: -1 loops forever, yoyo: true makes it reverse
  const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.8 });
  const geometry = new THREE.BufferGeometry();

  for (let i = 0; i < length; i += 0.5) {
    const point = path.getPointAtLength(i);
    const vector = new THREE.Vector3(point.x, -point.y, 0);
    
    // Keeps the fuzzy particle look
    vector.x += (Math.random() - 0.5) * 30;
    vector.y += (Math.random() - 0.5) * 30;
    vector.z += (Math.random() - 0.5) * 70;
    
    vertices.push(vector);

    // This creates the sequential "drawing" effect
    tl.from(vector, {
      x: 300,
      y: -276,
      z: 0,
      ease: "power2.out",
      duration: 1.5 + Math.random() * 0.5 // Slight random duration makes the trail look natural
    }, i * 0.0035); // This multiplier controls how fast the "wand" traces the heart
  }

  const positions = new Float32Array(vertices.length * 3);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ color: 0xff4d4d, size: 2 });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const sparkleGeo = new THREE.BufferGeometry();
  const sparkleCount = 300;
  const sparklePositions = new Float32Array(sparkleCount * 3);
  
  for (let i = 0; i < sparkleCount * 3; i += 3) {
    sparklePositions[i] = 300 + (Math.random() - 0.5) * 1000;
    sparklePositions[i+1] = -276 + (Math.random() - 0.5) * 1000;
    sparklePositions[i+2] = (Math.random() - 0.5) * 400 - 100;
  }
  
  sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
  const sparkleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0.6 });
  const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
  scene.add(sparkles);

  const mouse = new THREE.Vector2(-9999, -9999);
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mouse3D = new THREE.Vector3(-9999, -9999, 0);

  window.addEventListener('pointermove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, mouse3D);
  });

  window.addEventListener('pointerout', () => {
    mouse3D.set(-9999, -9999, 0);
  });

  const animate = function() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.0005;
    const hue = 0.95 + Math.sin(time) * 0.1;
    material.color.setHSL(hue % 1.0, 1.0, 0.6);
    sparkleMat.color.setHSL((hue + 0.1) % 1.0, 0.8, 0.8);

    const positionsAttribute = geometry.attributes.position;
    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      let targetX = v.x;
      let targetY = v.y;
      let targetZ = v.z;

      const dx = v.x - mouse3D.x;
      const dy = v.y - mouse3D.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 90) {
        const force = (90 - dist) / 90; 
        targetX += (dx / dist) * force * 50; 
        targetY += (dy / dist) * force * 50;
        targetZ += force * 50; 
      }

      positionsAttribute.setXYZ(i, targetX, targetY, targetZ);
    }
    positionsAttribute.needsUpdate = true;

    sparkles.position.y += 0.3;
    if(sparkles.position.y > 600) {
      sparkles.position.y = -400;
    }

    renderer.render(scene, camera);
  };

  animate();
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
