// ===================================================================
//  LATTICE — a 3D word puzzle adrift in deep space
//  Plain JS + Three.js.  Find words along the rows of a 4x4x4 grid of
//  glowing letter cubes; clear them, let gravity collapse the lattice,
//  and try to dissolve the whole structure.
// ===================================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// -------------------------------------------------------------------
//  DICTIONARY
//  No bundled word list. On startup we fetch a full validated English
//  dictionary (370k+ words, one per line) and load it into a Set for
//  O(1) lookups. A small built-in list is used ONLY if that fetch fails
//  so the game stays playable offline. Minimum word length is 3.
// -------------------------------------------------------------------
const DICT_URL =
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt';

let WORDS = new Set(); // filled by loadDictionary() before the game starts

// Emergency fallback — used ONLY if the dictionary fetch fails (offline).
const FALLBACK_WORDS =
  `the and for are but not you all can her was one our out day get has him his how its
  let man new now old see two way who did oil set put got big run top try yet ace act
  add age ago aid aim air arm art ash ask ate awe axe bad bag ban bar bat bay bed bee
  beg bet bid boa bow box boy bud bug bus cab cap car cat cob cod cop cot cow cry cub
  cue cup cut dad dam den dew die dig dim dip dog dot dry due dug dye ear eat eel egg
  ego elf elk elm end era eve eye fan far fat fax fed fee few fig fin fir fit fix fly
  foe fog fox fun fur gap gas gem god got gum gun gut guy gym ham has hat hay hen hid
  hip hit hoe hog hop hot hub hue hug hut ice icy ink inn ion ire ivy jab jam jar jaw
  jet jig job jog jot joy jug keg key kid kin kit lab lad lap law lay led leg lid lie
  lip lit log lot low mad map mat men met mix mob mom mop mud mug nab nap net new nod
  nor not now nut oak oar oat odd off oil old one orb ore our out owe owl own pad pal
  pan pat paw pay pea pen pet pie pig pin pit pod pop pot pry pub pun pup put rag ram
  ran rap rat raw ray red rib rid rig rim rip rob rod rot row rub rug rum run rut sad
  sap sat saw say sea see set sew she shy sin sip sir sit six ski sky sly sob sod son
  sow soy spa spy sub sue sum sun tab tag tan tap tar tax tea ten the tie tin tip toe
  ton too top tow toy try tub tug two urn use van vat vet vow wad wag war was wax way
  web wed wet who why wig win wit woe wok won wow yak yam yap yes yet zap zip zoo area
  care race real tale late rate able acid also army away baby back ball band bank base
  bath bear beat been bell belt best bird bite blue boat body bone book boot born both
  bowl bull burn busy cake call calm came camp card cart case cash cast cell chat city
  clay club coal coat code cold come cook cool copy core corn cost crew crop dark data
  date dawn dead deal dear debt deep deer desk dial diet dirt dish done door down draw
  drop dual duck dust duty each earn ease east easy edge else even ever evil exit face
  fact fail fair fall fame farm fast fate fear feed feel feet fell felt file fill film
  find fine fire firm fish five flag flat flow food foot form four free from fuel full
  fund gain game gate gave gear gift girl give glad goal goes gold golf gone good gray
  grew grow hair half hall hand hang hard harm hate have head heal hear heat held hell
  help here hero hide high hill hint hire hold hole holy home hope horn host hour huge
  hunt hurt idea inch into iron item join joke jump jury just keen keep kept kick kill
  kind king knee knew know lack lady lake land lane last lead leaf lean left lend less
  life lift like line link list live load loan lock long look lord lose loss lost loud
  love luck made mail main make male mall many mark mass mate meal mean meat meet menu
  mere mild mile milk mill mind mine miss mode mood moon more most move much must name
  navy near neat neck need news next nice nine none nose note okay once only onto open
  oven over pace pack page paid pain pair pale palm park part pass past path peak pear
  peer pick pile pill pine pink pint pipe plan play plot plug plus poem poet pole poll
  pond pool poor port pose post pour pull pump pure push race rack rage raid rail rain
  rank rare read real rear rely rent rest rice rich ride ring rise risk road rock role
  roll roof room root rope rose rule rush safe said sail sake sale salt same sand save
  seal seat seed seek seem seen self sell send sent ship shop shot show shut sick side
  sign silk sing sink site size skin slip slow snap snow soap sock soft soil sold sole
  some song soon sort soul soup spin spot star stay stem step stop suit sure swim tail
  take tale talk tall tank tape task team tear tell tend term test text than that them
  then they thin this thus tide tidy tied time tiny told tone took tool tops torn tour
  town tree trip true tube tune turn type unit upon urge used user vary vast verb very
  view vote wage wait wake walk wall want ward warm wash wave weak wear week well went
  were west what when whom wide wife wild will wind wine wing wire wise wish with wood
  wool word wore work yard yarn year your zero zone about above abuse adult after again
  agree ahead alarm album alert alike alive allow alone along alter among anger angle
  angry apart apple apply arena argue arise armor array aside asset audio avoid awake
  award aware basic batch beach beard beast begin being below bench birth black blade
  blame blank blast blend blind block blood board boost booth bound brain brand brave
  bread break breed brick brief bring broad brown brush build built bunch burst cabin
  cable carry catch cause chain chair chaos charm chart chase cheap check chest chief
  child china chose civil claim class clean clear click cliff climb clock close cloth
  cloud coach coast could count court cover crack craft crash crazy cream crime cross
  crowd crown crude curve cycle daily dairy dance death debut delay dense depth dirty
  doubt dozen draft drama drawn dream dress drink drive eager eagle early earth eight
  elder elect elite empty enemy enjoy enter entry equal error event every exact exist
  extra faith false fancy fatal fault favor fence fewer field fifth fifty fight final
  first fixed flame flash fleet floor fluid focus force forge forth forty forum found
  frame fraud fresh front frost fruit fully funny giant given glass globe glory grace
  grade grain grand grant grape graph grass grave great green greet grief gross group
  grown guard guess guest guide habit happy heart heavy hello hence honey honor horse
  hotel house human humor ideal image index inner input issue ivory joint judge juice
  known label labor large laser later laugh layer learn lease least leave legal lemon
  level light limit liner local logic loose lower loyal lucky lunch magic major maker
  march match mayor meant medal media metal meter might minor minus mixed model money
  month moral motor mount mouse mouth movie music naked nasty nerve never newly night
  noble noise north noted novel nurse ocean offer often olive onion opera orbit order
  organ other ought ounce outer owner panel panic paper party paste patch pause peace
  pearl phase phone photo piano piece pilot pitch place plain plane plant plate plaza
  point pound power press price pride prime print prior prize proof proud prove pulse
  punch pupil quick quiet quite radio raise rally range rapid ratio reach react ready
  realm rebel refer reign relax reply rider ridge rifle right rigid rinse rival river
  robot rocky rough round route royal rural saint salad sauce scale scene scope score
  sense serve seven shade shake shall shame shape share sharp sheep sheet shelf shell
  shift shine shirt shock shoot shore short shown sight silly since sixth sixty skill
  slate sleep slice slide slope small smart smell smile smoke snake solar solid solve
  sorry sound south space spare spark speak speed spell spend spent spice spike spine
  split spoke sport spray squad stack staff stage stair stake stand start state steam
  steel steep steer stick stiff still stock stone stood stool store storm story strip
  study stuff style sugar suite sunny super sweet swift swing sword table taken taste
  teach teeth tempo tenth there these thick thief thing think third those three throw
  thumb tiger tight tired title toast today token tooth topic total touch tough tower
  trace track trade trail train trait treat trend trial tribe trick tried troop truck
  truly trunk trust truth twice twist ultra uncle under union unite unity until upper
  upset urban usage usual valid value valve video villa vinyl viral virus visit vital
  vocal voice voter waste watch water wheat wheel where which while white whole whose
  width woman world worry worse worst worth would wound wrong wrote yield young youth`
    .split(/\s+/)
    .filter((w) => /^[a-z]{3,}$/.test(w));

