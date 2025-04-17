const textList = ["chiiiil", "coding", "everything"];
let index = 0;

function rotateText() {
  $("#rotatingText").fadeOut(500, function() {
    $(this).text(textList[index]).fadeIn(500);
    index = (index + 1) % textList.length;
  });
}

function createBubbles() {
  const bubbles = document.getElementById('bubbles');
  bubbles.innerHTML = '';
  const bubblesCount = Math.floor(window.innerWidth / 20);
  for (let i = 0; i < bubblesCount; i++) {
    const size = Math.random() * 20 + 5;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDelay = `${Math.random() * 8}s`;
    bubble.style.animationDuration = `${Math.random() * 6 + 4}s`;
    bubbles.appendChild(bubble);
  }
}

function createBubbleTrail() {
  const buoyBtn = document.getElementById('buoyBtn');
  const buoyRect = buoyBtn.getBoundingClientRect();
  const buoyCenter = {
    x: buoyRect.left + buoyRect.width / 2,
    y: buoyRect.top + buoyRect.height / 2
  };
  for (let i = 0; i < 8; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble-trail';
    const offsetX = (Math.random() - 0.5) * 40;
    const delay = Math.random() * 0.5;
    bubble.style.left = `${buoyCenter.x + offsetX}px`;
    bubble.style.top = `${buoyCenter.y}px`;
    bubble.style.width = `${Math.random() * 10 + 5}px`;
    bubble.style.height = bubble.style.width;
    bubble.style.animation = `bubbleRise 1s ${delay}s forwards`;
    document.body.appendChild(bubble);
    setTimeout(() => {
      document.body.removeChild(bubble);
    }, (delay + 1) * 1000);
  }
}

function createBirdFlock() {
  const birdsContainer = document.getElementById('birdsContainer');
  const flock = document.createElement('div');
  flock.className = 'bird-flock';
  const birdCount = Math.floor(Math.random() * 5) + 4;
  const top = Math.random() * 25 + 5;
  const duration = Math.random() * 15000 + 15000;
  flock.style.top = `${top}%`;
  for (let i = 0; i < birdCount; i++) {
    const bird = document.createElement('div');
    bird.className = 'bird';
    bird.style.top = `${Math.random() * 20 - 10}px`;
    const leftWing = document.createElement('div');
    leftWing.className = 'wing left';
    const rightWing = document.createElement('div');
    rightWing.className = 'wing right';
    bird.appendChild(leftWing);
    bird.appendChild(rightWing);
    if (Math.random() > 0.3) {
      bird.classList.add('flapping');
    }
    flock.appendChild(bird);
  }
  flock.style.animation = `flyAcross ${duration}ms linear forwards`;
  birdsContainer.appendChild(flock);
  setTimeout(() => {
    flock.style.opacity = '1';
  }, 100);
  setTimeout(() => {
    birdsContainer.removeChild(flock);
  }, duration + 500);
}

function startBirdFlocks() {
  setTimeout(createBirdFlock, Math.random() * 5000);
  setInterval(() => {
    if (Math.random() > 0.5) {
      createBirdFlock();
    }
  }, 60000);
}

let lastScrollPosition = 0;
let isBuoySinking = false;
let isBuoyEmerging = false;

function syncBuoyWithWaves(time, frequency, speed, amplitude) {
  const buoyContainer = document.getElementById('buoyBtnContainer');
  if (!buoyContainer || isBuoySinking || isBuoyEmerging) return;
  const x = window.innerWidth / 2;
  const y = Math.sin((x * frequency) + (time * speed)) * amplitude;
  buoyContainer.style.transform = `translateY(${y}px) rotate(${y/2}deg)`;
}

function toggleSeaweedVisibility() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu.classList.contains('underwater-nav')) {
    navMenu.classList.add('visible');
  } else {
    navMenu.classList.remove('visible');
  }
}

function handleMenuTransformation() {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const navMenu = document.getElementById('navMenu');
  if (scrollPosition > windowHeight * 0.5) {
    navMenu.classList.add('underwater-nav');
    toggleSeaweedVisibility();
  } else {
    navMenu.classList.remove('underwater-nav');
    toggleSeaweedVisibility();
  }
}

function drawWaves() {
  const canvas = document.getElementById('waveCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = canvas.parentElement.offsetHeight;
  const width = canvas.width;
  const height = canvas.height;
  let time = 0;
  const frequency1 = 0.02;
  const speed1 = 0.05;
  const amplitude1 = 15;

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);
    const waveColor1 = '#aaddff';
    const waveHeight1 = height * 0.5;
    const waveColor2 = '#aaddff';
    const waveHeight2 = height * 0.6;
    const amplitude2 = 15;
    const frequency2 = 0.015;
    const speed2 = 0.03;

    ctx.fillStyle = waveColor2;
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x++) {
      const y = Math.sin((x * frequency2) + (time * speed2)) * amplitude2 + waveHeight2;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = waveColor1;
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x++) {
      const y = Math.sin((x * frequency1) + (time * speed1)) * amplitude1 + waveHeight1;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    syncBuoyWithWaves(time, frequency1, speed1, amplitude1);
    time += 1;
    requestAnimationFrame(drawFrame);
  }
  drawFrame();
}

function handleScroll() {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const diveEffect = document.getElementById('diveEffect');
  const buoyBtn = document.getElementById('buoyBtn');
  const isScrollingDown = scrollPosition > lastScrollPosition;
  lastScrollPosition = scrollPosition;

  if (scrollPosition > 0 && scrollPosition < windowHeight) {
    const opacity = Math.min(0.7, scrollPosition / (windowHeight * 0.7));
    diveEffect.style.backgroundColor = `rgba(53, 185, 186, ${opacity})`;
    if (isScrollingDown && scrollPosition > windowHeight / 5 && !isBuoySinking) {
      isBuoySinking = true;
      isBuoyEmerging = false;
      buoyBtn.classList.remove('emerging');
      buoyBtn.classList.add('sinking');
      createBubbleTrail();
      setTimeout(() => {
        isBuoySinking = false;
      }, 1200);
    } else if (!isScrollingDown && scrollPosition < windowHeight / 2 && !isBuoyEmerging && buoyBtn.classList.contains('sinking')) {
      isBuoyEmerging = true;
      isBuoySinking = false;
      buoyBtn.classList.remove('sinking');
      buoyBtn.classList.add('emerging');
      setTimeout(() => {
        isBuoyEmerging = false;
        buoyBtn.classList.remove('emerging');
      }, 1200);
    }
  } else if (scrollPosition >= windowHeight) {
    diveEffect.style.backgroundColor = 'rgba(53, 185, 186, 0)';
    if (!buoyBtn.classList.contains('sinking')) {
      isBuoySinking = true;
      buoyBtn.classList.remove('emerging');
      buoyBtn.classList.add('sinking');
      createBubbleTrail();
      setTimeout(() => {
        isBuoySinking = false;
      }, 1200);
    }
  } else {
    diveEffect.style.backgroundColor = 'rgba(53, 185, 186, 0)';
  }

  if (scrollPosition === 0 && buoyBtn.classList.contains('sinking') && !isBuoyEmerging) {
    isBuoyEmerging = true;
    isBuoySinking = false;
    buoyBtn.classList.remove('sinking');
    buoyBtn.classList.add('emerging');
    setTimeout(() => {
      isBuoyEmerging = false;
      buoyBtn.classList.remove('emerging');
    }, 1200);
  }

  handleMenuTransformation();

  $('.section-content').each(function() {
    const sectionTop = $(this).offset().top - 150;
    const sectionBottom = sectionTop + $(this).outerHeight();
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      const sectionId = $(this).attr('id');
      $('.cloud-item').removeClass('active');
      $(`.cloud-item[data-section="${sectionId}"]`).addClass('active');
    }
  });
}

