document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('animation-container');

  // 1. Set up the Scene and Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 250;

  // 2. Set up the Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(300, 300);
  container.appendChild(renderer.domElement);

  // 3. Create the 3D Object
  const geometry = new THREE.BoxGeometry(120, 120, 120);
  // MeshNormalMaterial creates a nice colorful effect as it rotates
  const material = new THREE.MeshNormalMaterial(); 
  const mesh = new THREE.Mesh(geometry, material);
  
  scene.add(mesh);

  // 4. Animation Loop
  const animate = function() {
    requestAnimationFrame(animate);
    
    // Rotate the object
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    
    renderer.render(scene, camera);
  };

  animate();
});
