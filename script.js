document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('animation-container');

  const scene = new THREE.Scene();
  
  // Adjusted for a full-screen display
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  camera.position.x = 300; 
  camera.position.y = -276;
  
  // Z is increased because it now needs to fit the heart into a full phone screen
  camera.position.z = 500; 
  camera.lookAt(300, -276, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  // Make the 3D space fill the entire window
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const path = document.querySelector("path");
  const length = path.getTotalLength();
  const vertices = [];
  const tl = gsap.timeline();

  const geometry = new THREE.BufferGeometry();

  for (let i = 0; i < length; i += 0.5) {
    const point = path.getPointAtLength(i);
    const vector = new THREE.Vector3(point.x, -point.y, 0);
    
    vector.x += (Math.random() - 0.5) * 30;
    vector.y += (Math.random() - 0.5) * 30;
    vector.z += (Math.random() - 0.5) * 70;
    
    vertices.push(vector);

    tl.from(vector, {
      x: 600 / 2,
      y: -552 / 2,
      z: 0,
      ease: "power2.inOut",
      duration: gsap.utils.random(2, 5)
    }, i * 0.002);
  }

  const positions = new Float32Array(vertices.length * 3);
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({ color: 0xff4d4d, size: 2 });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // === NEW SPARKLES CODE ===
  const sparkleGeo = new THREE.BufferGeometry();
  const sparkleCount = 300;
  const sparklePositions = new Float32Array(sparkleCount * 3);
  
  // Scatter the sparkles randomly around the background
  for (let i = 0; i < sparkleCount * 3; i += 3) {
    sparklePositions[i] = 300 + (Math.random() - 0.5) * 1000;     // x
    sparklePositions[i+1] = -276 + (Math.random() - 0.5) * 1000;  // y
    sparklePositions[i+2] = (Math.random() - 0.5) * 400 - 100;    // z
  }
  
  sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
  const sparkleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0.6 });
  const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
  scene.add(sparkles);
  // =========================

  const animate = function() {
    requestAnimationFrame(animate);

    const positionsAttribute = geometry.attributes.position;
    for (let i = 0; i < vertices.length; i++) {
      positionsAttribute.setXYZ(i, vertices[i].x, vertices[i].y, vertices[i].z);
    }
    positionsAttribute.needsUpdate = true;

    // Slowly float the sparkles upwards
    sparkles.position.y += 0.3;
    if(sparkles.position.y > 600) {
      sparkles.position.y = -400;
    }

    renderer.render(scene, camera);
  };

  animate();
  
  // Keeps the canvas perfectly sized if the phone is rotated
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
