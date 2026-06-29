// ==================== CONSTANTES ====================
const W = 900;
const H = 700;

// ==================== ESTADO DO JOGO ====================
let state = 'menu';
let menuIndex = 0;
let settingsIndex = 0;
let selectIndex = 0;
let frameCounter = 0;
let deathCount = 0;
let bossTransition = 0;

// IMAGENS
let bossImg = null;
let playerImgs = []; // Array para 6 personagens
let enemyImg = null; // Imagem dos inimigos

// Configurações
let settings = {
  difficulty: 1,
  musicVolume: 0.5,
  sfxVolume: 0.7
};

// Personagens
const characters = [
  { name: 'Cavaleiro verde' },
  { name: 'Cavaleiro azul' },
  { name: 'Cavaleiro vermelho' },
  { name: 'Cavaleiro laranja' },
  { name: 'Rei' },
  { name: 'Cavaleiro branco'}
];

// Jogo
let player;
let enemies = [];
let boss = null;
let missiles = [];
let particles = [];
let cameraX = 0;
let levelLength = 3000;
let showArrow = false;
let screenShake = 0;

// ==================== SETUP ====================
function setup() {
  createCanvas(W, H);
  textFont('Arial');
  
  // Carregar imagem do boss
  bossImg = loadImage('boss.png');
  
  // Carregar imagens dos 6 players com os NOMES CORRETOS
  playerImgs[0] = loadImage('verde.png');    // Cavaleiro
  playerImgs[1] = loadImage('azul.png');     // Arqueiro
  playerImgs[2] = loadImage('vermelho.png'); // Mago
  playerImgs[3] = loadImage('laranja.png');  // Bárbaro
  playerImgs[4] = loadImage('rei.png');      // Ninja
  playerImgs[5] = loadImage('branco.png');   // Paladino
  
  // Carregar imagem dos inimigos
  enemyImg = loadImage('preto.png');
}

// ==================== DRAW PRINCIPAL ====================
function draw() {
  frameCounter++;
  
  push();
  if (screenShake > 0) {
    translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
    screenShake *= 0.9;
    if (screenShake < 0.5) screenShake = 0;
  }

  switch(state) {
    case 'menu': drawMenu(); break;
    case 'settings': drawSettings(); break;
    case 'credits': drawCredits(); break;
    case 'select': drawSelect(); break;
    case 'play': updatePlay(); drawPlay(); break;
    case 'boss': updateBoss(); drawBoss(); break;
    case 'gameover': drawGameOver(); break;
    case 'victory': drawVictory(); break;
  }
  
  pop();
}

// ==================== MENU ====================
function drawMenu() {
  drawAnimatedBackground();
  
  push();
  translate(W/2, 90);
  rotate(sin(frameCounter * 0.02) * 0.05);
  
  fill(0, 100);
  noStroke();
  textSize(64);
  textAlign(CENTER, CENTER);
  text('CASTLE CRASHERS', 4, 4);
  
  fill(255, 220, 80);
  stroke(120, 60, 0);
  strokeWeight(4);
  text('CASTLE CRASHERS', 0, 0);
  pop();
  
  fill(200);
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text('Mini Gameplay', W/2, 140);
  
  const options = ['START', 'CONFIGURAÇÕES', 'CRÉDITOS'];
  for (let i = 0; i < options.length; i++) {
    drawMenuButton(W/2 - 180, 210 + i * 80, 360, 60, options[i], menuIndex === i);
  }
  
  fill(180);
  textSize(14);
  textAlign(CENTER, CENTER);
  noStroke();
  text('Use ↑ ↓ para navegar e ENTER para selecionar', W/2, H - 40);
}

function drawMenuButton(x, y, w, h, label, selected) {
  push();
  
  let yOffset = 0;
  if (selected) {
    yOffset = sin(frameCounter * 0.1) * 3;
  }
  
  noStroke();
  fill(0, 150);
  rect(x + 5, y + 5 + yOffset, w, h, 8);
  
  if (selected) {
    fill(140, 200, 140);
    stroke(220, 255, 220);
  } else {
    fill(110, 110, 110);
    stroke(180, 180, 180);
  }
  strokeWeight(3);
  rect(x, y + yOffset, w, h, 8);
  
  noStroke();
  if (selected) {
    fill(200, 255, 200, 120);
  } else {
    fill(160, 160, 160, 120);
  }
  rect(x + 5, y + 5 + yOffset, w - 10, 6, 3);
  
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(26);
  text(label, x + w/2, y + h/2 + yOffset);
  
  pop();
}

function drawAnimatedBackground() {
  for (let i = 0; i < H; i++) {
    let c = lerpColor(color(30, 20, 60), color(80, 40, 100), i / H);
    stroke(c);
    line(0, i, W, i);
  }
  
  noStroke();
  for (let i = 0; i < 80; i++) {
    let sx = (i * 137) % W;
    let sy = (i * 73) % (H * 0.6);
    let brightness = (sin(frameCounter * 0.05 + i) + 1) * 127;
    fill(255, 255, 255, brightness);
    let sz = (sin(frameCounter * 0.03 + i * 2) + 1) * 2;
    ellipse(sx, sy, sz, sz);
  }
  
  fill(20, 15, 35);
  noStroke();
  rect(0, H - 200, W, 200);
  
  for (let i = 0; i < 6; i++) {
    let tx = i * 180 + 50;
    fill(25, 20, 40);
    rect(tx, H - 300, 100, 100);
    
    for (let j = 0; j < 5; j++) {
      rect(tx + j * 20, H - 320, 15, 20);
    }
    
    fill(255, 200, 100, 150);
    rect(tx + 40, H - 260, 20, 30);
  }
}

