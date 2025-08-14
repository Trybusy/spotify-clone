/**
 * Prototype de jeu 3D minimal avec Three.js + Rapier.
 * Pour lancer :
 *   npm install
 *   npm run dev
 * Puis ouvrir http://localhost:5173
 *
 * Contrôles : ZQSD (ou WASD), souris pour regarder, Espace pour sauter.
 */

// Constante optionnelle pour utiliser cannon-es à la place de Rapier.
// (Non implémenté ici, mais l'idée serait d'importer cannon-es et de
// recréer le monde physique et les collisions.)
const USE_CANNON = false;

import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import GUI from 'lil-gui';

// Paramètres configurables exposés via une GUI.
const params = {
  speed: 5,             // Vitesse horizontale max (m/s)
  accel: 20,            // Accélération lors de l'appui sur une touche
  mouseSensitivity: 0.002, // Sensibilité de la souris
  jumpStrength: 5,      // Force de saut
  gravity: -9.81        // Gravité globale
};

(async () => {
  try {
    await RAPIER.init();
  } catch (e) {
    console.error('Erreur lors de l\'initialisation de Rapier', e);
    return;
  }

  // === SCENE THREE.JS ===
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x88ccee); // ciel simple

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lumières de base
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
  hemi.position.set(0, 20, 0);
  scene.add(hemi);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 10, 2);
  scene.add(dirLight);

  // === MONDE PHYSIQUE RAPiER ===
  const world = new RAPIER.World({ x: 0, y: params.gravity, z: 0 });

  // Sol visuel
  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  scene.add(groundMesh);

  // Collider du sol
  const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  world.createCollider(RAPIER.ColliderDesc.cuboid(100, 0.1, 100), groundBody);

  // Quelques plateformes pour tester les sauts
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x339933 });
  for (let i = 0; i < 3; i++) {
    const mesh = new THREE.Mesh(boxGeo, boxMat);
    mesh.position.set(i * 3 - 3, 0.5, -5 - i * 2);
    scene.add(mesh);
    const rb = world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)
    );
    world.createCollider(RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5), rb);
  }

  // === JOUEUR ===
  const capsuleRadius = 0.3;
  const capsuleHalf = 0.8; // hauteur totale ~2 * 0.8 + 2*0.3 = 2.2 m

  const playerBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setCanSleep(false)
    .setTranslation(0, 2, 0);
  const playerBody = world.createRigidBody(playerBodyDesc);
  playerBody.lockRotations(true, true);
  const playerCollider = world.createCollider(
    RAPIER.ColliderDesc.capsule(capsuleHalf, capsuleRadius),
    playerBody
  );

  // Mesh de debug pour visualiser le joueur (non visible en vue FPS)
  const playerMesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(capsuleRadius, capsuleHalf * 2, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true })
  );
  scene.add(playerMesh);

  // Offset caméra pour se positionner à la hauteur des yeux
  const cameraOffset = new THREE.Vector3(0, capsuleHalf + capsuleRadius, 0);

  // === CONTROLES SOURIS (Pointer Lock) ===
  const startButton = document.getElementById('start-button');
  let pointerLocked = false;
  startButton.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
  });
  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === renderer.domElement;
    startButton.style.display = pointerLocked ? 'none' : 'block';
  });

  let yaw = 0;
  let pitch = 0;
  const euler = new THREE.Euler(0, 0, 0, 'YXZ');
  document.addEventListener('mousemove', (event) => {
    if (!pointerLocked) return;
    yaw -= event.movementX * params.mouseSensitivity;
    pitch -= event.movementY * params.mouseSensitivity;
    // Limite pour éviter de retourner la tête
    pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch));
  });

  // === CONTROLES CLAVIER ===
  const keyState = {};
  window.addEventListener('keydown', (e) => (keyState[e.code] = true));
  window.addEventListener('keyup', (e) => (keyState[e.code] = false));

  function getInputVector() {
    let forward = 0;
    let right = 0;
    if (keyState['KeyW'] || keyState['KeyZ']) forward += 1;
    if (keyState['KeyS']) forward -= 1;
    if (keyState['KeyA'] || keyState['KeyQ']) right -= 1;
    if (keyState['KeyD']) right += 1;
    const dir = new THREE.Vector3(right, 0, forward);
    if (dir.length() > 0) dir.normalize();
    return dir;
  }

  // Vérification si le joueur touche le sol via un raycast
  function isGrounded() {
    const ray = new RAPIER.Ray(playerBody.translation(), { x: 0, y: -1, z: 0 });
    const maxToi = capsuleHalf + capsuleRadius + 0.1;
    const hit = world.castRay(ray, maxToi, true);
    return hit && hit.toi <= maxToi;
  }

  function handleJump() {
    if (!keyState['Space']) return;
    if (isGrounded()) {
      const vel = playerBody.linvel();
      vel.y = params.jumpStrength;
      playerBody.setLinvel(vel, true);
    }
  }

  // === DEBUG GUI ===
  const gui = new GUI();
  gui.add(params, 'speed', 1, 20, 0.1);
  gui.add(params, 'mouseSensitivity', 0.0005, 0.01, 0.0005);
  gui.add(params, 'jumpStrength', 1, 20, 0.1);
  gui
    .add(params, 'gravity', -20, -1, 0.1)
    .onChange((v) => (world.gravity.y = v));

  // === BOUCLE PRINCIPALE ===
  const clock = new THREE.Clock();
  const fixedTimeStep = 1 / 60;
  let accumulator = 0;

  function gameLoop() {
    requestAnimationFrame(gameLoop);
    const delta = clock.getDelta();
    accumulator += delta;

    while (accumulator >= fixedTimeStep) {
      // Calcul du mouvement basé sur l'orientation de la caméra
      const input = getInputVector();
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(euler);
      const right = new THREE.Vector3(1, 0, 0).applyEuler(euler);
      const move = forward.multiplyScalar(input.z).add(right.multiplyScalar(input.x));

      const vel = playerBody.linvel();
      // Accélération
      if (move.length() > 0) {
        move.normalize();
        vel.x += move.x * params.accel * fixedTimeStep;
        vel.z += move.z * params.accel * fixedTimeStep;
      } else {
        // Décélération simple
        vel.x *= 0.8;
        vel.z *= 0.8;
      }

      // Limite de vitesse horizontale
      const horizSpeed = Math.hypot(vel.x, vel.z);
      if (horizSpeed > params.speed) {
        const scale = params.speed / horizSpeed;
        vel.x *= scale;
        vel.z *= scale;
      }

      playerBody.setLinvel(vel, true);
      handleJump();
      world.step();
      accumulator -= fixedTimeStep;
    }

    // Mise à jour orientation caméra
    euler.set(pitch, yaw, 0);
    camera.quaternion.setFromEuler(euler);

    // Synchronisation des objets visuels avec la physique
    const t = playerBody.translation();
    playerMesh.position.set(t.x, t.y, t.z);
    camera.position.set(t.x, t.y, t.z).add(cameraOffset);

    renderer.render(scene, camera);
  }
  gameLoop();

  // Gestion du redimensionnement de la fenêtre
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