function handleFishInteraction() {
  const fishElements = document.querySelectorAll('.fish');
  document.addEventListener('mousemove', (e) => {
    fishElements.forEach(fish => {
      const rect = fish.getBoundingClientRect();
      const fishX = rect.left + rect.width / 2;
      const fishY = rect.top + rect.height / 2;
      const dx = e.clientX - fishX;
      const dy = e.clientY - fishY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        const angle = Math.atan2(dy, dx);
        const moveX = -Math.cos(angle) * 50;
        const moveY = -Math.sin(angle) * 30;
        fish.style.transform = `translate(${moveX}px, ${moveY}px) rotate(-10deg)`;
      } else {
        fish.style.transform = '';
      }
    });
  });
}

function createLoungeChair() {
  const chairGroup = new THREE.Group();

  // Base
  const baseGeometry = new THREE.BoxGeometry(1, 0.05, 0.25);
  const chairMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown wood
  const base = new THREE.Mesh(baseGeometry, chairMaterial);
  base.position.y = 0.025;
  base.castShadow = true;
  chairGroup.add(base);

  // Backrest
  const backrestGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.25);
  const backrest = new THREE.Mesh(backrestGeometry, chairMaterial);
  backrest.position.set(-0.25, 0.25, 0);
  backrest.rotation.x = Math.PI / 6; // 30 degrees instead of 90
  backrest.castShadow = true;
  chairGroup.add(backrest);

  return chairGroup;
}

function createUmbrella() {
  const umbrellaGroup = new THREE.Group();

  // Pole
  const poleGeometry = new THREE.CylinderGeometry(0.025, 0.025, 1, 8);
  const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 }); // Gray
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.y = 0.5;
  pole.castShadow = true;
  umbrellaGroup.add(pole);

  // Top
  const topGeometry = new THREE.ConeGeometry(0.5, 0.25, 16);
  const topMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Red
  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.y = 1;
  top.castShadow = true;
  umbrellaGroup.add(top);

  return umbrellaGroup;
}

function placeBeachItems(scene, islandRadius) {
  const itemCount = 3; // Number of sets
  for (let i = 0; i < itemCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = islandRadius - 2.0 + Math.random() * 0.5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Create and position lounge chair
    const chair = createLoungeChair();
    chair.position.set(x, 0.1, z);
    chair.rotation.y = angle + Math.PI / 2;
    scene.add(chair);

    // Create and position umbrella nearby
    const umbrella = createUmbrella();
    const umbrellaOffset = 0.5;
    const umbrellaX = x + Math.cos(angle + Math.PI / 2) * umbrellaOffset;
    const umbrellaZ = z + Math.sin(angle + Math.PI / 2) * umbrellaOffset;
    umbrella.position.set(umbrellaX, 0.1, umbrellaZ);
    scene.add(umbrella);
  }
}