// ==================== CONFIGURAÇÕES ====================
function drawSettings() {
  drawAnimatedBackground();
  
  fill(0, 180);
  noStroke();
  rect(0, 0, W, H);
  
  fill(255, 220, 80);
  textAlign(CENTER, CENTER);
  textSize(48);
  stroke(0);
  strokeWeight(3);
  text('CONFIGURAÇÕES', W/2, 60);
  
  noStroke();
  
  const options = [
    { label: 'Dificuldade', value: ['Fácil', 'Normal', 'Difícil'][settings.difficulty] },
  ];
  
  for (let i = 0; i < options.length; i++) {
    let y = 160 + i * 70;
    let selected = settingsIndex === i;
    
    if (selected) {
      fill(255, 220, 80, 50);
      stroke(255, 220, 80);
      strokeWeight(2);
    } else {
      fill(0, 100);
      noStroke();
    }
    rect(W/2 - 300, y, 600, 50, 5);
    
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(22);
    noStroke();
    text(options[i].label, W/2 - 280, y + 25);
    
    fill(255, 220, 80);
    textAlign(RIGHT, CENTER);
    text(options[i].value, W/2 + 280, y + 25);
  }
  
  fill(200);
  textSize(16);
  textAlign(CENTER, CENTER);
  noStroke();
  text('↑ ↓ Navegar | ← → Ajustar | ESC Voltar', W/2, H - 60);
  
  drawMenuButton(W/2 - 120, H - 120, 240, 50, 'VOLTAR', settingsIndex === options.length);
}

// ==================== CRÉDITOS ====================
function drawCredits() {
  drawAnimatedBackground();
  
  fill(0, 180);
  noStroke();
  rect(0, 0, W, H);
  
  fill(255, 220, 80);
  textAlign(CENTER, CENTER);
  textSize(48);
  stroke(0);
  strokeWeight(3);
  text('CRÉDITOS', W/2, 60);
  
  noStroke();
  fill(255);
  textSize(24);
  text('Castle Crashers - Mini Gameplay', W/2, 140);
  
  fill(200);
  textSize(18);
  text('Desenvolvido com p5.js', W/2, 200);
  text('Inspirado no jogo original The Behemoth', W/2, 240);
  
  fill(255, 220, 80);
  textSize(20);
  text('Desenvolvedor:', W/2, 300);
  
  fill(255, 200, 100);
  textSize(28);
  text('ANDRÉ - 2°D', W/2, 340);
  
  fill(255, 220, 80);
  textSize(20);
  text('Personagens:', W/2, 400);
  
  fill(200);
  textSize(16);
  for (let i = 0; i < characters.length; i++) {
    text(characters[i].name, W/2, 430 + i * 25);
  }
  
  fill(255, 220, 80);
  textSize(20);
  text('Inimigos: Soldados das Trevas', W/2, 540);
  
  drawMenuButton(W/2 - 120, H - 80, 240, 50, 'VOLTAR', true);
}

// ==================== SELEÇÃO ====================
function drawSelect() {
  drawAnimatedBackground();
  
  fill(255, 220, 80);
  textAlign(CENTER, CENTER);
  textSize(40);
  stroke(0);
  strokeWeight(3);
  text('ESCOLHA SEU HERÓI', W/2, 50);
  
  fill(0, 150);
  noStroke();
  rect(50, 100, 350, 450, 8);
  stroke(255, 220, 80);
  strokeWeight(2);
  noFill();
  rect(50, 100, 350, 450, 8);
  
  for (let i = 0; i < characters.length; i++) {
    let y = 130 + i * 70;
    let c = characters[i];
    
    if (i === selectIndex) {
      fill(255, 220, 80, 60);
      noStroke();
      rect(60, y, 330, 60, 5);
      stroke(255, 220, 80);
      strokeWeight(2);
      noFill();
      rect(60, y, 330, 60, 5);
    }
    
    // Mostrar imagem do player
    if (playerImgs[i]) {
      push();
      translate(110, y + 30);
      imageMode(CENTER);
      image(playerImgs[i], 0, 0, 50, 60);
      pop();
      
    } else {
      push();
      translate(110, y + 30);
      scale(0.6);
      drawMiniChar(c);
      pop();
    }
    
    noStroke();
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(20);
    text(c.name, 160, y + 20);
    
  }
  
  fill(0, 150);
  noStroke();
  rect(450, 100, 500, 450, 8);
  stroke(255, 220, 80);
  strokeWeight(2);
  noFill();
  rect(450, 100, 500, 450, 8);
  
  let sel = characters[selectIndex];
  
  // Preview grande com imagem
  if (playerImgs[selectIndex]) {
    push();
    translate(700, 350);
    imageMode(CENTER);
    image(playerImgs[selectIndex], 0, 0, 200, 240);
    pop();
  } else {
    push();
    translate(700, 380);
    scale(3);
    drawMiniChar(sel);
    pop();
  }
  
  fill(255, 220, 80);
  textAlign(CENTER, CENTER);
  textSize(32);
  noStroke();
  text(sel.name, 700, 150);
  
  fill(180);
  textSize(14);
  text('↑ ↓ Trocar | ENTER Confirmar | ESC Voltar | Z para atacar', W/2, H - 30);
}

