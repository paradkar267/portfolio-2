/* 3D layer for the portfolio: live three.js crystal cluster, hero depth parallax, card tilt.
   Sits between the section backgrounds (z 1) and the page content (z 3). Purely additive. */
(function () {
  'use strict';
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var px = 0, py = 0; // pointer, -0.5 .. 0.5

  addEventListener('pointermove', function (e) {
    px = e.clientX / innerWidth - 0.5;
    py = e.clientY / innerHeight - 0.5;
  }, { passive: true });

  /* ---------- 1. Hero depth: each layer shifts a different amount ---------- */
  var layers = [
    ['.hero-section .section-bg-graphic', 10],
    ['.giant-name-backdrop', 26],
    ['.hero-portrait-img', -14]
  ].map(function (l) { return { el: document.querySelector(l[0]), k: l[1], x: 0, y: 0 }; })
   .filter(function (l) { return l.el; });

  /* ---------- 2. Card tilt (user-triggered only) ---------- */
  if (fine && !still) {
    document.querySelectorAll('.work-main-showcase-grid article').forEach(function (card) {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add('tilting');
        card.style.transform = 'perspective(900px) rotateX(' + (-y * 7) + 'deg) rotateY(' + (x * 9) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }

  /* ---------- 3. WebGL crystal cluster ---------- */
  var cv = document.getElementById('three-layer');
  if (!cv || !window.THREE) return;
  var T = THREE, renderer;
  try { renderer = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); }
  catch (e) { cv.remove(); return; }

  var small = innerWidth < 820;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 2));
  var scene = new T.Scene();
  var cam = new T.PerspectiveCamera(40, 1, 0.1, 60);
  cam.position.z = 9;

  var LIME = 0xc1502e;
  var rig = new T.Group();       // whole cluster, moves between sections
  scene.add(rig);

  var coreMat = new T.MeshStandardMaterial({
    color: LIME, metalness: 0.55, roughness: 0.2, flatShading: true,
    transparent: true, opacity: 0.42
  });
  var core = new T.Mesh(new T.IcosahedronGeometry(1.25, 0), coreMat);
  rig.add(core);
  var edgeMat = new T.LineBasicMaterial({ color: LIME, transparent: true, opacity: 0.85 });
  core.add(new T.LineSegments(new T.EdgesGeometry(core.geometry), edgeMat));

  function ring(r, rx, ry, op) {
    var m = new T.Mesh(new T.TorusGeometry(r, 0.008, 8, 200),
      new T.MeshBasicMaterial({ color: 0x18181a, transparent: true, opacity: op }));
    m.rotation.set(rx, ry, 0); rig.add(m); return m;
  }
  var ringA = ring(2.1, 1.25, 0.2, 0.3), ringB = ring(2.7, 0.35, 1.1, 0.18);

  var geos = [new T.OctahedronGeometry(0.28), new T.TetrahedronGeometry(0.32), new T.IcosahedronGeometry(0.22, 0)];
  var shards = [], N = small ? 6 : 10;
  for (var i = 0; i < N; i++) {
    var m = new T.Mesh(geos[i % 3], new T.MeshStandardMaterial({
      color: i % 3 === 1 ? 0x18181a : LIME, metalness: 0.5, roughness: 0.25,
      flatShading: true, transparent: true, opacity: 0.55
    }));
    m.userData = { a: (i / N) * Math.PI * 2, r: 1.9 + (i % 4) * 0.42, s: 0.25 + (i % 5) * 0.07, y: (Math.random() - 0.5) * 2.2 };
    rig.add(m); shards.push(m);
  }

  // soft round dust
  var c = document.createElement('canvas'); c.width = c.height = 32;
  var g = c.getContext('2d'), grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 32, 32);
  var dustN = small ? 90 : 220, pos = new Float32Array(dustN * 3);
  for (var j = 0; j < dustN; j++) {
    pos[j * 3] = (Math.random() - 0.5) * 18; pos[j * 3 + 1] = (Math.random() - 0.5) * 11; pos[j * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  var dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(pos, 3));
  var dust = new T.Points(dg, new T.PointsMaterial({
    map: new T.CanvasTexture(c), size: 0.09, color: LIME, transparent: true,
    opacity: 0.55, depthWrite: false
  }));
  scene.add(dust);

  scene.add(new T.AmbientLight(0xffffff, 0.4));
  var key = new T.DirectionalLight(0xffffff, 1.2); key.position.set(3, 4, 5); scene.add(key);
  var rim = new T.PointLight(LIME, 2.2, 22); rim.position.set(-4, -2, 3); scene.add(rim);

  // where the cluster sits for each section: x / y as fractions of half the view, scale
  var STATES = {
    home:    { x: 0.62,  y: 0.12,  s: 1.15 },
    about:   { x: 0.72,  y: 0.05,  s: 0.85 },
    skills:  { x: 0.66,  y: 0.32,  s: 0.75 },
    work:    { x: 0.74,  y: 0.36,  s: 0.7 },
    contact: { x: -0.7,  y: 0.4,   s: 0.75 }
  };
  var sections = ['home', 'about', 'skills', 'work', 'contact']
    .map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var active = 'home';

  function pickActive() {
    var mid = innerHeight * 0.5, best = 1e9;
    sections.forEach(function (s) {
      var r = s.getBoundingClientRect(), d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (r.top < mid && r.bottom > mid) { best = -1; active = s.id; }
      else if (best !== -1 && d < best) { best = d; active = s.id; }
    });
  }

  var W = 1, H = 1, halfW = 1, halfH = 1;
  function resize() {
    W = innerWidth; H = innerHeight; small = W < 820;
    renderer.setSize(W, H, false);
    cam.aspect = W / H; cam.updateProjectionMatrix();
    halfH = Math.tan((cam.fov * Math.PI) / 360) * cam.position.z; halfW = halfH * cam.aspect;
    cv.style.opacity = small ? '0.5' : '1';
  }
  resize(); pickActive();
  addEventListener('resize', resize);
  addEventListener('scroll', pickActive, { passive: true });

  var t = 0, running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden; if (running) loop();
  });

  function loop() {
    if (!running) return;
    t += still ? 0 : 0.006;
    var st = STATES[active] || STATES.home, k = 0.045;
    var tx = st.x * halfW * (small ? 0.55 : 1), ty = st.y * halfH + (small ? halfH * 0.35 : 0);
    var ts = st.s * (small ? 0.7 : 1);
    rig.position.x += (tx - rig.position.x) * k;
    rig.position.y += (ty - rig.position.y) * k;
    rig.scale.setScalar(rig.scale.x + (ts - rig.scale.x) * k);

    var mx = still ? 0 : px, my = still ? 0 : py;
    rig.rotation.y += ((mx * 0.9 + scrollY * 0.0009) - rig.rotation.y) * 0.05;
    rig.rotation.x += ((0.25 + my * 0.6) - rig.rotation.x) * 0.05;
    core.rotation.y = t * 1.2; core.rotation.x = t * 0.6;
    ringA.rotation.z = t * 0.8; ringB.rotation.z = -t * 0.55;
    shards.forEach(function (m) {
      var u = m.userData, a = u.a + t * u.s;
      m.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * 2 + u.a) * 0.15, Math.sin(a) * u.r);
      m.rotation.x += 0.01; m.rotation.y += 0.014;
    });
    dust.rotation.y = t * 0.05;
    dust.position.y = (scrollY * 0.0012) % 2;

    // hero parallax (uses the independent `translate` property so it never fights existing transforms)
    if (fine && !still && active === 'home') {
      layers.forEach(function (l) {
        l.x += (px * l.k - l.x) * 0.06; l.y += (py * l.k * 0.6 - l.y) * 0.06;
        l.el.style.translate = l.x.toFixed(2) + 'px ' + l.y.toFixed(2) + 'px';
      });
    }
    renderer.render(scene, cam);
    if (!still) requestAnimationFrame(loop);
  }
  loop();
  if (still) addEventListener('scroll', function () { requestAnimationFrame(loop); }, { passive: true });
})();