function init3DIsland() {
  const canvas = document.getElementById('atollCanvas');

  // Устанавливаем внутренние размеры canvas на основе его отображаемых размеров
  // Removing direct canvas width/height setting - let THREE.js handle it

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#a0dbfb");

  // Determine if we're on a mobile device by checking viewport width
  const isMobile = window.innerWidth <= 768;

  // Adjust field of view and camera position based on device
  const fov = isMobile ? 85 : 75; // Wider FOV for mobile
  const cameraZ = isMobile ? 20 : 15; // Move camera further back on mobile

  const camera = new THREE.PerspectiveCamera(fov, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 8, cameraZ);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });

  // Set renderer size using client dimensions
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // Set pixel ratio for high DPI displays
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const islandRadius = 8;
  const innerRadius = 3.5;

  const islandSegments = 128;
  const heightMap = [];
  const noiseScale = 0.4;

  for (let i = 0; i <= islandSegments; i++) {
    heightMap[i] = [];
    for (let j = 0; j <= islandSegments; j++) {
      const theta = (i / islandSegments) * Math.PI * 2;
      const radius = (j / islandSegments) * (islandRadius - innerRadius) + innerRadius;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      const noise1 = simplex(x * 0.5, z * 0.5) * 0.6;
      const noise2 = simplex(x * 1.0, z * 1.0) * 0.3;
      const noise3 = simplex(x * 2.0, z * 2.0) * 0.1;
      let height = noise1 + noise2 + noise3;

      const distFromCenter = Math.sqrt(x * x + z * z);
      const islandEdgeWeight = 1.0 - smoothstep(innerRadius + 0.5, islandRadius - 0.5, distFromCenter);
      const beachWeight = 1.0 - smoothstep(islandRadius - 2.5, islandRadius - 0.3, distFromCenter);

      height = height * islandEdgeWeight * 0.5;
      height = Math.max(0, height);

      if (Math.random() < 0.01 && distFromCenter > innerRadius + 1 && distFromCenter < islandRadius - 1) {
        height += Math.random() * 0.15;
      }

      heightMap[i][j] = {
        height: height,
        isBeach: beachWeight > 0.5,
        isSand: distFromCenter > innerRadius + 0.8
      };
    }
  }

  const islandGeometry = new THREE.BufferGeometry();
  const vertices = [];
  const normals = [];
  const uvs = [];
  const colors = [];

  const sandColor = new THREE.Color(0xf4e4bc);
  const grassColor = new THREE.Color(0x498533);
  const darkSandColor = new THREE.Color(0xe0c69f);

  for (let i = 0; i < islandSegments; i++) {
    for (let j = 0; j < islandSegments; j++) {
      const createVertex = (i, j) => {
        const theta = (i / islandSegments) * Math.PI * 2;
        const radius = (j / islandSegments) * (islandRadius - innerRadius) + innerRadius;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        const heightData = heightMap[i][j];
        const y = heightData.height;

        vertices.push(x, y, z);

        const nX = heightMap[Math.min(i+1, islandSegments)][j].height - heightMap[Math.max(i-1, 0)][j].height;
        const nZ = heightMap[i][Math.min(j+1, islandSegments)].height - heightMap[i][Math.max(j-1, 0)].height;
        const normal = new THREE.Vector3(-nX, 2.0, -nZ).normalize();
        normals.push(normal.x, normal.y, normal.z);

        uvs.push(i / islandSegments, j / islandSegments);

        const distFromCenter = Math.sqrt(x * x + z * z);
        const distFromInner = distFromCenter - innerRadius;
        const distFromOuter = islandRadius - distFromCenter;

        const beachRatio = Math.min(1, Math.min(distFromInner, distFromOuter) / 1.5);
        const color = new THREE.Color();

        if (heightData.isBeach) {
          color.copy(sandColor);
        } else {
          const grassAmount = Math.min(1, y * 3 + beachRatio * 0.4);
          color.copy(sandColor).lerp(grassColor, grassAmount);

          color.r += (Math.random() - 0.5) * 0.05;
          color.g += (Math.random() - 0.5) * 0.05;
          color.b += (Math.random() - 0.5) * 0.05;
        }

        colors.push(color.r, color.g, color.b);
      };

      createVertex(i, j);
      createVertex(i + 1, j);
      createVertex(i, j + 1);

      createVertex(i + 1, j);
      createVertex(i + 1, j + 1);
      createVertex(i, j + 1);
    }
  }

  islandGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  islandGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  islandGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  islandGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const islandMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.8,
    metalness: 0.1,
    flatShading: false
  });

  const island = new THREE.Mesh(islandGeometry, islandMaterial);
  island.receiveShadow = true;
  island.castShadow = true;

  scene.add(island);

  const underwaterIslandGeometry = new THREE.RingGeometry(innerRadius - 1, islandRadius + 1, 64, 2);
  const underwaterIslandMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0c69f,
    roughness: 0.9,
    metalness: 0.1,
    transparent: true,
    opacity: 0.7
  });

  const underwaterIsland = new THREE.Mesh(underwaterIslandGeometry, underwaterIslandMaterial);
  underwaterIsland.rotation.x = -Math.PI / 2;
  underwaterIsland.position.y = -0.5;
  scene.add(underwaterIsland);

  function simplex(x, z) {
    const octaves = 4;
    let result = 0;
    let amplitude = 1.0;
    let frequency = 1.0;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      result += amplitude * (Math.sin(x * frequency) * Math.cos(z * frequency) * 0.5 + 0.5);
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2.0;
    }

    return result / maxValue;
  }

  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function createPalm(x, z, height, lean = 0, rotation = 0) {
    const palmGroup = new THREE.Group();

    const trunkHeight = height * 0.7;
    const trunkGeometry = new THREE.CylinderGeometry(0.12, 0.18, trunkHeight, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;

    const trunkCurve = new THREE.Group();
    trunkCurve.add(trunk);
    trunk.position.y = trunkHeight / 2;
    trunkCurve.rotation.x = lean;

    palmGroup.add(trunkCurve);

    const leavesGroup = new THREE.Group();

    const leafCount = 7 + Math.floor(Math.random() * 5);
    const leafColor = new THREE.Color(0x228b22);

    for (let i = 0; i < leafCount; i++) {
      const leafLength = height * 0.6;
      const leafWidth = 0.3;

      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.bezierCurveTo(
          leafWidth, leafLength * 0.3,
          leafWidth * 0.8, leafLength * 0.7,
          0, leafLength
      );
      leafShape.bezierCurveTo(
          -leafWidth * 0.8, leafLength * 0.7,
          -leafWidth, leafLength * 0.3,
          0, 0
      );

      const leafGeometry = new THREE.ShapeGeometry(leafShape, 12);
      const leafMaterial = new THREE.MeshPhongMaterial({
        color: leafColor,
        side: THREE.DoubleSide,
        flatShading: true
      });

      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.castShadow = true;

      leaf.rotation.x = -Math.PI / 2;
      leaf.rotation.z = (Math.PI * 2 / leafCount) * i;
      leaf.rotation.y = Math.PI / 6 + Math.random() * Math.PI / 4;

      leavesGroup.add(leaf);
    }

    leavesGroup.position.y = trunkHeight;
    trunkCurve.add(leavesGroup);

    if (Math.random() > 0.5) {
      const coconutCount = 1 + Math.floor(Math.random() * 3);
      const coconutGroup = new THREE.Group();

      for (let i = 0; i < coconutCount; i++) {
        const coconutGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const coconutMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
        const coconut = new THREE.Mesh(coconutGeometry, coconutMaterial);

        const angle = Math.random() * Math.PI * 2;
        const radius = 0.15;
        coconut.position.set(
            Math.cos(angle) * radius,
            -0.1 - Math.random() * 0.1,
            Math.sin(angle) * radius
        );

        coconut.castShadow = true;
        coconutGroup.add(coconut);
      }

      coconutGroup.position.y = trunkHeight;
      trunkCurve.add(coconutGroup);
    }

    palmGroup.position.set(x, 0, z);
    palmGroup.rotation.y = rotation;

    return palmGroup;
  }

  function createBush(x, z, size) {
    const bushGroup = new THREE.Group();
    const segments = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < segments; i++) {
      const leafSize = size * (0.5 + Math.random() * 0.5);
      const leafGeometry = new THREE.SphereGeometry(leafSize, 8, 8);

      const hue = 0.25 + Math.random() * 0.15;
      const color = new THREE.Color().setHSL(hue, 0.6, 0.4 + Math.random() * 0.2);

      const leafMaterial = new THREE.MeshPhongMaterial({
        color: color,
        flatShading: true
      });

      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(
          (Math.random() - 0.5) * size,
          leafSize + Math.random() * 0.2,
          (Math.random() - 0.5) * size
      );

      leaf.castShadow = true;
      bushGroup.add(leaf);
    }

    bushGroup.position.set(x, 0, z);
    return bushGroup;
  }

  function createRock(x, z, size) {
    const rockGeometry = new THREE.DodecahedronGeometry(size, 1);

    const vertices = rockGeometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      const z = vertices.getZ(i);

      vertices.setX(i, x + (Math.random() - 0.5) * 0.2 * size);
      vertices.setY(i, y + (Math.random() - 0.5) * 0.2 * size);
      vertices.setZ(i, z + (Math.random() - 0.5) * 0.2 * size);
    }
    rockGeometry.attributes.position.needsUpdate = true;
    rockGeometry.computeVertexNormals();

    const colorNoise = Math.random() * 0.2;
    const rockMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0.5 + colorNoise, 0.5 + colorNoise, 0.5 + colorNoise),
      flatShading: true,
      shininess: 0
    });

    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.position.set(x, size / 2, z);
    rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );

    rock.castShadow = true;
    rock.receiveShadow = true;

    return rock;
  }

  function createCoral(x, z, height, color) {
    const coralGroup = new THREE.Group();

    const baseGeometry = new THREE.CylinderGeometry(0.1, 0.3, height * 0.5, 8);
    const baseMaterial = new THREE.MeshPhongMaterial({
      color: color,
      flatShading: true,
      shininess: 0
    });

    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = height * 0.25;
    coralGroup.add(base);

    const branchCount = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < branchCount; i++) {
      const branchHeight = height * (0.3 + Math.random() * 0.2);
      const branchGeometry = new THREE.CylinderGeometry(0.05, 0.1, branchHeight, 6);

      const vertices = branchGeometry.attributes.position;
      for (let j = 0; j < vertices.count; j++) {
        const x = vertices.getX(j);
        const y = vertices.getY(j);
        const z = vertices.getZ(j);

        vertices.setX(j, x + (Math.random() - 0.5) * 0.1);
        vertices.setZ(j, z + (Math.random() - 0.5) * 0.1);
      }
      branchGeometry.attributes.position.needsUpdate = true;
      branchGeometry.computeVertexNormals();

      const branch = new THREE.Mesh(branchGeometry, baseMaterial);
      branch.position.y = height * 0.5;
      branch.position.x = (Math.random() - 0.5) * 0.3;
      branch.position.z = (Math.random() - 0.5) * 0.3;

      branch.rotation.x = (Math.random() - 0.5) * 0.5;
      branch.rotation.z = (Math.random() - 0.5) * 0.5;

      coralGroup.add(branch);
    }

    coralGroup.position.set(x, -0.5, z);
    return coralGroup;
  }

  function placePalms() {
    const palmCount = 12;
    for (let i = 0; i < palmCount; i++) {
      const angle = (Math.PI * 2 / palmCount) * i;
      const radius = islandRadius - 1.8 + (Math.random() * 0.8);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const palmHeight = 2.5 + Math.random() * 1.5;
      const lean = (Math.random() - 0.5) * 0.15;
      const rotation = Math.random() * Math.PI * 2;

      const palm = createPalm(x, z, palmHeight, lean, rotation);
      scene.add(palm);
    }

    const bushCount = 28;
    for (let i = 0; i < bushCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const minRadius = innerRadius + 0.5;
      const maxRadius = islandRadius - 0.8;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const bush = createBush(x, z, 0.2 + Math.random() * 0.3);
      scene.add(bush);
    }

    const rockCount = 10;
    for (let i = 0; i < rockCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const minRadius = innerRadius + 0.8;
      const maxRadius = islandRadius - 1.2;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const rock = createRock(x, z, 0.2 + Math.random() * 0.3);
      scene.add(rock);
    }
  }

  function placeCorals() {
    const coralCount = 30;
    const coralColors = [0xff7b6b, 0xff9b6b, 0xff6bdb, 0xffb86b, 0x9b59b6];

    for (let i = 0; i < coralCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const minInnerRadius = innerRadius - 1;
      const maxInnerRadius = innerRadius - 0.2;
      const minOuterRadius = islandRadius + 0.2;
      const maxOuterRadius = islandRadius + 3;

      let radius;
      if (Math.random() > 0.5) {
        radius = minInnerRadius + Math.random() * (maxInnerRadius - minInnerRadius);
      } else {
        radius = minOuterRadius + Math.random() * (maxOuterRadius - minOuterRadius);
      }

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const colorIndex = Math.floor(Math.random() * coralColors.length);
      const coral = createCoral(
          x, z,
          0.5 + Math.random() * 0.7,
          coralColors[colorIndex]
      );

      scene.add(coral);
    }
  }

  placePalms();
  placeCorals();
  placeBeachItems(scene, islandRadius);

  function createBoat() {
    const boatGroup = new THREE.Group();

    const hullGeometry = new THREE.BoxGeometry(2, 0.6, 0.8);
    hullGeometry.translate(0, 0.3, 0);

    const hullMaterial = new THREE.MeshPhongMaterial({
      color: 0x3366ff,
      roughness: 0.5,
      metalness: 0.2
    });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.position.y = 0;
    hull.castShadow = true;
    hull.receiveShadow = true;
    boatGroup.add(hull);

    const cabinGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.6);
    const cabinMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(-0.2, 0.6, 0);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    boatGroup.add(cabin);

    const stackGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 8);
    const stackMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const smokestack = new THREE.Mesh(stackGeometry, stackMaterial);
    smokestack.position.set(0.1, 0.8, 0);
    smokestack.castShadow = true;
    boatGroup.add(smokestack);

    const smokeGroup = new THREE.Group();
    boatGroup.add(smokeGroup);

    for (let i = 0; i < 10; i++) {
      const size = 0.05 + Math.random() * 0.1;
      const smokeGeometry = new THREE.SphereGeometry(size, 6, 6);
      const smokeMaterial = new THREE.MeshBasicMaterial({
        color: 0xdddddd,
        transparent: true,
        opacity: 0.6 - (i * 0.05)
      });

      const smokeParticle = new THREE.Mesh(smokeGeometry, smokeMaterial);
      smokeParticle.position.set(
          0.1 + Math.sin(i * 0.5) * 0.1,
          0.8 + 0.2 + (i * 0.15),
          Math.cos(i * 0.5) * 0.1
      );
      smokeParticle.userData = {
        initialY: 0.8 + 0.2 + (i * 0.15),
        speed: 0.01 + Math.random() * 0.01,
        wiggle: Math.random() * Math.PI * 2
      };
      smokeGroup.add(smokeParticle);
    }

    const mastGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
    const mastMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const mast = new THREE.Mesh(mastGeometry, mastMaterial);
    mast.position.set(0.5, 0.8, 0);
    mast.castShadow = true;
    boatGroup.add(mast);

    return boatGroup;
  }

  function createWaterAnimation() {
    const vertexShader = `
      uniform float time;
      uniform vec3 sunDirection;
      uniform vec3 cameraPosition;
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        
        float waveX1 = sin((position.x * 3.0 + time * 0.3)) * 0.12;
        float waveX2 = sin((position.x * 1.5 + time * 0.15)) * 0.18;
        float waveZ1 = cos((position.z * 2.5 + time * 0.4)) * 0.12;
        float waveZ2 = cos((position.z * 2.0 + time * 0.2)) * 0.15;
        
        float detailWaveX = sin((position.x * 8.0 + time * 0.8)) * 0.05;
        float detailWaveZ = cos((position.z * 8.0 + time * 0.6)) * 0.05;
        
        float waveHeight = waveX1 + waveX2 + waveZ1 + waveZ2 + detailWaveX * detailWaveZ;
        
        float dist = length(position.xz);
        
        float innerMask = 1.0 - smoothstep(0.0, ${innerRadius.toFixed(2)}, dist);
        
        float outerMask = smoothstep(${islandRadius.toFixed(2)}, 20.0, dist);
        
        float shoreMask = 1.0 - smoothstep(${(innerRadius - 0.3).toFixed(2)}, ${innerRadius.toFixed(2)}, dist) + 
                          smoothstep(${islandRadius.toFixed(2)}, ${(islandRadius + 0.3).toFixed(2)}, dist);
        
        float waveIntensity = 0.08 * (innerMask + outerMask) + 0.15 * shoreMask;
        
        vec3 newPosition = position;
        newPosition.y += waveHeight * waveIntensity;
        
        vec3 bitangent = vec3(1.0, waveHeight * 0.5, 0.0);
        vec3 tangent = vec3(0.0, waveHeight * 0.5, 1.0);
        
        vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec3 sunDirection;
      uniform vec3 cameraPosition;
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      
      float noise(vec2 p) {
        return sin(p.x * 10.0) * sin(p.y * 10.0) * 0.5 + 0.5;
      }
      
      vec3 causticPattern(vec2 uv, float time) {
        vec2 p = uv * 20.0;
        float causticsStrength = 0.05;
        
        float caustic1 = pow(0.5 + 0.5 * sin(p.x * 0.42 + p.y * 0.38 + time * 1.5), 8.0);
        float caustic2 = pow(0.5 + 0.5 * sin(p.x * 0.33 - p.y * 0.45 + time * 1.0), 6.0);
        float caustic3 = pow(0.5 + 0.5 * sin(p.x * 0.28 + p.y * 0.51 + time * 0.8), 10.0);
        
        float caustic = max(max(caustic1, caustic2), caustic3) * causticsStrength;
        return vec3(caustic * 1.2, caustic * 1.5, caustic * 1.8);
      }
      
      void main() {
        float dist = length(vPosition.xz);
        
        float innerMask = 1.0 - smoothstep(0.0, ${innerRadius.toFixed(2)}, dist);
        
        float outerMask = smoothstep(${islandRadius.toFixed(2)}, 20.0, dist);
        
        vec3 deepInnerWaterColor = vec3(0.208, 0.725, 0.729);
        vec3 shallowInnerWaterColor = vec3(0.208, 0.725, 0.729);
        vec3 deepOuterWaterColor = vec3(0.208, 0.725, 0.729);
        vec3 shallowOuterWaterColor = vec3(0.208, 0.725, 0.729);
        
        float innerDepth = noise(vUv * 3.0 + time * 0.05) * 0.5 + 0.5;
        float outerDepth = noise(vUv * 2.0 - time * 0.03) * 0.6 + 0.4;
        
        vec3 innerWaterColor = mix(
          shallowInnerWaterColor, 
          deepInnerWaterColor, 
          innerDepth
        );
        
        vec3 outerWaterColor = mix(
          shallowOuterWaterColor,
          deepOuterWaterColor,
          outerDepth
        );
        
        vec3 waterColor = innerWaterColor * innerMask + outerWaterColor * outerMask;
        
        float innerShore = smoothstep(${(innerRadius - 0.3).toFixed(2)}, ${innerRadius.toFixed(2)}, dist);
        float outerShore = 1.0 - smoothstep(${islandRadius.toFixed(2)}, ${(islandRadius + 0.3).toFixed(2)}, dist);
        float shoreMask = max(0.0, 1.0 - innerShore - outerShore);
        
        float foam = 0.0;
        if (shoreMask > 0.01) {
          float wavePattern = sin(vUv.x * 40.0 + time * 2.0) * sin(vUv.y * 40.0 + time * 1.7);
          foam = pow(abs(wavePattern), 0.5) * shoreMask;
          foam *= (noise(vUv * 10.0 + time * 0.2) * 0.5 + 0.5);
        }
        
        waterColor = mix(waterColor, vec3(1.0, 1.0, 1.0), foam * 0.7);
        
        vec3 sunDir = normalize(sunDirection);
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        vec3 halfDir = normalize(sunDir + viewDir);
        
        vec3 perturbedNormal = normalize(vNormal + vec3(
          sin(vUv.x * 30.0 + time) * 0.1,
          0.0,
          sin(vUv.y * 30.0 + time * 1.3) * 0.1
        ));
        
        float specular = pow(max(0.0, dot(perturbedNormal, halfDir)), 128.0) * 0.8;
        
        float ripples = sin(vUv.x * 80.0 + time * 2.5) * sin(vUv.y * 80.0 + time * 2.0) * 0.02;
        ripples *= (noise(vUv * 5.0) * 0.5 + 0.5);
        
        vec3 caustics = causticPattern(vUv, time) * innerMask * 0.8;
        
        waterColor += vec3(specular);
        waterColor += vec3(ripples);
        waterColor += caustics;
        
        float alpha = 0.85;
        
        if (shoreMask > 0.01) {
          alpha = mix(alpha, 0.6, shoreMask * 0.5);
        }
        
        gl_FragColor = vec4(waterColor, alpha);
      }
    `;

    const waterGeometry = new THREE.PlaneGeometry(40, 40, 64, 64);
    const waterMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        sunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.2).normalize() },
        cameraPosition: { value: camera.position }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });

    const waterSurface = new THREE.Mesh(waterGeometry, waterMaterial);
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.y = 0;

    scene.add(waterSurface);

    return waterMaterial;
  }

  function createSkybox() {
    const skyDomeGeometry = new THREE.SphereGeometry(90, 32, 32);
    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xaaddff) },
        offset: { value: 20 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        
        varying vec3 vWorldPosition;
        
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide
    });

    const sky = new THREE.Mesh(skyDomeGeometry, skyMaterial);
    scene.add(sky);

    const createCloud = (x, y, z, size) => {
      const cloudGroup = new THREE.Group();

      const segments = 5 + Math.floor(Math.random() * 6);

      for (let i = 0; i < segments; i++) {
        const segmentSize = size * (0.5 + Math.random() * 0.5);
        const segmentGeometry = new THREE.SphereGeometry(segmentSize, 8, 8);

        const brightness = 0.9 + Math.random() * 0.1;
        const cloudMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(brightness, brightness, brightness),
          transparent: true,
          opacity: 0.92,
          roughness: 1.0,
          metalness: 0.0
        });

        const cloudSegment = new THREE.Mesh(segmentGeometry, cloudMaterial);

        cloudSegment.position.set(
            (Math.random() - 0.5) * size * 1.5,
            (Math.random() - 0.5) * size * 0.5,
            (Math.random() - 0.5) * size * 1.5
        );

        cloudGroup.add(cloudSegment);
      }

      cloudGroup.position.set(x, y, z);
      return cloudGroup;
    };

    const cloudCount = 15;
    for (let i = 0; i < cloudCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 30;
      const height = 20 + Math.random() * 15;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const cloud = createCloud(x, height, z, 3 + Math.random() * 4);
      scene.add(cloud);
    }

    return { sky, clouds: cloudCount };
  }

  function createUnderwaterEffects() {
    const createLightRay = (x, z, height, angle) => {
      const rayGeometry = new THREE.CylinderGeometry(0.05, 0.2, height, 8);
      const rayMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
      });

      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      ray.position.set(x, -height/2, z);
      ray.rotation.x = Math.PI/2;
      ray.rotation.z = angle;

      return ray;
    };

    const lightRayCount = 20;
    for (let i = 0; i < lightRayCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * islandRadius * 1.2;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const height = 1 + Math.random() * 3;
      const rayAngle = Math.random() * Math.PI * 0.25;

      const ray = createLightRay(x, z, height, rayAngle);
      scene.add(ray);
    }

    const createFishSchool = (x, y, z, fishCount) => {
      const schoolGroup = new THREE.Group();
      schoolGroup.position.set(x, y, z);

      for (let i = 0; i < fishCount; i++) {
        const fishLength = 0.2 + Math.random() * 0.15;

        const fishGeometry = new THREE.ConeGeometry(0.05, fishLength, 8);

        const fishColors = [0xffdd59, 0xff5e57, 0x00d8d8, 0x0984e3, 0xffa801];
        const colorIdx = Math.floor(Math.random() * fishColors.length);

        const fishMaterial = new THREE.MeshStandardMaterial({
          color: fishColors[colorIdx],
          roughness: 0.8,
          metalness: 0.2
        });

        const fish = new THREE.Mesh(fishGeometry, fishMaterial);

        fish.position.set(
            (Math.random() - 0.5) * 1.5,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 1.5
        );

        fish.rotation.x = Math.PI / 2; // Restored fish rotation

        fish.userData = {
          speed: 0.005 + Math.random() * 0.008,
          rotationSpeed: 0.01 + Math.random() * 0.02,
          offset: Math.random() * Math.PI * 2
        };

        schoolGroup.add(fish);
      }

      schoolGroup.userData = {
        centerX: x,
        centerZ: z,
        radius: 3 + Math.random() * 2,
        speed: 0.2 + Math.random() * 0.3,
        verticalSpeed: 0.1 + Math.random() * 0.2,
        verticalRange: 0.5 + Math.random() * 0.5
      };

      return schoolGroup;
    };

    const fishSchools = [];
    const schoolCount = 3;

    for (let i = 0; i < schoolCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius * 0.6 + Math.random() * (islandRadius - innerRadius) * 0.5;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const school = createFishSchool(x, -0.5 - Math.random(), z, 8 + Math.floor(Math.random() * 6));
      scene.add(school);
      fishSchools.push(school);
    }

    return fishSchools;
  }

  const skybox = createSkybox();

  const fishSchools = createUnderwaterEffects();

  const waterMaterial = createWaterAnimation();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffcc, 0.8);
  sunLight.position.set(5, 10, 5);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -15;
  sunLight.shadow.camera.right = 15;
  sunLight.shadow.camera.top = 15;
  sunLight.shadow.camera.bottom = -15;
  scene.add(sunLight);

  const waterLight = new THREE.PointLight(0x5cdffa, 0.5);
  waterLight.position.set(0, -1, 0);
  scene.add(waterLight);

  function createDockAndShip() {
    const dockGroup = new THREE.Group();

    const dockGeometry = new THREE.BoxGeometry(3, 0.2, 1.5);
    const dockMaterial = new THREE.MeshPhongMaterial({
      color: 0x8B4513,
      roughness: 0.8,
      metalness: 0.1
    });
    const dockPlatform = new THREE.Mesh(dockGeometry, dockMaterial);
    dockPlatform.position.y = 0.1;
    dockPlatform.receiveShadow = true;
    dockGroup.add(dockPlatform);

    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const postMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });

    const postPositions = [
      { x: -1.4, z: 0.7 },
      { x: -1.4, z: -0.7 },
      { x: 1.4, z: 0.7 },
      { x: 1.4, z: -0.7 }
    ];

    postPositions.forEach(pos => {
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.set(pos.x, -0.3, pos.z);
      post.castShadow = true;
      dockGroup.add(post);
    });

    const boatGroup = new THREE.Group();

    const hullGeometry = new THREE.BoxGeometry(2, 0.6, 0.8);
    hullGeometry.translate(0, 0.3, 0);

    const hullMaterial = new THREE.MeshPhongMaterial({
      color: 0x3366ff,
      roughness: 0.5,
      metalness: 0.2
    });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.position.y = 0;
    hull.castShadow = true;
    hull.receiveShadow = true;
    boatGroup.add(hull);

    const cabinGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.6);
    const cabinMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(-0.2, 0.6, 0);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    boatGroup.add(cabin);

    const stackGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 8);
    const stackMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const smokestack = new THREE.Mesh(stackGeometry, stackMaterial);
    smokestack.position.set(0.1, 0.8, 0);
    smokestack.castShadow = true;
    boatGroup.add(smokestack);

    const smokeGroup = new THREE.Group();
    boatGroup.add(smokeGroup);

    for (let i = 0; i < 10; i++) {
      const size = 0.05 + Math.random() * 0.1;
      const smokeGeometry = new THREE.SphereGeometry(size, 6, 6);
      const smokeMaterial = new THREE.MeshBasicMaterial({
        color: 0xdddddd,
        transparent: true,
        opacity: 0.6 - (i * 0.05)
      });

      const smokeParticle = new THREE.Mesh(smokeGeometry, smokeMaterial);
      smokeParticle.position.set(
          0.1 + Math.sin(i * 0.5) * 0.1,
          0.8 + 0.2 + (i * 0.15),
          Math.cos(i * 0.5) * 0.1
      );
      smokeParticle.userData = {
        initialY: 0.8 + 0.2 + (i * 0.15),
        speed: 0.01 + Math.random() * 0.01,
        wiggle: Math.random() * Math.PI * 2
      };
      smokeGroup.add(smokeParticle);
    }

    const mastGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
    const mastMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const mast = new THREE.Mesh(mastGeometry, mastMaterial);
    mast.position.set(0.5, 0.8, 0);
    mast.castShadow = true;
    boatGroup.add(mast);

    const dockAngle = Math.PI / 12;
    const boatAngle = dockAngle + Math.PI / 18; // Shifted left
    const boatRadius = islandRadius + 0.3; // Moved back

    const dockX = Math.cos(dockAngle) * (islandRadius - 1);
    const dockZ = Math.sin(dockAngle) * (islandRadius - 1);
    dockGroup.position.set(dockX, 0, dockZ);
    dockGroup.rotation.y = dockAngle;

    const boatX = Math.cos(boatAngle) * boatRadius;
    const boatZ = Math.sin(boatAngle) * boatRadius;
    boatGroup.position.set(boatX, 0.1, boatZ);
    boatGroup.rotation.y = boatAngle;

    const ropeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.8, 4);
    ropeGeometry.rotateX(Math.PI / 2);
    const ropeMaterial = new THREE.MeshBasicMaterial({ color: 0x664400 });

    const boatAttach1 = new THREE.Vector3(boatX - 0.5 * Math.cos(boatAngle), 0.2, boatZ - 0.5 * Math.sin(boatAngle));
    const boatAttach2 = new THREE.Vector3(boatX - 0.5 * Math.cos(boatAngle), 0.2, boatZ - 0.5 * Math.sin(boatAngle));

    const rope1 = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rope1.position.set(boatAttach1.x, boatAttach1.y, boatAttach1.z);

    const rope2 = new THREE.Mesh(ropeGeometry, ropeMaterial);
    rope2.position.set(boatAttach2.x, boatAttach2.y, boatAttach2.z);

    scene.add(dockGroup);
    scene.add(boatGroup);
    scene.add(rope1);
    scene.add(rope2);

    return { dock: dockGroup, boat: boatGroup, smoke: smokeGroup, ropes: [rope1, rope2] };
  }

  function createMapMarkers() {
    const markersGroup = new THREE.Group();

    const createMarker = (x, z, markerNumber, sectionName) => {
      const height = 2.0;
      const markerGeometry = new THREE.ConeGeometry(0.35, 1.0, 8);
      markerGeometry.rotateX(Math.PI);

      const markerMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0x990000,
        shininess: 80,
        transparent: true,
        opacity: 1,
        depthTest: true,
        depthWrite: true
      });

      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, height, z);
      marker.castShadow = true;

      marker.name = `marker_${markerNumber}`;

      const tooltipCanvas = document.createElement('canvas');
      tooltipCanvas.width = 256;
      tooltipCanvas.height = 64;
      const ctx = tooltipCanvas.getContext('2d');

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.roundRect(0, 0, 256, 64, 10);
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`→ ${sectionName}`, 128, 32);

      const tooltipTexture = new THREE.CanvasTexture(tooltipCanvas);
      tooltipTexture.minFilter = THREE.LinearFilter;
      const tooltipMaterial = new THREE.SpriteMaterial({
        map: tooltipTexture,
        transparent: true,
        opacity: 0
      });

      const tooltip = new THREE.Sprite(tooltipMaterial);
      tooltip.scale.set(3, 0.75, 1);
      tooltip.position.set(0, 1.5, 0);

      marker.add(tooltip);

      marker.userData = {
        tooltip: tooltip,
        sectionName: sectionName,
        baseY: height
      };

      return marker;
    };

    const marker1 = createMarker(4, 0, 1, "О проекте");
    const marker2 = createMarker(-3, 3, 2, "Возможности");
    const marker3 = createMarker(-2, -4, 3, "Контакты");

    markersGroup.add(marker1, marker2, marker3);

    scene.add(markersGroup);

    return markersGroup;
  }

  const markerSections = [
    "about-section",
    "features-section",
    "contact-section"
  ];

  function createFloatingLogo() {
    const logoGeometry = new THREE.PlaneGeometry(7, 2.5);

    const logoTexture = new THREE.TextureLoader().load("/static/atoll-logo.png");
    logoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const logoMaterial = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: true
    });

    const logo = new THREE.Mesh(logoGeometry, logoMaterial);

    logo.position.set(0, 7, 0);

    scene.add(logo);

    return logo;
  }

  function createSeagulls() {
    const seagullsGroup = new THREE.Group();

    const createSeagull = () => {
      const seagullGroup = new THREE.Group();

      const bodyGeometry = new THREE.ConeGeometry(0.15, 0.5, 8);
      bodyGeometry.rotateX(Math.PI / 2);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

      const wingGeometry = new THREE.PlaneGeometry(0.8, 0.2);
      const wingMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });

      const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
      leftWing.position.set(-0.4, 0, 0);
      leftWing.rotation.z = Math.PI / 6;

      const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
      rightWing.position.set(0.4, 0, 0);
      rightWing.rotation.z = -Math.PI / 6;

      seagullGroup.add(body);
      seagullGroup.add(leftWing);
      seagullGroup.add(rightWing);

      const radius = 12 + Math.random() * 4;
      const angle = Math.random() * Math.PI * 2;

      seagullGroup.position.set(
          Math.cos(angle) * radius,
          5 + Math.random() * 3,
          Math.sin(angle) * radius
      );

      seagullGroup.rotation.y = Math.random() * Math.PI * 2;

      seagullGroup.userData = {
        speed: 0.005 + Math.random() * 0.008,
        wingSpeed: 0.05 + Math.random() * 0.05,
        wingDirection: 1,
        wingAngle: 0,
        circleRadius: radius,
        height: seagullGroup.position.y,
        angle: angle,
        wobble: Math.random() * 0.05
      };

      return seagullGroup;
    };

    for (let i = 0; i < 5; i++) {
      const seagull = createSeagull();
      seagullsGroup.add(seagull);
    }

    scene.add(seagullsGroup);

    return seagullsGroup;
  }

  function onCanvasMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    const markerIntersects = intersects.filter(intersect =>
        intersect.object.name && intersect.object.name.startsWith('marker_')
    );

    if (hoveredMarker && (markerIntersects.length === 0 || markerIntersects[0].object !== hoveredMarker)) {
      const tooltip = hoveredMarker.userData.tooltip;
      if (tooltip) {
        tooltip.material.opacity = 0;
        tooltip.visible = false;
      }

      hoveredMarker.position.y = hoveredMarker.userData.baseY;

      hoveredMarker = null;
      canvas.style.cursor = 'default';

      isHoveringOnPoint = false;
      lastHoverEndTime = Date.now();
    }

    if (markerIntersects.length > 0) {
      const marker = markerIntersects[0].object;

      if (marker !== hoveredMarker) {
        hoveredMarker = marker;

        const tooltip = marker.userData.tooltip;
        if (tooltip) {
          tooltip.visible = true;
          tooltip.material.opacity = 1;

          tooltip.lookAt(camera.position);
        }

        marker.position.y = marker.userData.baseY + 0.3;

        canvas.style.cursor = 'pointer';

        isHoveringOnPoint = true;
      }
    }
  }

  const dockAndShip = createDockAndShip();

  let hoveredMarker = null;

  let userHasInteracted = false;
  let lastInteractionTime = Date.now();
  let isHoveringOnPoint = false;
  let lastHoverEndTime = null;

  let autoRotationAngle = 0;
  let autoRotationHeight = 0;
  let autoRotationDistance = 0;

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 20;

  controls.minPolarAngle = Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 3;

  controls.rotateSpeed = 0.2;

  controls.enableZoom = false;

  controls.enablePan = false;

  const mapMarkers = createMapMarkers();

  const mouse = new THREE.Vector2();

  const raycaster = new THREE.Raycaster();
  raycaster.layers.set(0);

  const floatingLogo = createFloatingLogo();

  const seagulls = createSeagulls();

  controls.addEventListener('change', () => {
    if (userHasInteracted) {
      autoRotationAngle = Math.atan2(camera.position.x, camera.position.z);

      autoRotationHeight = camera.position.y;
      autoRotationDistance = new THREE.Vector3().subVectors(camera.position, controls.target).length();
    }
  });

  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    let shouldAutoRotate = false;

    if (!isHoveringOnPoint && lastHoverEndTime && (Date.now() - lastHoverEndTime >= 2000)) {
      shouldAutoRotate = true;
      autoRotationAngle = Math.atan2(camera.position.x, camera.position.z);
      lastHoverEndTime = null;
    }

    if (userHasInteracted && Date.now() - lastInteractionTime > 5000) {
      userHasInteracted = false;
      shouldAutoRotate = true;
    }

    controls.update();

    if (!userHasInteracted && !isHoveringOnPoint && (shouldAutoRotate || autoRotationAngle !== 0)) {
      const cameraSpeed = 0.08;

      autoRotationAngle += cameraSpeed * 0.01;

      const distance = autoRotationDistance || controls.getDistance();

      camera.position.x = Math.sin(autoRotationAngle) * distance * Math.sin(Math.PI/3);
      camera.position.z = Math.cos(autoRotationAngle) * distance * Math.sin(Math.PI/3);

      camera.position.y = autoRotationHeight || distance * Math.cos(Math.PI/3);

      camera.lookAt(controls.target);
    }

    if (floatingLogo) {
      floatingLogo.rotation.y += 0.005;
      floatingLogo.lookAt(camera.position);
    }

    if (seagulls) {
      seagulls.children.forEach(seagull => {
        const data = seagull.userData;

        data.angle += data.speed;

        seagull.position.x = Math.cos(data.angle) * data.circleRadius;
        seagull.position.z = Math.sin(data.angle) * data.circleRadius;

        seagull.position.y = data.height + Math.sin(time * 0.5) * data.wobble;

        seagull.rotation.y = data.angle + Math.PI / 2;

        const leftWing = seagull.children[1];
        const rightWing = seagull.children[2];

        data.wingAngle += data.wingSpeed * data.wingDirection;
        if (data.wingAngle > 0.5 || data.wingAngle < -0.2) {
          data.wingDirection *= -1;
        }

        leftWing.rotation.z = Math.PI / 6 + data.wingAngle;
        rightWing.rotation.z = -Math.PI / 6 - data.wingAngle;
      });
    }

    if (dockAndShip && dockAndShip.boat) {
      const boatObj = dockAndShip.boat;

      const waveHeight = Math.sin(time * 0.7) * 0.05;
      const tiltAngle = Math.sin(time * 0.5) * 0.02;

      boatObj.position.y = 0.1 + waveHeight;
      boatObj.rotation.z = tiltAngle;
      boatObj.rotation.x = Math.sin(time * 0.3) * 0.01;

      if (dockAndShip.smoke) {
        dockAndShip.smoke.children.forEach((particle, index) => {
          const data = particle.userData;

          particle.position.y += data.speed;

          particle.position.x = 0.1 + Math.sin(time + data.wiggle) * 0.05;
          particle.position.z = Math.cos(time + data.wiggle) * 0.05;

          particle.material.opacity -= 0.001;

          if (particle.position.y > data.initialY + 1.5 || particle.material.opacity <= 0) {
            particle.position.y = data.initialY;
            particle.material.opacity = 0.6 - (index * 0.05);
          }
        });
      }
    }

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    // Check if mobile and adjust camera settings if needed
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      // Update FOV and position if device type has changed
      camera.fov = newIsMobile ? 85 : 75;
      camera.position.z = newIsMobile ? 20 : 15;
    }

    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  canvas.addEventListener('mousemove', onCanvasMouseMove);

  function onCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const marker = intersects[0].object;

      const markerMatch = marker.name.match(/marker_(\d+)/);
      if (markerMatch && markerMatch[1]) {
        const markerNumber = parseInt(markerMatch[1]) - 1;

        if (markerNumber >= 0 && markerNumber < markerSections.length) {
          const sectionId = markerSections[markerNumber];
          const section = document.getElementById(sectionId);

          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            console.log(`Navigating to section: ${sectionId}`);
          } else {
            console.log(`Section not found: ${sectionId}`);
          }
        }
      }
    }
  }

  let isTouchDevice = 'ontouchstart' in window;
  let lastTouchTime = 0;

  canvas.addEventListener('touchstart', function(event) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const markerIntersects = intersects.filter(intersect =>
          intersect.object.name && intersect.object.name.startsWith('marker_')
      );
      if (markerIntersects.length > 0) {
        const marker = markerIntersects[0].object;
        const markerMatch = marker.name.match(/marker_(\d+)/);
        if (markerMatch && markerMatch[1]) {
          const markerNumber = parseInt(markerMatch[1]) - 1;
          if (markerNumber >= 0 && markerNumber < markerSections.length) {
            const sectionId = markerSections[markerNumber];
            const section = document.getElementById(sectionId);
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
              console.log(`Переход к секции: ${sectionId}`);
            }
          }
        }
        lastTouchTime = Date.now();
      }
    }
  });

  canvas.addEventListener('click', function(event) {
    if (isTouchDevice && (Date.now() - lastTouchTime < 300)) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const marker = intersects[0].object;
      const markerMatch = marker.name.match(/marker_(\d+)/);
      if (markerMatch && markerMatch[1]) {
        const markerNumber = parseInt(markerMatch[1]) - 1;
        if (markerNumber >= 0 && markerNumber < markerSections.length) {
          const sectionId = markerSections[markerNumber];
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            console.log(`Переход к секции: ${sectionId}`);
          }
        }
      }
    }
  });

  controls.addEventListener('start', function() {
    userHasInteracted = true;
    lastInteractionTime = Date.now();
  });

  controls.addEventListener('end', function() {
    lastInteractionTime = Date.now();

    autoRotationAngle = Math.atan2(camera.position.x, camera.position.z);
  });

  controls.addEventListener('change', function() {
    if (userHasInteracted) {
      autoRotationAngle = Math.atan2(camera.position.x, camera.position.z);
    }
  });
}

$(document).ready(function() {
  setInterval(rotateText, 3000);
  drawWaves();
  createBubbles();
  startBirdFlocks();
  handleFishInteraction();
  init3DIsland();
  window.addEventListener('resize', function() {
    drawWaves();
    createBubbles();
  });

  $("#buoyBtn").click(function() {
    if (isBuoySinking || isBuoyEmerging) return;
    isBuoySinking = true;
    $(this).removeClass('emerging');
    $(this).addClass('sinking');
    createBubbleTrail();
    setTimeout(() => {
      $('html, body').animate({
        scrollTop: $(".underwater-section").offset().top
      }, 1500, 'swing');
    }, 300);
    setTimeout(() => {
      isBuoySinking = false;
    }, 1200);
  });

  $('.cloud-item').click(function(e) {
    e.preventDefault();
    const sectionId = $(this).data('section');
    $('html, body').animate({
      scrollTop: $(`#${sectionId}`).offset().top
    }, 1000, 'swing');
  });

  $('.create-atoll-btn').click(function() {
    alert('Начните создавать свой атолл прямо сейчас!');
  });

  window.addEventListener('scroll', handleScroll);
  toggleSeaweedVisibility();
});