function drawMiniChar(c) {
  noStroke();
  fill(0, 80);
  ellipse(0, 5, 40, 10);
  
  fill(c.armor[0]*0.7, c.armor[1]*0.7, c.armor[2]*0.7);
  rect(-12, -10, 10, 20);
  rect(2, -10, 10, 20);
  
  fill(c.armor[0], c.armor[1], c.armor[2]);
  stroke(0);
  strokeWeight(2);
  rect(-18, -40, 36, 35, 4);
  
  fill(c.color[0], c.color[1], c.color[2]);
  noStroke();
  ellipse(0, -52, 28, 28);
  
  fill(255);
  ellipse(-5, -53, 6, 6);
  ellipse(5, -53, 6, 6);
  fill(0);
  ellipse(-4, -53, 3, 3);
  ellipse(6, -53, 3, 3);
  
  fill(c.armor[0]*0.8, c.armor[1]*0.8, c.armor[2]*0.8);
  stroke(0);
  strokeWeight(1.5);
  arc(0, -58, 30, 20, PI, 0);
}

// ==================== GAMEPLAY ====================
function startGame() {
  deathCount = 0;
  startLevel();
}

function startLevel() {
  let c = characters[selectIndex];
  let hpMult = [1.5, 1, 0.7][settings.difficulty];
  let dmgMult = [0.7, 1, 1.3][settings.difficulty];
  
  player = {
    x: 200, y: 0, z: 0,
    vx: 0, vy: 0, vz: 0,
    hp: 100 * hpMult, maxHp: 100 * hpMult,
    damage: 20 * dmgMult,
    color: c.color, armor: c.armor,
    charIndex: selectIndex,
    facing: 1,
    attacking: false, attackTimer: 0, attackCooldown: 0,
    hurtTimer: 0, walkFrame: 0, grounded: true
  };
  
  spawnEnemies();
  
  missiles = [];
  particles = [];
  cameraX = 0;
  showArrow = false;
  state = 'play';
}

function spawnEnemies() {
  let strengthMultiplier = 1 + (deathCount * 0.3);
  
  enemies = [
    createEnemy(3000, 0, strengthMultiplier),
    createEnemy(1500, 0, strengthMultiplier),
    createEnemy(2000, 0, strengthMultiplier),
    createEnemy(1000, 0, strengthMultiplier),
        createEnemy(2500, 0, strengthMultiplier),
            createEnemy(3500, 0, strengthMultiplier)

  ];
}

function createEnemy(x, z, strengthMult = 1) {
  let hpMult = [0.7, 1, 1.5][settings.difficulty] * strengthMult;
  let dmgMult = [0.7, 1, 1.5][settings.difficulty] * strengthMult;
  
  return {
    x: x, y: 0, z: z,
    hp: 75 * hpMult, maxHp: 75 * hpMult,
    damage: 10 * dmgMult,
    alive: true,
    vx: 0, vy: 0, vz: 0,
    facing: -1,
    attackTimer: 0, attackCooldown: 60,
    hurtTimer: 0, walkFrame: 0,
    strength: strengthMult
  };
}

function updatePlay() {
  player.vx = 0;
  player.vz = 0;
  
  if (keyIsDown(LEFT_ARROW)) { player.vx = -5; player.facing = -1; }
  if (keyIsDown(RIGHT_ARROW)) { player.vx = 5; player.facing = 1; }
  if (keyIsDown(UP_ARROW)) player.vz = -3;
  if (keyIsDown(DOWN_ARROW)) player.vz = 3;
  if (keyIsDown(32) && player.grounded) {
    player.vy = -15;
    player.grounded = false;
  }
  
  player.vy += 0.8;
  player.x += player.vx;
  player.y += player.vy;
  player.z += player.vz;
  
  if (player.y >= 0) {
    player.y = 0;
    player.vy = 0;
    player.grounded = true;
  }
  
  player.x = constrain(player.x, 100, levelLength - 100);
  player.z = constrain(player.z, -150, 150);
  
  if (abs(player.vx) > 0 || abs(player.vz) > 0) player.walkFrame += 0.2;
  
  if (player.attacking) {
    player.attackTimer--;
    if (player.attackTimer <= 0) player.attacking = false;
  }
  if (player.attackCooldown > 0) player.attackCooldown--;
  if (player.hurtTimer > 0) player.hurtTimer--;
  
  if (player.hp <= 0) {
    deathCount++;
    state = 'gameover';
    return;
  }
  
  cameraX = lerp(cameraX, player.x - W/3, 0.1);
  cameraX = constrain(cameraX, 0, levelLength - W);
  
  for (let e of enemies) {
    if (!e.alive) continue;
    
    let dx = player.x - e.x;
    let dz = player.z - e.z;
    let d = sqrt(dx*dx + dz*dz);
    e.facing = dx > 0 ? 1 : -1;
    
    if (d > 80) {
      e.vx = (dx / d) * 2;
      e.vz = (dz / d) * 2;
      e.walkFrame += 0.15;
    } else {
      e.vx = 0;
      e.vz = 0;
      e.attackCooldown--;
      if (e.attackCooldown <= 0 && e.attackTimer === 0) {
        e.attackTimer = 20;
        e.attackCooldown = 90;
      }
    }
    
    if (e.attackTimer > 0) {
      e.attackTimer--;
      if (e.attackTimer === 10 && d < 100) {
        player.hp -= e.damage;
        player.hurtTimer = 40;
        screenShake = 5;
      }
    }
    
    e.vy += 0.8;
    e.x += e.vx;
    e.y += e.vy;
    e.z += e.vz;
    
    if (e.y >= 0) {
      e.y = 0;
      e.vy = 0;
    }
    
    if (e.hurtTimer > 0) e.hurtTimer--;
  }
  
  if (enemies.every(e => !e.alive) && !showArrow) {
    showArrow = true;
  }
  
  if (showArrow && player.x > levelLength - 500) {
    startBoss();
  }
  
  updateParticles();
}