async function loadDictionary() {
  const res = await fetch(DICT_URL);
  if (!res.ok) throw new Error('dictionary HTTP ' + res.status);
  const text = await res.text();
  const set = new Set();
  for (const line of text.split(/\r?\n/)) {
    const w = line.trim().toLowerCase();
    if (w.length >= 3 && /^[a-z]+$/.test(w)) set.add(w);
  }
  if (set.size < 1000) throw new Error('dictionary looked empty');
  return set;
}

// -------------------------------------------------------------------
//  LETTER GENERATION (weighted toward common English letters)
// -------------------------------------------------------------------
const LETTER_WEIGHTS = {
  E: 127, T: 91, A: 82, O: 75, I: 70, N: 67, S: 63, H: 61, R: 60, D: 43,
  L: 40, U: 28, C: 28, M: 24, W: 24, F: 22, G: 20, Y: 20, P: 19, B: 15,
  V: 10, K: 8, J: 2, X: 2, Q: 1, Z: 1,
};

const LETTER_POOL = [];
for (const [letter, weight] of Object.entries(LETTER_WEIGHTS)) {
  const n = Math.max(1, Math.round(weight / 3));
  for (let i = 0; i < n; i++) LETTER_POOL.push(letter);
}
function randomLetter() {
  return LETTER_POOL[(Math.random() * LETTER_POOL.length) | 0];
}

// -------------------------------------------------------------------
//  CONSTANTS
// -------------------------------------------------------------------
const SIZE = 4;
const SPACING = 2.2;
const OFFSET = ((SIZE - 1) * SPACING) / 2; // 3.3 -> centers grid on origin
const CUBE_SIZE = 1.5;

const COL_EDGE = 0x00aaff;
const COL_SELECT = 0x00ffff;
const COL_VALID = 0x00ff88;
const COL_INVALID = 0xff3333;
const COL_WHITE = 0xffffff;
const EDGE_OPACITY = 0.4;

const TIMER_START = 60; // seconds on the countdown clock
const MAX_HINTS = 3;
const MAX_TRIES = 3;
const COL_HINT = 0xffcc33; // gold pulse for hinted cubes

const ASSEMBLE_DURATION = 0.7;
const ASSEMBLE_TOTAL = 1.5;

const gridToWorld = (g) => g * SPACING - OFFSET;

// -------------------------------------------------------------------
//  EASING
// -------------------------------------------------------------------
const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);
const easeInCubic = (p) => p * p * p;
const easeInOutQuad = (p) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
const easeOutBack = (p) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

// -------------------------------------------------------------------
//  DOM REFERENCES
// -------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const elWord = $('current-word');
const elHint = $('hint');
const elTimer = $('timer');
const elScore = $('score');
const elWordsFound = $('words-found');
const elSubmit = $('submit-btn');
const elHintBtn = $('hint-btn');
const elHintDots = $('hint-dots');
const elTriesRow = $('tries-row');
const elTriesDots = $('tries-dots');
const elNewGame = $('new-game-btn');
const elOverlay = $('message-overlay');
const elMsgTitle = $('message-title');
const elMsgSub = $('message-sub');
const elMsgBtn = $('message-btn');
const elLoading = $('loading');

// -------------------------------------------------------------------
//  SCENE / CAMERA / RENDERER
// -------------------------------------------------------------------
const canvas = $('scene');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.set(8, 6, 14);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 8;
controls.maxDistance = 35;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.4;
controls.enablePan = false;

// A touch of ambient light (mostly for any standard-material extras /
// the selection point lights to have something to bite into).
scene.add(new THREE.AmbientLight(0x223344, 0.6));

// -------------------------------------------------------------------
//  STARFIELD  (two sizes for a little variation; static)
// -------------------------------------------------------------------
const starGroup = new THREE.Group();
scene.add(starGroup);

function makeStars(count, size, opacity) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // random point in a thick spherical shell around the grid
    const r = 90 + Math.random() * 320;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size,
    sizeAttenuation: false,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}
