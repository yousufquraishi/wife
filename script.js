document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('animation-container');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  
  // Center the camera on the SVG path coordinates
  camera.position.x = 300; 
  camera.position.y = -276;
  
  // LOWERING THIS NUMBER ZOOMED THE CAMERA IN, MAKING THE HEART BIGGER
  camera.position.z = 280; 

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  // Updated to match the new CSS container size
  renderer.setSize(380, 380);
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

  const animate = function() {
    requestAnimationFrame(animate);

    const positionsAttribute = geometry.attributes.position;
    for (let i = 0; i < vertices.length; i++) {
      positionsAttribute.setXYZ(i, vertices[i].x, vertices[i].y, vertices[i].z);
    }
    positionsAttribute.needsUpdate = true;

    renderer.render(scene, camera);
  };

  animate();
});