function drawPlay() {
  draw3DScene();
  
  let entities = [];
  for (let e of enemies) {
    if (e.alive) entities.push({ type: 'enemy', obj: e, z: e.z });
  }
  entities.push({ type: 'player', obj: player, z: player.z });
  entities.sort((a, b) => a.z - b.z);
  
  for (let ent of entities) {
    if (ent.type === 'enemy') drawEnemy(ent.obj);
    else drawPlayer();
  }
  
  drawParticles();
  drawHUD();
  
  if (showArrow) {
    let pulse = sin(frameCounter * 0.1) * 10;
    fill(255, 220, 80);
    stroke(0);
    strokeWeight(3);
    let ax = W - 100 + pulse;
    triangle(ax, H/2 - 30, ax + 50, H/2, ax, H/2 + 30);
    fill(255);
    noStroke();
    textAlign(CENTER);
    textSize(20);
    text('VÁ PARA A DIREITA!', W - 180, H/2 - 50);
  }
}

function draw3DScene() {
  for (let i = 0; i < H * 0.6; i++) {
    let c = lerpColor(color(100, 160, 240), color(200, 230, 255), i / (H * 0.6));
    stroke(c);
    line(0, i, W, i);
  }
  
  fill(120, 140, 160);
  noStroke();
  beginShape();
  vertex(0, H * 0.6);
  for (let x = 0; x <= W; x += 50) {
    let worldX = x + cameraX * 0.3;
    let h = 80 + sin(worldX * 0.003) * 60 + cos(worldX * 0.007) * 40;
    vertex(x, H * 0.6 - h);
  }
  vertex(W, H * 0.6);
  endShape(CLOSE);
  
  for (let z = 200; z > -200; z -= 10) {
    let screenY = H * 0.6 + (z + 200) * 0.8;
    let brightness = map(z, 200, -200, 100, 60);
    fill(80, 160, 60);
    noStroke();
    rect(0, screenY, W, 10);
  }
  
  for (let i = 0; i < 20; i++) {
    let tx = i * 200 + 100 - cameraX;
    if (tx < -100 || tx > W + 100) continue;
    let tz = (i % 2 === 0) ? -100 : 100;
    let sc = map(tz, -200, 200, 0.5, 1.5);
    
    push();
    translate(tx, H * 0.6 + tz * 0.8);
    scale(sc);
    
    fill(80, 50, 30);
    noStroke();
    rect(-10, -80, 20, 80);
    
    fill(40, 120, 40);
    ellipse(0, -100, 100, 100);
    fill(50, 140, 50);
    ellipse(-20, -110, 60, 60);
    ellipse(20, -110, 60, 60);
    
    pop();
  }
}

// ==================== DESENHAR PLAYER COM IMAGEM ====================
function drawPlayer() {
  push();
  let screenX = player.x - cameraX;
  let screenY = H * 0.6 + player.z * 0.8 + player.y;
  let sc = map(player.z, -200, 200, 0.7, 1.3);
  
  translate(screenX, screenY);
  scale(sc * player.facing, sc);
  
  // Sombra
  noStroke();
  fill(0, 80);
  ellipse(0, 5, 50, 15);
  
  // Desenhar imagem do player
  if (playerImgs[player.charIndex]) {
    imageMode(CENTER);
    
    let walkOffset = sin(player.walkFrame) * 3;
    
    if (player.attacking) {
      rotate(-0.3);
image(playerImgs[player.charIndex], 10, -60 + walkOffset, 90, 110);
    } else {
	
image(playerImgs[player.charIndex], 0, -60 + walkOffset, 90, 110);
    }
  } else {
    // Fallback
    let legOffset = sin(player.walkFrame) * 6;
    fill(player.armor[0]*0.7, player.armor[1]*0.7, player.armor[2]*0.7);
    rect(-15, -12, 12, 24);
    rect(3, -12 + legOffset, 12, 24);
    
    fill(player.armor[0], player.armor[1], player.armor[2]);
    stroke(0);
    strokeWeight(2);
    rect(-22, -50, 44, 42, 5);
    
    fill(player.color[0], player.color[1], player.color[2]);
    noStroke();
    ellipse(0, -65, 34, 34);
    
    fill(255);
    ellipse(-6, -66, 8, 8);
    ellipse(6, -66, 8, 8);
    fill(0);
    ellipse(-5, -66, 4, 4);
    ellipse(7, -66, 4, 4);
    
    fill(player.armor[0]*0.8, player.armor[1]*0.8, player.armor[2]*0.8);
    stroke(0);
    strokeWeight(2);
    arc(0, -72, 36, 24, PI, 0);
  }
  
  if (player.hurtTimer > 0 && frameCounter % 4 < 2) {
    noFill();
    stroke(255, 50, 50, 200);
    strokeWeight(4);
    ellipse(0, -35, 70, 90);
  }
  
  pop();
}