starGroup.add(makeStars(620, 1.4, 0.85)); // tiny
starGroup.add(makeStars(320, 2.6, 0.95)); // slightly less tiny

// -------------------------------------------------------------------
//  NEBULA  (a few large, faint, additive sprites — atmosphere only)
// -------------------------------------------------------------------
function radialTexture(hex) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const col = new THREE.Color(hex);
  const r = Math.round(col.r * 255);
  const g = Math.round(col.g * 255);
  const b = Math.round(col.b * 255);
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0.0, `rgba(${r},${g},${b},0.9)`);
  grad.addColorStop(0.4, `rgba(${r},${g},${b},0.35)`);
  grad.addColorStop(1.0, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const NEBULAE = [
  { color: 0x1a0033, scale: 60, pos: [-14, -10, -55], opacity: 0.5 },
  { color: 0x000833, scale: 80, pos: [22, 8, -70], opacity: 0.55 },
  { color: 0x1a0033, scale: 48, pos: [6, 18, -45], opacity: 0.4 },
];
for (const n of NEBULAE) {
  const mat = new THREE.SpriteMaterial({
    map: radialTexture(n.color),
    transparent: true,
    opacity: n.opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(n.scale, n.scale, 1);
  sprite.position.set(...n.pos);
  scene.add(sprite);
}

// -------------------------------------------------------------------
//  SHOOTING STARS  (camera-relative streaks across the background)
//  Parented to the camera so they always cross the current view, even
//  as OrbitControls turns the scene.
// -------------------------------------------------------------------
function makeStreakTexture() {
  const w = 256;
  const h = 64;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  // tapered tail: transparent at the left (tail), bright at the right (head)
  ctx.lineCap = 'round';
  const grad = ctx.createLinearGradient(18, 0, 238, 0);
  grad.addColorStop(0.0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.22)');
  grad.addColorStop(1.0, 'rgba(255,255,255,1)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 5;
  ctx.shadowColor = 'rgba(180,220,255,0.9)';
  ctx.shadowBlur = 9;
  ctx.beginPath();
  ctx.moveTo(18, h / 2);
  ctx.lineTo(238, h / 2);
  ctx.stroke();
  // glowing head
  const hg = ctx.createRadialGradient(238, h / 2, 0, 238, h / 2, 26);
  hg.addColorStop(0.0, 'rgba(255,255,255,1)');
  hg.addColorStop(0.4, 'rgba(200,230,255,0.7)');
  hg.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.fillStyle = hg;
  ctx.fillRect(238 - 26, 0, 52, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const STAR_TEX = makeStreakTexture();
const shootingGroup = new THREE.Group();
camera.add(shootingGroup);
scene.add(camera); // camera must be in the graph for its children to render

let shootingStars = [];
let nextStarIn = 1.5 + Math.random() * 2; // first streak comes fairly soon

function spawnShootingStar() {
  const d = 70; // distance in front of the camera (behind the lattice)
  const halfH = Math.tan(((camera.fov * Math.PI) / 180) / 2) * d;
  const halfW = halfH * camera.aspect;
  const A = Math.random() * Math.PI * 2; // travel direction
  const dx = Math.cos(A);
  const dy = Math.sin(A);
  const maxHalf = Math.max(halfW, halfH);
  const L = 2.6 * maxHalf; // total travel — fully crosses the view
  const off = (Math.random() - 0.5) * 1.4 * Math.min(halfW, halfH);
  const life = 0.3 + Math.random() * 0.2; // 0.3 - 0.5 s
  const length = 12 + Math.random() * 10;
  const thick = 1.2 + Math.random() * 0.8;

  const mat = new THREE.SpriteMaterial({
    map: STAR_TEX,
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    rotation: A, // align the streak with its travel direction
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(length, thick, 1);
  // start just off the edge opposite the travel direction (+ perpendicular jitter)
  sprite.position.set(-dx * L * 0.55 - dy * off, -dy * L * 0.55 + dx * off, -d);
  shootingGroup.add(sprite);
  shootingStars.push({ sprite, mat, dx, dy, speed: L / life, age: 0, life });
}

function updateShootingStars(dt) {
  nextStarIn -= dt;
  if (nextStarIn <= 0) {
    spawnShootingStar();
    nextStarIn = 3 + Math.random() * 2; // every 3 - 5 s
  }
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.age += dt;
    const p = s.age / s.life;
    if (p >= 1) {
      shootingGroup.remove(s.sprite);
      s.mat.dispose();
      shootingStars.splice(i, 1);
      continue;
    }
    s.sprite.position.x += s.dx * s.speed * dt;
    s.sprite.position.y += s.dy * s.speed * dt;
    // quick fade in, hold, then fade out so it streaks and vanishes
    let o = 1;
    if (p < 0.15) o = p / 0.15;
    else if (p > 0.6) o = Math.max(0, 1 - (p - 0.6) / 0.4);
    s.mat.opacity = o;
  }
}

// -------------------------------------------------------------------
//  GRID CONNECTION LINES  (faint static lattice cage)
// -------------------------------------------------------------------
{
  const pts = [];
  for (let x = 0; x < SIZE; x++)
    for (let y = 0; y < SIZE; y++)
      for (let z = 0; z < SIZE; z++) {
        const px = gridToWorld(x);
        const py = gridToWorld(y);
        const pz = gridToWorld(z);
        if (x < SIZE - 1) pts.push(px, py, pz, gridToWorld(x + 1), py, pz);
        if (y < SIZE - 1) pts.push(px, py, pz, px, gridToWorld(y + 1), pz);
        if (z < SIZE - 1) pts.push(px, py, pz, px, py, gridToWorld(z + 1));
      }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const mat = new THREE.LineBasicMaterial({
    color: 0x334455,
    transparent: true,
    opacity: 0.08,
  });
  scene.add(new THREE.LineSegments(geo, mat));
}

// -------------------------------------------------------------------
//  LETTER TEXTURES  (cached per letter — dark glowing face)
// -------------------------------------------------------------------
const textureCache = new Map();
function getLetterTexture(letter) {
  if (textureCache.has(letter)) return textureCache.get(letter);
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');

  // semi-transparent dark face
  ctx.fillStyle = 'rgba(10, 10, 26, 0.85)';
  ctx.fillRect(0, 0, 256, 256);

  // faint inner border for a little depth
  ctx.strokeStyle = 'rgba(0, 170, 255, 0.10)';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 236, 236);

  // glowing white letter (drawn twice for a stronger bloom)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 150px "Space Mono", "Courier New", monospace';
  ctx.shadowColor = 'rgba(160, 220, 255, 0.95)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(letter, 128, 140);
  ctx.shadowBlur = 14;
  ctx.fillText(letter, 128, 140);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(letter, tex);
  return tex;
}

// shared geometries (one box / one edge set reused by every cube)
const boxGeo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
const edgeGeo = new THREE.EdgesGeometry(boxGeo);

// -------------------------------------------------------------------
//  GAME STATE
// -------------------------------------------------------------------
let grid = []; // grid[x][y][z] -> cube | null
let cubes = []; // flat list of live cubes
let selection = []; // ordered list of selected cubes (click order)
let selectionLights = [];

let tweens = [];
let interactionLocked = true; // unlocked once the grid finishes assembling
let gameState = 'loading'; // 'loading' | 'playing' | 'won' | 'dead' | 'gameover'

let timeLeft = TIMER_START; // seconds remaining on the countdown
let timerActive = false; // starts ticking once the grid finishes assembling

let hintsLeft = MAX_HINTS; // hints remaining this game
let triesLeft = MAX_TRIES; // wrong attempts remaining this game

let targetScore = 0;
let displayedScore = 0;
let foundCount = 0;

let now = performance.now() / 1000; // must be real time before any tween is made
let prevT = now;
let lastInteract = now;

// -------------------------------------------------------------------
//  TWEEN SYSTEM
// -------------------------------------------------------------------
function tween({ duration, onUpdate, onComplete, delay = 0 }) {
  tweens.push({
    start: now + delay,
    duration: Math.max(0.0001, duration),
    onUpdate,
    onComplete,
  });
}
function scheduleAfter(delay, fn) {
  tween({ duration: 0.0001, delay, onUpdate: null, onComplete: fn });
}
function updateTweens() {
  for (let i = tweens.length - 1; i >= 0; i--) {
    const t = tweens[i];
    if (now < t.start) continue;
    const p = Math.min(1, (now - t.start) / t.duration);
    if (t.onUpdate) t.onUpdate(p);
    if (p >= 1) {
      tweens.splice(i, 1);
      if (t.onComplete) t.onComplete();
    }
  }
}

// -------------------------------------------------------------------
//  CUBE CREATION
// -------------------------------------------------------------------
function makeCube(letter, gx, gy, gz) {
  const group = new THREE.Group();

  const mat = new THREE.MeshBasicMaterial({
    map: getLetterTexture(letter),
    transparent: true,
    opacity: 1,
    depthWrite: true,
  });
  const mesh = new THREE.Mesh(boxGeo, mat);

  const edgeMat = new THREE.LineBasicMaterial({
    color: COL_EDGE,
    transparent: true,
    opacity: EDGE_OPACITY,
  });
  const edges = new THREE.LineSegments(edgeGeo, edgeMat);

  // fake bloom: a slightly larger additive shell behind the cube
  const bloomMat = new THREE.MeshBasicMaterial({
    color: COL_SELECT,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const bloom = new THREE.Mesh(boxGeo, bloomMat);
  bloom.scale.setScalar(1.18);
  bloom.visible = false;

  group.add(mesh, edges, bloom);
  group.position.set(gridToWorld(gx), gridToWorld(gy), gridToWorld(gz));

  const cube = {
    group, mesh, edges, bloom, mat, edgeMat, bloomMat,
    letter, gx, gy, gz,
    selected: false,
    busy: false,
  };
  mesh.userData.cube = cube;
  return cube;
}

// -------------------------------------------------------------------
//  GRID SCAN  (used both for seeding and for "no moves" detection)
//  getCell(x, y, z) -> { letter } | null
//  Returns a list of { word, cells } for every valid 3-4 letter word
//  found in a contiguous run of cells along any axis (fwd or reversed).
// -------------------------------------------------------------------
function scanGrid(getCell) {
  const found = [];

  const checkRun = (run) => {
    const letters = run.map((c) => (c.letter || '').toLowerCase());
    const n = letters.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 3; j <= n; j++) {
        const seg = letters.slice(i, j);
        const fwd = seg.join('');
        const bwd = seg.slice().reverse().join('');
        if (WORDS.has(fwd)) found.push({ word: fwd, cells: run.slice(i, j) });
        else if (WORDS.has(bwd))
          found.push({ word: bwd, cells: run.slice(i, j) });
      }
    }
  };

  const scanLine = (cells) => {
    let run = [];
    for (const c of cells) {
      if (c) run.push(c);
      else {
        if (run.length >= 3) checkRun(run);
        run = [];
      }
    }
    if (run.length >= 3) checkRun(run);
  };

  for (let a = 0; a < SIZE; a++) {
    for (let b = 0; b < SIZE; b++) {
      const lineX = [];
      const lineY = [];
      const lineZ = [];
      for (let v = 0; v < SIZE; v++) {
        lineX.push(getCell(v, a, b));
        lineY.push(getCell(a, v, b));
        lineZ.push(getCell(a, b, v));
      }
      scanLine(lineX);
      scanLine(lineY);
      scanLine(lineZ);
    }
  }
  return found;
}

// -------------------------------------------------------------------
//  SEEDING  (guarantee >= 12 words; up to 50 attempts)
// -------------------------------------------------------------------
function seedLetters() {
  let best = null;
  let bestCount = -1;
  for (let attempt = 0; attempt < 50; attempt++) {
    const L = [];
    for (let x = 0; x < SIZE; x++) {
      L[x] = [];
      for (let y = 0; y < SIZE; y++) {
        L[x][y] = [];
        for (let z = 0; z < SIZE; z++) L[x][y][z] = randomLetter();
      }
    }
    const count = scanGrid((x, y, z) => ({ letter: L[x][y][z] })).length;
    if (count >= 12) return L;
    if (count > bestCount) {
      bestCount = count;
      best = L;
    }
  }
  return best; // best effort if we somehow never reach 12
}

// -------------------------------------------------------------------
//  BUILD / TEARDOWN
// -------------------------------------------------------------------
function clearGridObjects() {
  for (const c of cubes) {
    scene.remove(c.group);
    c.mat.dispose();
    c.edgeMat.dispose();
    c.bloomMat.dispose();
  }
  cubes = [];
  for (const l of selectionLights) scene.remove(l);
  selectionLights = [];
}

function buildGrid() {
  const L = seedLetters();
  grid = [];
  cubes = [];
  for (let x = 0; x < SIZE; x++) {
    grid[x] = [];
    for (let y = 0; y < SIZE; y++) {
      grid[x][y] = [];
      for (let z = 0; z < SIZE; z++) {
        const cube = makeCube(L[x][y][z], x, y, z);
        grid[x][y][z] = cube;
        cubes.push(cube);
        scene.add(cube.group);
      }
    }
  }
  animateAssembly();
}

// staggered fly-in / fade-in assembly
function animateAssembly() {
  interactionLocked = true;
  const n = cubes.length;
  cubes.forEach((cube, i) => {
    const home = cube.group.position.clone();
    // start slightly outside the final position
    const dir = home.clone().normalize();
    const start = home
      .clone()
      .multiplyScalar(1.45)
      .add(dir.multiplyScalar(2 + Math.random() * 3));
    cube.busy = true;
    cube.group.position.copy(start);
    cube.group.scale.setScalar(0.05);
    cube.mat.opacity = 0;
    cube.edgeMat.opacity = 0;

    const delay = (i / n) * (ASSEMBLE_TOTAL - ASSEMBLE_DURATION);
    tween({
      duration: ASSEMBLE_DURATION,
      delay,
      onUpdate: (p) => {
        const e = easeOutCubic(p);
        cube.group.position.lerpVectors(start, home, e);
        cube.group.scale.setScalar(easeOutBack(p));
        cube.mat.opacity = e;
        cube.edgeMat.opacity = EDGE_OPACITY * e;
      },
      onComplete: () => {
        cube.group.position.copy(home);
        cube.group.scale.setScalar(1);
        cube.mat.opacity = 1;
        cube.edgeMat.opacity = EDGE_OPACITY;
        cube.busy = false;
      },
    });
  });
  scheduleAfter(ASSEMBLE_TOTAL + 0.1, () => {
    if (gameState === 'loading' || gameState === 'playing') {
      interactionLocked = false;
      timerActive = true; // countdown begins once you can actually play
    }
  });
}

// -------------------------------------------------------------------
//  SELECTION
// -------------------------------------------------------------------
function setSelection(arr) {
  for (const c of selection) c.selected = false;
  selection = arr;
  for (const c of selection) c.selected = true;

  // selection point lights (cyan) — one per selected cube
  for (const l of selectionLights) scene.remove(l);
  selectionLights = [];
  for (const c of selection) {
    const light = new THREE.PointLight(COL_SELECT, 1.4, 6, 2);
    light.position.copy(c.group.position);
    scene.add(light);
    selectionLights.push(light);
  }
}

function clearSelection() {
  setSelection([]);
  updateWordHUD();
}

// Free, anagram-style selection: click any cube to add it (in click
// order); click an already-selected cube to remove it. No axis/line rules.
function onCubeClick(cube) {
  playClick();
  if (cube.selected) {
    setSelection(selection.filter((c) => c !== cube));
  } else {
    setSelection([...selection, cube]);
  }
  updateWordHUD();
}

// -------------------------------------------------------------------
//  SUBMIT / VALIDATE
// -------------------------------------------------------------------
function currentLetters() {
  return selection.map((c) => c.letter.toLowerCase());
}
function isValidSelection() {
  if (selection.length < 3) return false;
  return WORDS.has(currentLetters().join(''));
}

// Can ANY word in the list still be spelled from the letters left on the
// board? Anagram/subset check — replaces the old line-based scan now that
// selection is free-form (any cubes, any order).
function anyWordFormable() {
  if (cubes.length < 3) return false;
  const avail = {};
  for (const c of cubes) {
    const l = c.letter.toLowerCase();
    avail[l] = (avail[l] || 0) + 1;
  }
  for (const word of WORDS) {
    if (word.length > cubes.length) continue;
    const need = {};
    let ok = true;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      need[ch] = (need[ch] || 0) + 1;
      if (need[ch] > (avail[ch] || 0)) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}

function submit() {
  if (gameState !== 'playing' || interactionLocked) return;
  if (selection.length < 3) {
    shakeWord();
    playInvalid();
    return;
  }
  const word = currentLetters().join('');
  const list = selection.slice();
  if (WORDS.has(word)) {
    onValid(word, list);
  } else {
    onInvalid(list);
  }
}

function onValid(word, list) {
  interactionLocked = true;
  const pts = list.length * 10;
  targetScore += pts;
  addFoundWord(word, pts);

  setSelection([]);
  updateWordHUD();

  playValid(word.length);

  // 1) flash green, then 2) clear (white pop), then 3) gravity, then rescan
  flashCubes(list, COL_VALID, 0.3, () => {
    playClear();
    let remaining = list.length;
    for (const c of list) {
      clearCubeAnim(c, () => {
        removeCube(c);
        remaining -= 1;
        if (remaining === 0) {
          const moved = applyGravity();
          scheduleAfter((moved ? 0.5 : 0) + 0.6, afterResolve);
        }
      });
    }
  });
}

function onInvalid(list) {
  interactionLocked = true;
  playInvalid();
  setSelection([]);
  updateWordHUD();
  triesLeft -= 1;
  updateTriesHUD();
  flashCubes(list, COL_INVALID, 0.3, () => {
    if (triesLeft <= 0) gameOver(); // out of wrong tries -> game over
    else interactionLocked = false;
  });
}

function afterResolve() {
  if (gameState !== 'playing') return; // e.g. the clock ran out mid-resolve
  clearSelection();
  if (cubes.length === 0) {
    winGame();
    return;
  }
  interactionLocked = false;
  if (!anyWordFormable()) noMoreWords();
}

// -------------------------------------------------------------------
//  HINTS
// -------------------------------------------------------------------
// Find a valid word spellable from the cubes on the board (prefer a
// longer one for a more useful hint) and return the cubes that spell it.
function findHintWord() {
  const byLetter = {};
  for (const c of cubes) {
    const l = c.letter.toLowerCase();
    (byLetter[l] = byLetter[l] || []).push(c);
  }
  const avail = {};
  for (const l in byLetter) avail[l] = byLetter[l].length;

  let best = null;
  for (const word of WORDS) {
    if (word.length < 3 || word.length > cubes.length) continue;
    if (best && word.length <= best.length) continue; // only seek longer ones
    const need = {};
    let ok = true;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      need[ch] = (need[ch] || 0) + 1;
      if (need[ch] > (avail[ch] || 0)) { ok = false; break; }
    }
    if (ok) {
      best = word;
      if (best.length >= 6) break; // long enough — stop searching
    }
  }
  if (!best) return null;

  const pools = {};
  for (const l in byLetter) pools[l] = byLetter[l].slice();
  const chosen = [];
  for (const ch of best) chosen.push(pools[ch].pop());
  return chosen;
}

function useHint() {
  if (gameState !== 'playing' || interactionLocked || hintsLeft <= 0) return;
  const chosen = findHintWord();
  if (!chosen) return; // nothing formable (shouldn't happen mid-game)
  hintsLeft -= 1;
  updateHintHUD();
  const until = now + 3; // pulse gold for 3 seconds
  for (const c of chosen) c.hintUntil = until;
  playHint();
}

// -------------------------------------------------------------------
//  CUBE ANIMATIONS: flash / clear / fall
// -------------------------------------------------------------------
function flashCubes(list, colorHex, duration, done) {
  for (const c of list) c.busy = true;
  tween({
    duration,
    onUpdate: (p) => {
      const pulse = 0.5 + 0.5 * Math.sin(p * Math.PI * 3);
      for (const c of list) {
        c.edgeMat.color.setHex(colorHex);
        c.edgeMat.opacity = 0.6 + 0.4 * pulse;
        c.mat.color.setHex(colorHex);
        c.bloom.visible = true;
        c.bloomMat.color.setHex(colorHex);
        c.bloomMat.opacity = 0.18 + 0.14 * pulse;
      }
    },
    onComplete: () => {
      for (const c of list) {
        c.busy = false;
        c.mat.color.setHex(COL_WHITE);
        c.bloom.visible = false;
      }
      if (done) done();
    },
  });
}

function clearCubeAnim(c, done) {
  c.busy = true;
  c.selected = false;
  const baseScale = c.group.scale.x || 1;
  tween({
    duration: 0.4,
    onUpdate: (p) => {
      // bright white flash that peaks early, then scale down to nothing
      const flash = Math.sin(Math.min(1, p * 1.7) * Math.PI);
      c.bloom.visible = true;
      c.bloomMat.color.setHex(COL_WHITE);
      c.bloomMat.opacity = Math.max(0, flash) * 0.95;
      c.edgeMat.color.setHex(COL_WHITE);
      c.edgeMat.opacity = 1 - p;
      c.mat.color.setHex(COL_WHITE);
      c.mat.opacity = 1 - easeInCubic(p);
      c.group.scale.setScalar(Math.max(0.0001, baseScale * (1 - easeInCubic(p))));
    },
    onComplete: () => {
      if (done) done();
    },
  });
}

function fallTween(c, targetWorldY) {
  c.busy = true;
  const startY = c.group.position.y;
  tween({
    duration: 0.5,
    onUpdate: (p) => {
      const e = easeInOutQuad(p);
      c.group.position.y = startY + (targetWorldY - startY) * e;
      // fake motion-blur trail: a brief opacity dip mid-fall
      const dip = Math.sin(p * Math.PI);
      c.mat.opacity = 1 - 0.35 * dip;
    },
    onComplete: () => {
      c.group.position.y = targetWorldY;
      c.mat.opacity = 1;
      c.busy = false;
    },
  });
}

function removeCube(c) {
  scene.remove(c.group);
  c.mat.dispose();
  c.edgeMat.dispose();
  c.bloomMat.dispose();
  if (grid[c.gx] && grid[c.gx][c.gy]) grid[c.gx][c.gy][c.gz] = null;
  const idx = cubes.indexOf(c);
  if (idx >= 0) cubes.splice(idx, 1);
}

// gravity along -Y: each column (x,z) collapses toward y = 0
function applyGravity() {
  let moved = false;
  for (let x = 0; x < SIZE; x++) {
    for (let z = 0; z < SIZE; z++) {
      let writeY = 0;
      for (let y = 0; y < SIZE; y++) {
        const c = grid[x][y][z];
        if (!c) continue;
        if (y !== writeY) {
          grid[x][y][z] = null;
          grid[x][writeY][z] = c;
          c.gy = writeY;
          fallTween(c, gridToWorld(writeY));
          moved = true;
        }
        writeY += 1;
      }
    }
  }
  return moved;
}

// -------------------------------------------------------------------
//  WIN / DEAD STATES
// -------------------------------------------------------------------
function winGame() {
  if (gameState !== 'playing') return;
  gameState = 'won';
  interactionLocked = true;
  timerActive = false;
  playWin();
  // remaining starfield accelerates outward
  const s0 = starGroup.scale.x;
  tween({
    duration: 4,
    onUpdate: (p) => {
      const e = easeOutCubic(p);
      starGroup.scale.setScalar(s0 + (5 - s0) * e);
    },
  });
  showMessage('LATTICE COMPLETE', `FINAL SCORE ${targetScore}`, 'New Game');
}

function noMoreWords() {
  if (gameState !== 'playing') return;
  gameState = 'dead';
  interactionLocked = true;
  timerActive = false;
  showMessage(
    'NO MORE WORDS',
    `${cubes.length} CUBES REMAIN · SCORE ${targetScore}`,
    'New Game'
  );
}

// -------------------------------------------------------------------
//  NEW GAME
// -------------------------------------------------------------------
function newGame() {
  hideMessage();
  tweens = [];
  clearGridObjects();
  grid = [];
  selection = [];

  starGroup.scale.setScalar(1);
  targetScore = 0;
  displayedScore = 0;
  foundCount = 0;
  renderFoundReset();

  timeLeft = TIMER_START;
  timerActive = false; // re-enabled when the new grid finishes assembling
  updateTimerHUD();

  hintsLeft = MAX_HINTS;
  triesLeft = MAX_TRIES;
  updateHintHUD();
  updateTriesHUD();

  gameState = 'playing';
  buildGrid();
  updateWordHUD();
}

// -------------------------------------------------------------------
//  HUD
// -------------------------------------------------------------------
function updateWordHUD() {
  const letters = selection.map((c) => c.letter);
  elWord.textContent = letters.join(' ');
  elWord.classList.remove('shake');
  elWord.classList.toggle('valid', isValidSelection());
  // hint visible only when nothing is selected and we're playing
  const showHint = selection.length === 0 && gameState === 'playing';
  elHint.style.opacity = showHint ? '1' : '0';
}

function shakeWord() {
  elWord.classList.remove('shake');
  // force reflow so the animation can restart
  void elWord.offsetWidth;
  elWord.classList.add('shake');
}

function updateTimerHUD() {
  elTimer.textContent = Math.ceil(timeLeft);
  elTimer.classList.toggle('low', timeLeft <= 30); // red + pulse at 30s
}

function updateHintHUD() {
  elHintDots.textContent =
    '●'.repeat(hintsLeft) + '○'.repeat(MAX_HINTS - hintsLeft);
  elHintBtn.disabled = hintsLeft <= 0; // grays out after 3 used
}

function updateTriesHUD() {
  elTriesDots.textContent =
    '●'.repeat(triesLeft) + '○'.repeat(MAX_TRIES - triesLeft);
  elTriesRow.classList.toggle('danger', triesLeft <= 1);
}

function gameOver() {
  if (gameState !== 'playing') return;
  gameState = 'gameover';
  timerActive = false;
  interactionLocked = true;
  setSelection([]);
  updateWordHUD();
  elHintBtn.disabled = true;
  playGameOver();
  showMessage(
    'GAME OVER',
    `SCORE ${targetScore} · ${foundCount} WORDS FOUND`,
    'Play Again'
  );
}

function timeUp() {
  if (gameState !== 'playing') return;
  timeLeft = 0;
  updateTimerHUD();
  gameOver();
}

function addFoundWord(word, pts) {
  foundCount += 1;
  const div = document.createElement('div');
  div.className = 'found-item';
  div.innerHTML = `${word.toUpperCase()}<span class="pts">+${pts}</span>`;
  // newest on top, just under the label
  elWordsFound.insertBefore(div, elWordsFound.children[1] || null);
  // keep only the last 5 (plus the label at index 0)
  while (elWordsFound.children.length > 6)
    elWordsFound.removeChild(elWordsFound.lastChild);
}
function renderFoundReset() {
  while (elWordsFound.children.length > 1)
    elWordsFound.removeChild(elWordsFound.lastChild);
}

function showMessage(title, sub, btn) {
  elMsgTitle.textContent = title;
  elMsgSub.textContent = sub || '';
  elMsgBtn.textContent = btn || 'New Game';
  elOverlay.classList.add('show');
}
function hideMessage() {
  elOverlay.classList.remove('show');
}

// -------------------------------------------------------------------
//  SOUND  (Web Audio — generated tones, no files)
// -------------------------------------------------------------------
let audioCtx = null;
function ensureAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    audioCtx = null;
  }
}
function tone(freq, dur, type = 'sine', vol = 0.15, when = 0) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime + when;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}
function playClick() {
  ensureAudio();
  tone(440, 0.07, 'sine', 0.06);
}
function playValid(len) {
  ensureAudio();
  const base = 330;
  const steps = Math.min(len, 6);
  for (let i = 0; i < steps; i++)
    tone(base * Math.pow(2, (i * 2) / 12), 0.2, 'triangle', 0.11, i * 0.07);
}
function playInvalid() {
  ensureAudio();
  tone(150, 0.22, 'sawtooth', 0.07);
  tone(120, 0.22, 'sawtooth', 0.05, 0.02);
}
function playClear() {
  ensureAudio();
  tone(90, 0.6, 'sine', 0.18);
  tone(120, 0.5, 'sine', 0.1, 0.02);
}
function playWin() {
  ensureAudio();
  const notes = [330, 415, 494, 659, 784];
  notes.forEach((f, i) => tone(f, 0.5, 'triangle', 0.12, i * 0.12));
}
function playGameOver() {
  ensureAudio();
  const notes = [392, 311, 233, 175]; // descending, somber
  notes.forEach((f, i) => tone(f, 0.45, 'sine', 0.13, i * 0.13));
}
function playHint() {
  ensureAudio();
  tone(880, 0.12, 'sine', 0.07);
  tone(1320, 0.16, 'sine', 0.05, 0.06);
}

// -------------------------------------------------------------------
//  INTERACTION (raycasting + idle auto-rotate)
// -------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let pointerDown = null;

function resetIdle() {
  lastInteract = now;
  controls.autoRotate = false;
}

function raycastCube(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const meshes = cubes.map((c) => c.mesh);
  const hits = raycaster.intersectObjects(meshes, false);
  return hits.length ? hits[0].object.userData.cube : null;
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  ensureAudio();
  resetIdle();
  pointerDown = { x: e.clientX, y: e.clientY };
});
renderer.domElement.addEventListener('pointerup', (e) => {
  resetIdle();
  if (!pointerDown) return;
  const dx = e.clientX - pointerDown.x;
  const dy = e.clientY - pointerDown.y;
  pointerDown = null;
  if (Math.hypot(dx, dy) > 6) return; // it was a drag (orbit), not a click
  if (interactionLocked || gameState !== 'playing') return;
  const cube = raycastCube(e.clientX, e.clientY);
  if (cube) onCubeClick(cube);
  else clearSelection();
});
renderer.domElement.addEventListener('wheel', resetIdle, { passive: true });
controls.addEventListener('start', resetIdle);

window.addEventListener('keydown', (e) => {
  resetIdle();
  if (e.key === 'Enter') {
    e.preventDefault();
    submit();
  } else if (e.key === 'Escape') {
    if (gameState === 'playing') clearSelection();
  }
});

// Blur after click so a lingering button focus can't be re-fired by the
// Enter key (that was the cause of stray New Game restarts during play).
function bindButton(el, fn) {
  el.addEventListener('click', () => {
    el.blur();
    fn();
  });
}
bindButton(elSubmit, submit);
bindButton(elHintBtn, useHint);
bindButton(elNewGame, newGame);
bindButton(elMsgBtn, newGame);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// -------------------------------------------------------------------
//  PER-FRAME CUBE STYLING (selection pulse + return to rest)
// -------------------------------------------------------------------
const restScale = new THREE.Vector3(1, 1, 1);
function styleCubes() {
  const k = Math.min(1, (now - prevFrameForStyle) * 12);
  for (const c of cubes) {
    if (c.busy) continue; // an animation owns this cube right now
    if (c.selected) {
      const pulse = 0.5 + 0.5 * Math.sin(now * 5);
      const s = 1.12 + 0.05 * Math.sin(now * 5);
      c.group.scale.setScalar(s);
      c.edgeMat.color.setHex(COL_SELECT);
      c.edgeMat.opacity = 0.7 + 0.3 * pulse;
      c.bloom.visible = true;
      c.bloomMat.color.setHex(COL_SELECT);
      c.bloomMat.opacity = 0.12 + 0.08 * pulse;
      c.mat.color.setHex(COL_WHITE);
      c.mat.opacity = 1;
    } else if (c.hintUntil && now < c.hintUntil) {
      // gold hint pulse
      const pulse = 0.5 + 0.5 * Math.sin(now * 6);
      c.group.scale.setScalar(1.1 + 0.06 * Math.sin(now * 6));
      c.edgeMat.color.setHex(COL_HINT);
      c.edgeMat.opacity = 0.7 + 0.3 * pulse;
      c.bloom.visible = true;
      c.bloomMat.color.setHex(COL_HINT);
      c.bloomMat.opacity = 0.16 + 0.12 * pulse;
      c.mat.color.setHex(COL_WHITE);
      c.mat.opacity = 1;
    } else {
      const sc = c.group.scale;
      sc.x += (1 - sc.x) * k;
      sc.y += (1 - sc.y) * k;
      sc.z += (1 - sc.z) * k;
      c.edgeMat.color.setHex(COL_EDGE);
      c.edgeMat.opacity = EDGE_OPACITY;
      c.bloom.visible = false;
      c.mat.color.setHex(COL_WHITE);
      c.mat.opacity = 1;
    }
  }
}
let prevFrameForStyle = prevT;

// -------------------------------------------------------------------
//  MAIN LOOP
// -------------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() / 1000;
  now = t;
  const dt = Math.min(0.05, Math.max(0, now - prevT)); // clamped frame delta

  updateTweens();

  if (now - lastInteract > 5 && gameState === 'playing')
    controls.autoRotate = true;
  controls.update();

  styleCubes();
  prevFrameForStyle = now;

  // countdown clock
  if (gameState === 'playing' && timerActive) {
    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      timeUp();
    }
  }
  updateTimerHUD();

  // ambient shooting stars
  updateShootingStars(dt);

  // animated score tick-up
  displayedScore += (targetScore - displayedScore) * Math.min(1, dt * 8);
  if (Math.abs(targetScore - displayedScore) < 0.5) displayedScore = targetScore;
  elScore.textContent = Math.round(displayedScore);

  // keep selection lights glued to their cubes
  for (let i = 0; i < selection.length; i++) {
    if (selectionLights[i]) selectionLights[i].position.copy(selection[i].group.position);
  }

  prevT = now;
  renderer.render(scene, camera);
}

// -------------------------------------------------------------------
//  BOOT
// -------------------------------------------------------------------
function init() {
  now = performance.now() / 1000; // align tween clock with the render loop
  prevT = now;
  prevFrameForStyle = now;
  lastInteract = now;
  timeLeft = TIMER_START;
  timerActive = false;
  updateTimerHUD();
  hintsLeft = MAX_HINTS;
  triesLeft = MAX_TRIES;
  updateHintHUD();
  updateTriesHUD();
  gameState = 'playing';
  buildGrid();
  updateWordHUD();
  animate();
  // fade out the loading splash
  setTimeout(() => elLoading.classList.add('hidden'), 300);
  setTimeout(() => {
    if (elLoading.parentNode) elLoading.parentNode.removeChild(elLoading);
  }, 1000);
}

// Fetch the dictionary first (showing the loading splash), then start.
async function boot() {
  elLoading.textContent = 'LOADING DICTIONARY';
  try {
    WORDS = await loadDictionary();
  } catch (e) {
    console.warn('Dictionary fetch failed — using built-in fallback list.', e);
    WORDS = new Set(FALLBACK_WORDS);
    elLoading.textContent = 'OFFLINE · BASIC WORD LIST';
  }
  init();
}
boot();