// ==================== DESENHAR INIMIGO COM IMAGEM ====================
function drawEnemy(e) {
  push();
  let screenX = e.x - cameraX;
  let screenY = H * 0.6 + e.z * 0.8 + e.y;
  let sc = map(e.z, -200, 200, 0.7, 1.3);
  
  translate(screenX, screenY);
  scale(sc * e.facing, sc);
  
  noStroke();
  fill(0, 80);
  ellipse(0, 5, 45, 13);
  
  // Desenhar imagem do inimigo se existir
  if (enemyImg) {
    imageMode(CENTER);
    let legOffset = sin(e.walkFrame) * 3;
    
    if (e.attackTimer > 0) {
      rotate(-0.2);
	
image(enemyImg, 8, -55 + legOffset, 70, 85);
    } else {
image(enemyImg, 0, -55 + legOffset, 70, 85);
    }
  } else {
    // Fallback: desenho geométrico
    let legOffset = sin(e.walkFrame) * 5;
    fill(80, 40, 40);
    rect(-12, -10, 10, 22);
    rect(2, -10 + legOffset, 10, 22);
    
    let redness = min(255, 150 + (e.strength - 1) * 100);
    fill(redness, 50, 50);
    stroke(0);
    strokeWeight(2);
    rect(-20, -45, 40, 38, 4);
    
    fill(200, 180, 150);
    noStroke();
    ellipse(0, -58, 32, 32);
    
    fill(255, 0, 0);
    ellipse(-6, -59, 6, 6);
    ellipse(6, -59, 6, 6);
    
    if (e.attackTimer > 0) {
      push();
      translate(15, -30);
      rotate(-PI/2 + (20 - e.attackTimer) * 0.15);
      fill(180);
      stroke(0);
      strokeWeight(2);
      rect(0, -4, 45, 8);
      pop();
    }
  }
  
  // Indicador de força
  if (e.strength > 1) {
    noStroke();
    fill(255, 100, 0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text('x' + e.strength.toFixed(1), 0, -95);
  }
  
  // Barra de vida
  noStroke();
  fill(80, 0, 0);
  rect(-25, -85, 50, 6);
  fill(255, 50, 50);
  rect(-25, -85, 50 * (e.hp / e.maxHp), 6);
  
  if (e.hurtTimer > 0 && frameCounter % 3 < 2) {
    fill(255, 255, 255, 180);
    ellipse(0, -35, 50, 70);
  }
  
  pop();
}

// ==================== BOSS ====================
function startBoss() {
  bossTransition = 60;
  screenShake = 30;
  
  let hpMult = [200, 300, 450][settings.difficulty];
  boss = {
    x: levelLength - 300, y: 0, z: 0,
    hp: hpMult, maxHp: hpMult,
    alive: true,
    vx: 0, vy: 0, vz: 0,
    facing: -1,
    attackCooldown: 180,
    hurtTimer: 0,
    walkFrame: 0,
    type: 'undead_cyclops',
    entranceY: -300
  };
  
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: levelLength - 300 + random(-100, 100),
      y: -100 + random(-50, 0),
      z: 0,
      vx: random(-3, 3),
      vy: random(-5, 0),
      vz: random(-2, 2),
      life: 60,
      color: [100, 50, 50],
      size: random(5, 15)
    });
  }
  
  state = 'boss';
  showArrow = false;
}

function updateBoss() {
  if (bossTransition > 0) {
    bossTransition--;
    boss.entranceY = lerp(boss.entranceY, 0, 0.1);
    
    if (bossTransition === 30) {
      screenShake = 20;
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: boss.x + random(-80, 80),
          y: boss.y - 50,
          z: boss.z,
          vx: random(-6, 6),
          vy: random(-10, -3),
          vz: random(-3, 3),
          life: 40,
          color: [150, 100, 50],
          size: random(6, 12)
        });
      }
    }
    
    if (bossTransition <= 0) {
      boss.entranceY = 0;
    }
  }
  
  player.vx = 0;
  player.vz = 0;
  
  if (keyIsDown(LEFT_ARROW)) { player.vx = -5; player.facing = -1; }
  if (keyIsDown(RIGHT_ARROW)) { player.vx = 5; player.facing = 1; }
  if (keyIsDown(UP_ARROW)) player.vz = -3;
  if (keyIsDown(DOWN_ARROW)) player.vz = 3;
  if (keyIsDown(32) && player.grounded) {
    player.vy = -15;
    player.grounded = false;
  }
  
  player.vy += 0.8;
  player.x += player.vx;
  player.y += player.vy;
  player.z += player.vz;
  
  if (player.y >= 0) {
    player.y = 0;
    player.vy = 0;
    player.grounded = true;
  }
  
  player.x = constrain(player.x, levelLength - 800, levelLength - 100);
  player.z = constrain(player.z, -150, 150);
  
  if (abs(player.vx) > 0 || abs(player.vz) > 0) player.walkFrame += 0.2;
  if (player.attacking) {
    player.attackTimer--;
    if (player.attackTimer <= 0) player.attacking = false;
  }
  if (player.attackCooldown > 0) player.attackCooldown--;
  if (player.hurtTimer > 0) player.hurtTimer--;
  
  if (player.hp <= 0) {
    deathCount++;
    state = 'gameover';
    return;
  }
  
  cameraX = levelLength - W;
  
  if (bossTransition <= 0) {
    let dx = player.x - boss.x;
    let dz = player.z - boss.z;
    boss.facing = dx > 0 ? 1 : -1;
    
    if (abs(dx) > 250) {
      boss.vx = (dx / abs(dx)) * 1.5;
    } else {
      boss.vx = 0;
    }
    
    boss.attackCooldown--;
    if (boss.attackCooldown <= 0) {
      let angle = atan2(player.z - boss.z, player.x - boss.x);
      let count = boss.hp < boss.maxHp * 0.5 ? 5 : 3;
      for (let i = 0; i < count; i++) {
        missiles.push({
          x: boss.x, y: boss.y - 80, z: boss.z,
          vx: cos(angle + random(-0.2, 0.2)) * 7,
          vy: -2,
          vz: sin(angle + random(-0.2, 0.2)) * 7,
          life: 180
        });
      }
      boss.attackCooldown = boss.hp < boss.maxHp * 0.5 ? 60 : 90;
    }
    
    boss.vy += 0.8;
    boss.x += boss.vx;
    boss.y += boss.vy;
    
    if (boss.y >= 0) {
      boss.y = 0;
      boss.vy = 0;
    }
    
    if (boss.hurtTimer > 0) boss.hurtTimer--;
  }
  
  for (let i = missiles.length - 1; i >= 0; i--) {
    let m = missiles[i];
    let angle = atan2(player.z - m.z, player.x - m.x);
    m.vx = lerp(m.vx, cos(angle) * 6, 0.03);
    m.vz = lerp(m.vz, sin(angle) * 6, 0.03);
    m.vy += 0.1;
    
    m.x += m.vx;
    m.y += m.vy;
    m.z += m.vz;
    m.life--;
    
    let d = sqrt(pow(player.x - m.x, 2) + pow(player.z - m.z, 2) + pow(player.y - 30 - m.y, 2));
    if (d < 50) {
      let dmg = [12, 15, 20][settings.difficulty];
      player.hp -= dmg;
      player.hurtTimer = 40;
      screenShake = 8;
      missiles.splice(i, 1);
      continue;
    }
    
    if (m.life <= 0 || m.y > 100) {
      missiles.splice(i, 1);
    }
  }
  
  if (player.attacking && player.attackTimer === 19 && bossTransition <= 0) {
    let ax = player.x + player.facing * 60;
    let d = sqrt(pow(ax - boss.x, 2) + pow(player.z - boss.z, 2));
    if (d < 100 && abs(player.y - boss.y) < 100) {
      boss.hp -= player.damage;
      boss.hurtTimer = 10;
      screenShake = 10;
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: boss.x, y: boss.y - 50, z: boss.z,
          vx: random(-5, 5), vy: random(-8, -2), vz: random(-3, 3),
          life: 40, color: [255, 200, 50], size: random(4, 8)
        });
      }
    }
  }
  
  if (boss.hp <= 0) {
    boss.alive = false;
    state = 'victory';
  }
  
  updateParticles();
}

function drawBoss() {
  for (let i = 0; i < H; i++) {
    let c = lerpColor(color(60, 20, 20), color(30, 10, 10), i / H);
    stroke(c);
    line(0, i, W, i);
  }
  
  fill(70, 35, 35);
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < 6; i++) {
    rect(i * 200, 120, 50, H - 240);
    fill(90, 45, 45);
    rect(i * 200 - 5, 110, 60, 25);
    rect(i * 200 - 5, H - 130, 60, 25);
    fill(70, 35, 35);
  }
  
  fill(60, 35, 35);
  noStroke();
  rect(0, H - 120, W, 120);
  
  for (let i = 0; i < 4; i++) {
    let tx = 150 + i * 250;
    fill(90, 50, 25);
    rect(tx - 4, H - 220, 8, 50);
    fill(255, 150, 50, 200);
    noStroke();
    ellipse(tx, H - 230, 25 + sin(frameCounter * 0.3 + i) * 8, 35);
    fill(255, 220, 100);
    ellipse(tx, H - 235, 12, 18);
  }
  
  if (bossTransition > 30) {
    fill(0, map(bossTransition, 60, 30, 200, 0));
    noStroke();
    rect(0, 0, W, H);
  }
  
  if (boss.alive && bossTransition <= 30) {
    drawUndeadCyclops();
  }
  
  for (let m of missiles) {
    let screenX = m.x - cameraX;
    let screenY = H * 0.6 + m.z * 0.8 + m.y;
    fill(255, 150, 50);
    noStroke();
    ellipse(screenX, screenY, 25, 12);
    fill(255, 220, 100);
    ellipse(screenX - 10, screenY, 10, 8);
  }
  
  if (bossTransition <= 30) {
    drawPlayer();
  }
  
  drawParticles();
  
  if (bossTransition <= 30 && boss.alive) {
    fill(0, 200);
    noStroke();
    rect(W/2 - 300, 20, 600, 50);
    stroke(255, 100, 100);
    strokeWeight(3);
    noFill();
    rect(W/2 - 300, 20, 600, 50);
    
    noStroke();
    fill(80, 0, 0);
    rect(W/2 - 290, 30, 580, 30);
    fill(220, 50, 50);
    rect(W/2 - 290, 30, 580 * (boss.hp / boss.maxHp), 30);
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    noStroke();
    text('UNDEAD CYCLOPS', W/2, 15);
  }
  
  if (bossTransition <= 30) {
    drawHUD();
  }
  
  if (bossTransition > 30) {
    fill(255, 50, 50);
    textAlign(CENTER, CENTER);
    textSize(48);
    stroke(0);
    strokeWeight(4);
    text('BOSS!', W/2, H/2);
    
    fill(255, 200, 100);
    noStroke();
    textSize(24);
    text('Prepare-se!', W/2, H/2 + 50);
  }
}

function drawUndeadCyclops() {
  push();
  let screenX = boss.x - cameraX;
  let screenY = H - 120 + boss.y;
  
  let bossScale = 2.2;
  let imgW = 300 * bossScale;
  let imgH = 300 * bossScale;
  
  translate(screenX, screenY);
  scale(boss.facing, 1);
  
  noStroke();
  fill(0, 100);
  ellipse(0, 5, 120, 30);
  
  if (bossImg) {
    imageMode(CENTER);
    image(bossImg, 0, -imgH/2 + 20, imgW, imgH);
  } else {
    fill(100, 50, 50);
    stroke(0);
    strokeWeight(3);
    rect(-55, -110, 110, 95, 8);
    fill(255, 80, 0);
    ellipse(0, -130, 30, 30);
  }
  
  if (boss.hurtTimer > 0 && frameCounter % 3 < 2) {
    fill(255, 255, 255, 180);
    noStroke();
    ellipse(0, -70, 130, 160);
  }
  
  pop();
}

// ==================== GAME OVER ====================
function drawGameOver() {
  for (let i = 0; i < H; i++) {
    let c = lerpColor(color(40, 10, 10), color(20, 5, 5), i / H);
    stroke(c);
    line(0, i, W, i);
  }
  
  noStroke();
  for (let i = 0; i < 40; i++) {
    let x = (i * 97 + frameCounter * 0.5) % W;
    let y = (i * 137 + frameCounter) % H;
    fill(180, 30, 30, 100);
    ellipse(x, y, 3, 8);
  }
  
  fill(0, 150);
  textAlign(CENTER, CENTER);
  textSize(80);
  text('GAME OVER', W/2 + 4, 184);
  
  fill(220, 50, 50);
  stroke(80, 0, 0);
  strokeWeight(6);
  text('GAME OVER', W/2, 180);
  
  noStroke();
  fill(255);
  textSize(28);
  text('Você foi derrotado!', W/2, 260);
  
  fill(200);
  textSize(20);
  text('Mortes: ' + deathCount, W/2, 310);
  
  let strengthIncrease = (deathCount * 30).toFixed(0);
  fill(255, 150, 100);
  textSize(22);
  text('Inimigos estão ' + strengthIncrease + '% mais fortes!', W/2, 360);
  
  fill(180);
  textSize(16);
  text('(Cada morte aumenta o poder dos inimigos)', W/2, 395);
  
  drawMenuButton(W/2 - 200, 440, 180, 55, 'TENTAR DE NOVO', true);
  drawMenuButton(W/2 + 20, 440, 180, 55, 'MENU', false);
  
  fill(150);
  textSize(14);
  text('ENTER - Tentar de novo | ESC - Menu', W/2, 530);
}

// ==================== VITÓRIA ====================
function drawVictory() {
  for (let i = 0; i < H; i++) {
    let c = lerpColor(color(100, 80, 30), color(50, 40, 15), i / H);
    stroke(c);
    line(0, i, W, i);
  }
  
  noStroke();
  for (let i = 0; i < 60; i++) {
    let x = (i * 137 + frameCounter) % W;
    let y = (i * 73 + frameCounter * 2) % H;
    fill(255, 220, 80, 150 + sin(frameCounter * 0.1 + i) * 100);
    ellipse(x, y, 5, 5);
  }
  
  fill(0, 150);
  textAlign(CENTER, CENTER);
  textSize(72);
  text('VITÓRIA!', W/2 + 4, 154);
  
  fill(255, 220, 80);
  stroke(120, 60, 0);
  strokeWeight(5);
  text('VITÓRIA!', W/2, 150);
  
  noStroke();
  fill(255);
  textSize(28);
  text('Você derrotou o Undead Cyclops!', W/2, 250);
  
  fill(200);
  textSize(22);
  text('O reino está salvo!', W/2, 300);
  
  fill(180);
  textSize(18);
  text('Total de mortes: ' + deathCount, W/2, 340);
  
  drawMenuButton(W/2 - 150, 380, 300, 60, 'MENU PRINCIPAL', true);
  
  fill(180);
  textSize(16);
  noStroke();
  text('Pressione ENTER para voltar ao menu', W/2, 480);
}

// ==================== PARTÍCULAS ====================
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz || 0;
    p.vy += 0.4;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  noStroke();
  for (let p of particles) {
    let screenX = p.x - cameraX;
    let screenY = H * 0.6 + (p.z || 0) * 0.8 + p.y;
    fill(p.color[0], p.color[1], p.color[2], (p.life / 40) * 255);
    ellipse(screenX, screenY, p.size, p.size);
  }
}

// ==================== HUD ====================
function drawHUD() {
  fill(0, 180);
  noStroke();
  rect(20, 20, 260, 45, 5);
  stroke(255);
  strokeWeight(2);
  noFill();
  rect(20, 20, 260, 45, 5);
  
  noStroke();
  fill(80, 0, 0);
  rect(30, 35, 240, 20);
  
  let hpPct = player.hp / player.maxHp;
  let hpCol = hpPct > 0.5 ? color(80, 200, 80) : hpPct > 0.25 ? color(240, 200, 40) : color(220, 50, 50);
  fill(hpCol);
  rect(30, 35, 240 * hpPct, 20);
  
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(14);
  noStroke();
  text(characters[selectIndex].name, 30, 25);
  text('HP: ' + Math.ceil(player.hp) + '/' + Math.ceil(player.maxHp), 150, 25);
  
  if (state === 'play') {
    let alive = enemies.filter(e => e.alive).length;
    fill(255, 220, 80);
    textAlign(RIGHT, TOP);
    textSize(18);
    noStroke();
    text('Inimigos: ' + alive + '/3', W - 20, 20);
  }
}

// ==================== INPUT ====================
function keyPressed() {
  if (state === 'menu') {
    if (keyCode === UP_ARROW) menuIndex = (menuIndex - 1 + 3) % 3;
    if (keyCode === DOWN_ARROW) menuIndex = (menuIndex + 1) % 3;
    if (keyCode === ENTER) {
      if (menuIndex === 0) state = 'select';
      else if (menuIndex === 1) { state = 'settings'; settingsIndex = 0; }
      else if (menuIndex === 2) state = 'credits';
    }
  }
  else if (state === 'settings') {
    if (keyCode === UP_ARROW) settingsIndex = (settingsIndex - 1 + 4) % 4;
    if (keyCode === DOWN_ARROW) settingsIndex = (settingsIndex + 1) % 4;
    
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
      let dir = keyCode === LEFT_ARROW ? -1 : 1;
      if (settingsIndex === 0) {
        settings.difficulty = (settings.difficulty + dir + 3) % 3;
      } else if (settingsIndex === 1) {
        settings.musicVolume = constrain(settings.musicVolume + dir * 0.1, 0, 1);
      } else if (settingsIndex === 2) {
        settings.sfxVolume = constrain(settings.sfxVolume + dir * 0.1, 0, 1);
      }
    }
    
    if (keyCode === ESCAPE || (keyCode === ENTER && settingsIndex === 3)) {
      state = 'menu';
    }
  }
  else if (state === 'credits') {
    if (keyCode === ESCAPE || keyCode === ENTER) {
      state = 'menu';
    }
  }
  else if (state === 'select') {
    if (keyCode === UP_ARROW) selectIndex = (selectIndex - 1 + 6) % 6;
    if (keyCode === DOWN_ARROW) selectIndex = (selectIndex + 1) % 6;
    if (keyCode === ENTER) startGame();
    if (keyCode === ESCAPE) state = 'menu';
  }
  else if (state === 'play' || state === 'boss') {
    if (key === 'z' || key === 'Z') {
      if (!player.attacking && player.attackCooldown === 0) {
        player.attacking = true;
        player.attackTimer = 20;
        player.attackCooldown = 30;
        
        if (state === 'play') {
          let ax = player.x + player.facing * 60;
          for (let e of enemies) {
            if (!e.alive) continue;
            let d = sqrt(pow(ax - e.x, 2) + pow(player.z - e.z, 2));
            if (d < 80 && abs(player.y - e.y) < 80) {
              e.hp -= player.damage;
              e.hurtTimer = 15;
              screenShake = 8;
              for (let i = 0; i < 10; i++) {
                particles.push({
                  x: e.x, y: e.y - 30, z: e.z,
                  vx: random(-5, 5), vy: random(-8, -2), vz: random(-3, 3),
                  life: 30, color: [255, 200, 50], size: random(4, 8)
                });
              }
              if (e.hp <= 0) e.alive = false;
            }
          }
        }
      }
    }
  }
  else if (state === 'gameover') {
    if (keyCode === ENTER) {
      startLevel();
    }
    if (keyCode === ESCAPE) {
      state = 'menu';
      menuIndex = 0;
      deathCount = 0;
    }
  }
  else if (state === 'victory') {
    if (keyCode === ENTER) {
      state = 'menu';
      menuIndex = 0;
      deathCount = 0;
    }
  }
  
  return false;
}
