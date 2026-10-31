const canvas = document.querySelector("#arena");
const context = canvas.getContext("2d");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-button");
const tutorialScreen = document.querySelector("#tutorial-screen");
const tutorialProgress = document.querySelector("#tutorial-progress");
const tutorialTitle = document.querySelector("#tutorial-title");
const tutorialCopy = document.querySelector("#tutorial-copy");
const tutorialExample = document.querySelector("#tutorial-example");
const tutorialBack = document.querySelector("#tutorial-back");
const tutorialNext = document.querySelector("#tutorial-next");
const tutorialSkip = document.querySelector("#tutorial-skip");
const actionMenu = document.querySelector("#action-menu");
const battleMessage = document.querySelector("#battle-message");
const bossName = document.querySelector("#boss-name");
const bossCount = document.querySelector("#boss-count");
const bossHpBar = document.querySelector("#boss-hp-bar");
const bossHpLabel = document.querySelector("#boss-hp-label");
const playerHpBar = document.querySelector("#player-hp-bar");
const playerHpLabel = document.querySelector("#player-hp-label");
const turnLabel = document.querySelector("#turn-label");

const bosses = [
  {
    name: "Mossback the Moth",
    title: "Keeper of the Moon Garden",
    color: "#b9ed9a",
    accent: "#6d9d76",
    maxHp: 28,
    pattern: "aimed",
    act: "Compliment the wings",
    response: "Mossback's antennae perk up. A few petals drift down.",
    intro: "Mossback flutters into the moonlit garden and bows.",
    attack: "Mossback sends glowing seed-stars your way!"
  },
  {
    name: "Zip the Storm Kite",
    title: "Courier of the High Skies",
    color: "#ffcb78",
    accent: "#ef7a65",
    maxHp: 32,
    pattern: "sides",
    act: "Ask for a weather report",
    response: "Zip proudly forecasts a 100% chance of excellent company.",
    intro: "Zip loops overhead, trailing little sparks of static.",
    attack: "Zip sweeps the arena with a crackling crosswind!"
  },
  {
    name: "Lady Shard",
    title: "The Prism Duelist",
    color: "#a9eaff",
    accent: "#a487f5",
    maxHp: 36,
    pattern: "radial",
    act: "Admire the crystal armor",
    response: "Lady Shard's reflection smiles back. She seems delighted.",
    intro: "Lady Shard glides in, sparkling from every angle.",
    attack: "Lady Shard scatters a ring of prismatic sparks!"
  },
  {
    name: "The Cloud Shepherd",
    title: "Tender of the Softest Storm",
    color: "#e1caff",
    accent: "#8bb9e8",
    maxHp: 40,
    pattern: "rain",
    act: "Offer to help herd clouds",
    response: "A tiny cloud nuzzles your hand. The Shepherd relaxes.",
    intro: "The Cloud Shepherd floats in with a sleepy thunderhead.",
    attack: "The Shepherd's cloud lets loose a playful star-shower!"
  },
  {
    name: "Regent Tick-Tock",
    title: "Warden of the Last Minute",
    color: "#ffadba",
    accent: "#e2b875",
    maxHp: 44,
    pattern: "clock",
    act: "Ask what time it is",
    response: "The Regent checks twice, then gives you an extra moment.",
    intro: "Regent Tick-Tock steps from a doorway in the air.",
    attack: "The Regent winds up a volley of ticking time-stars!"
  }
];

const tutorialSteps = [
  {
    title: "A turn has two parts",
    copy: "On your turn, choose an action from the buttons below the arena. After your move, the challenger attacks.",
    example: "Pick a move → dodge the incoming stars → choose again."
  },
  {
    title: "Fight or make a friend",
    copy: "Fight deals damage. Act uses a unique friendly choice for each challenger. Act twice to make them ready to Spare.",
    example: "<strong>Fight</strong> hurts · <strong>Act</strong> builds rapport · <strong>Spare</strong> ends the fight peacefully"
  },
  {
    title: "Stay on your feet",
    copy: "Use an Item to restore up to 7 stardust (you have two). Defend slows your movement, but each hit costs less health.",
    example: "You start with <strong>20 stardust</strong> · Regular hit: 2 · Defending hit: 1"
  },
  {
    title: "Dodge the attack",
    copy: "When the arena lights up, move your star out of the way until the 6-second attack ends. You can also tap or click a spot inside the arena to move there.",
    example: "<kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> or <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>"
  }
];

const arenaBounds = { left: 178, right: 622, top: 190, bottom: 333 };
const stars = Array.from({ length: 64 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: Math.random() * 1.4 + 0.3,
  phase: Math.random() * Math.PI * 2
}));
const keys = new Set();
const state = {
  mode: "title",
  bossIndex: 0,
  bossHp: bosses[0].maxHp,
  playerHp: 20,
  maxPlayerHp: 20,
  rapport: 0,
  rapportNeeded: 2,
  potions: 2,
  tutorialStep: 0,
  player: { x: 400, y: 270 },
  bullets: [],
  elapsed: 0,
  spawnElapsed: 0,
  invulnerable: 0,
  defending: false,
  lastFrame: 0,
  message: ""
};

function currentBoss() {
  return bosses[state.bossIndex];
}

function setMessage(message) {
  state.message = message;
  battleMessage.textContent = message;
}

function updateStatus() {
  const boss = currentBoss();
  bossName.textContent = boss.name;
  bossCount.textContent = `BOSS ${Math.min(state.bossIndex + 1, bosses.length)} / ${bosses.length}`;
  bossHpLabel.textContent = `${Math.max(0, state.bossHp)} / ${boss.maxHp}`;
  bossHpBar.style.width = `${Math.max(0, state.bossHp / boss.maxHp) * 100}%`;
  playerHpLabel.textContent = `${state.playerHp} / ${state.maxPlayerHp}`;
  playerHpBar.style.width = `${Math.max(0, state.playerHp / state.maxPlayerHp) * 100}%`;
  turnLabel.textContent = state.mode === "attack" ? "DODGE!" : state.mode === "menu" ? "YOUR TURN" : "READY";
}

function addButton(label, action, options = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `action-button${options.accent ? " accent" : ""}`;
  button.textContent = label;
  button.disabled = Boolean(options.disabled);
  button.addEventListener("click", action);
  actionMenu.append(button);
}

function showMenu() {
  actionMenu.replaceChildren();
  if (state.mode === "menu") {
    addButton("Fight", fight);
    addButton("Act", act);
    addButton(`Item · ${state.potions}`, useItem, { disabled: state.potions === 0 || state.playerHp === state.maxPlayerHp });
    addButton("Defend", defend);
    addButton("Spare", spare, {
      accent: true,
      disabled: state.rapport < state.rapportNeeded
    });
  } else if (state.mode === "attack") {
    addButton("Dodge the stars!", () => {}, { disabled: true });
  } else if (state.mode === "victory") {
    addButton(state.bossIndex < bosses.length - 1 ? "Next challenger" : "Claim your crown", continueAfterVictory, { accent: true });
  } else if (state.mode === "gameover") {
    addButton("Try again", restart, { accent: true });
  } else if (state.mode === "clear") {
    addButton("Play again", restart, { accent: true });
  } else {
    actionMenu.replaceChildren();
  }
}

function renderTutorialStep() {
  const step = tutorialSteps[state.tutorialStep];
  tutorialProgress.textContent = `${state.tutorialStep + 1} / ${tutorialSteps.length}`;
  tutorialTitle.textContent = step.title;
  tutorialCopy.textContent = step.copy;
  tutorialExample.innerHTML = step.example;
  tutorialBack.disabled = state.tutorialStep === 0;
  tutorialNext.textContent = state.tutorialStep === tutorialSteps.length - 1 ? "Begin boss rush" : "Next";
}

function openTutorial() {
  startScreen.hidden = true;
  tutorialScreen.hidden = false;
  state.tutorialStep = 0;
  renderTutorialStep();
}

function moveTutorial(direction) {
  const nextStep = state.tutorialStep + direction;
  if (nextStep < 0 || nextStep >= tutorialSteps.length) return;
  state.tutorialStep = nextStep;
  renderTutorialStep();
}

function beginBattle() {
  state.mode = "menu";
  state.bossHp = currentBoss().maxHp;
  state.rapport = 0;
  state.rapportNeeded = 2;
  state.bullets = [];
  state.player.x = 400;
  state.player.y = 270;
  startScreen.hidden = true;
  tutorialScreen.hidden = true;
  setMessage(currentBoss().intro);
  showMenu();
  updateStatus();
}

function fight() {
  const damage = 6 + Math.floor(Math.random() * 5);
  state.bossHp = Math.max(0, state.bossHp - damage);
  if (state.bossHp === 0) {
    state.mode = "victory";
    setMessage(`${currentBoss().name} applauds your skill and yields the arena.`);
    showMenu();
    updateStatus();
    return;
  }
  startAttack(`You land a ${damage}-damage hit! ${currentBoss().attack}`);
}

function act() {
  state.rapport = Math.min(state.rapportNeeded, state.rapport + 1);
  const response = currentBoss().response;
  const ready = state.rapport >= state.rapportNeeded ? " The challenger is ready to be spared!" : "";
  startAttack(`${response}${ready} ${currentBoss().attack}`);
}

function useItem() {
  if (state.potions <= 0 || state.playerHp === state.maxPlayerHp) return;
  const healing = Math.min(7, state.maxPlayerHp - state.playerHp);
  state.playerHp += healing;
  state.potions -= 1;
  startAttack(`You use a starfruit and recover ${healing} stardust. ${currentBoss().attack}`);
}

function defend() {
  state.defending = true;
  startAttack(`You steady your breathing and brace for the next attack. ${currentBoss().attack}`);
}

function spare() {
  if (state.rapport < state.rapportNeeded) return;
  state.mode = "victory";
  setMessage(`${currentBoss().name} accepts your kindness and leaves the arena smiling.`);
  showMenu();
  updateStatus();
}

function startAttack(message) {
  state.mode = "attack";
  state.elapsed = 0;
  state.spawnElapsed = 0;
  state.invulnerable = 0;
  state.bullets = [];
  setMessage(message);
  showMenu();
  updateStatus();
}

function finishAttack() {
  state.bullets = [];
  state.defending = false;
  if (state.playerHp <= 0) {
    state.playerHp = 0;
    state.mode = "gameover";
    setMessage("Your stardust fades, but the arena will be here when you're ready.");
  } else {
    state.mode = "menu";
    setMessage("You made it through! Choose your next move.");
  }
  showMenu();
  updateStatus();
}

function continueAfterVictory() {
  if (state.bossIndex === bosses.length - 1) {
    state.mode = "clear";
    setMessage("Every challenger has been met with courage. The Astral Arena is yours!");
    showMenu();
    updateStatus();
    return;
  }
  state.bossIndex += 1;
  state.bossHp = currentBoss().maxHp;
  state.rapport = 0;
  state.player.x = 400;
  state.player.y = 270;
  state.mode = "menu";
  setMessage(currentBoss().intro);
  showMenu();
  updateStatus();
}

function restart() {
  state.mode = "title";
  state.bossIndex = 0;
  state.bossHp = bosses[0].maxHp;
  state.playerHp = state.maxPlayerHp;
  state.rapport = 0;
  state.potions = 2;
  state.bullets = [];
  state.defending = false;
  state.player.x = 400;
  state.player.y = 270;
  startScreen.hidden = false;
  tutorialScreen.hidden = true;
  setMessage("Step into the arena to meet your first challenger.");
  showMenu();
  updateStatus();
  draw();
}

function drawBackground(time) {
  context.fillStyle = "#090b16";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    const glow = 0.35 + (Math.sin(time / 900 + star.phase) + 1) * 0.25;
    context.globalAlpha = glow;
    context.fillStyle = "#c8c0ff";
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
  const gradient = context.createRadialGradient(400, 125, 5, 400, 125, 280);
  gradient.addColorStop(0, "rgba(87, 67, 150, 0.18)");
  gradient.addColorStop(1, "rgba(9, 11, 22, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBoss(time) {
  const boss = currentBoss();
  const bob = Math.sin(time / 400) * 4;
  const y = 105 + bob;
  context.save();
  context.translate(400, y);
  context.shadowColor = boss.color;
  context.shadowBlur = 18;
  context.fillStyle = boss.accent;
  context.strokeStyle = boss.color;
  context.lineWidth = 3;

  if (state.bossIndex === 0) {
    for (const side of [-1, 1]) {
      context.save();
      context.scale(side, 1);
      context.beginPath();
      context.ellipse(34, -3, 25, 38, -0.5, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.restore();
    }
    context.fillStyle = boss.color;
    context.beginPath();
    context.ellipse(0, 0, 20, 27, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#283344";
    context.fillRect(-2, -48, 3, 18);
    context.fillRect(7, -47, 3, 17);
  } else if (state.bossIndex === 1) {
    context.rotate(Math.sin(time / 350) * 0.08);
    context.beginPath();
    context.moveTo(0, -42);
    context.lineTo(32, 19);
    context.lineTo(0, 39);
    context.lineTo(-32, 19);
    context.closePath();
    context.fill();
    context.stroke();
    context.beginPath();
    context.moveTo(-23, 16);
    context.lineTo(0, -17);
    context.lineTo(23, 16);
    context.stroke();
    context.fillStyle = "#fff3c0";
    context.beginPath();
    context.arc(-7, 0, 3, 0, Math.PI * 2);
    context.arc(7, 0, 3, 0, Math.PI * 2);
    context.fill();
  } else if (state.bossIndex === 2) {
    context.rotate(time / 1800);
    for (let i = 0; i < 8; i += 1) {
      context.rotate(Math.PI / 4);
      context.beginPath();
      context.moveTo(0, -40);
      context.lineTo(10, -10);
      context.lineTo(0, 8);
      context.lineTo(-10, -10);
      context.closePath();
      context.fill();
      context.stroke();
    }
    context.fillStyle = "#f4f8ff";
    context.beginPath();
    context.arc(0, 0, 18, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#20233b";
    context.fillRect(-9, -3, 5, 4);
    context.fillRect(4, -3, 5, 4);
  } else if (state.bossIndex === 3) {
    context.beginPath();
    context.arc(-22, 8, 24, 0, Math.PI * 2);
    context.arc(0, -9, 31, 0, Math.PI * 2);
    context.arc(23, 8, 24, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = "#4c526b";
    context.beginPath();
    context.arc(-9, -10, 3, 0, Math.PI * 2);
    context.arc(9, -10, 3, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#4c526b";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(0, 1, 9, 0.2, Math.PI - 0.2);
    context.stroke();
  } else {
    context.rotate(Math.sin(time / 600) * 0.05);
    context.beginPath();
    context.roundRect(-29, -39, 58, 78, 13);
    context.fill();
    context.stroke();
    context.fillStyle = "#262238";
    context.beginPath();
    context.arc(0, -2, 20, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = boss.color;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, -2, 13, -Math.PI / 2, Math.PI * 1.2);
    context.stroke();
    context.fillStyle = "#fff1bd";
    context.beginPath();
    context.arc(0, -2, 3, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
  context.shadowBlur = 0;
  context.fillStyle = "#eeebfa";
  context.font = "600 15px 'Space Grotesk', sans-serif";
  context.textAlign = "center";
  context.fillText(boss.title, 400, 165);
}

function drawArena() {
  context.save();
  context.strokeStyle = state.mode === "attack" ? "#a393ff" : "#55516c";
  context.lineWidth = 2;
  context.shadowColor = "#8f7cf4";
  context.shadowBlur = state.mode === "attack" ? 14 : 0;
  context.strokeRect(arenaBounds.left, arenaBounds.top, arenaBounds.right - arenaBounds.left, arenaBounds.bottom - arenaBounds.top);
  context.restore();

  if (state.mode === "attack") {
    for (const bullet of state.bullets) {
      context.save();
      context.shadowColor = bullet.color;
      context.shadowBlur = 12;
      context.fillStyle = bullet.color;
      context.beginPath();
      context.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
    if (state.invulnerable <= 0 || Math.floor(state.elapsed / 80) % 2 === 0) {
      context.save();
      context.shadowColor = "#ff88b7";
      context.shadowBlur = 18;
      context.fillStyle = "#ff8fb7";
      context.translate(state.player.x, state.player.y);
      context.rotate(Math.PI / 4);
      context.fillRect(-8, -8, 16, 16);
      context.restore();
    }
    context.fillStyle = "#c8c2db";
    context.font = "12px 'DM Mono', monospace";
    context.textAlign = "center";
    context.fillText(`${Math.max(0, Math.ceil((6500 - state.elapsed) / 1000))}s`, 400, 352);
  } else {
    context.save();
    context.globalAlpha = 0.75;
    context.fillStyle = "#c8baff";
    context.shadowColor = "#9c8bff";
    context.shadowBlur = 16;
    context.beginPath();
    context.arc(400, 262, 7, 0, Math.PI * 2);
    context.fill();
    context.restore();
    context.fillStyle = "#807d96";
    context.font = "11px 'DM Mono', monospace";
    context.textAlign = "center";
    context.fillText("YOUR STAR", 400, 294);
  }
}

function draw() {
  const time = performance.now();
  drawBackground(time);
  drawBoss(time);
  drawArena();
}

function spawnBullet(x, y, angle, speed, radius = 6) {
  state.bullets.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius,
    color: currentBoss().color
  });
}

function aimAtPlayer(x, y, angleOffset = 0) {
  const angle = Math.atan2(state.player.y - y, state.player.x - x) + angleOffset;
  spawnBullet(x, y, angle, 150);
}

function spawnPattern() {
  const pattern = currentBoss().pattern;
  if (pattern === "aimed") {
    aimAtPlayer(400, 151);
    if (Math.floor(state.elapsed / 1300) % 2 === 1) {
      aimAtPlayer(400, 151, -0.22);
      aimAtPlayer(400, 151, 0.22);
    }
  } else if (pattern === "sides") {
    const fromLeft = Math.floor(state.elapsed / 850) % 2 === 0;
    const x = fromLeft ? arenaBounds.left - 4 : arenaBounds.right + 4;
    const direction = fromLeft ? 0 : Math.PI;
    for (const offset of [-0.28, 0, 0.28]) {
      spawnBullet(x, 260, direction + offset, 155);
    }
  } else if (pattern === "radial") {
    const rotation = (state.elapsed / 950) * 0.45;
    for (let i = 0; i < 8; i += 1) {
      spawnBullet(400, 152, rotation + (Math.PI * 2 * i) / 8, 125, 5);
    }
  } else if (pattern === "rain") {
    const x = arenaBounds.left + 12 + Math.random() * (arenaBounds.right - arenaBounds.left - 24);
    spawnBullet(x, arenaBounds.top - 4, Math.PI / 2 + (Math.random() - 0.5) * 0.35, 155, 5);
  } else {
    aimAtPlayer(400, 151, -0.18);
    aimAtPlayer(400, 151, 0.18);
  }
}

function movePlayer(delta) {
  const speed = state.defending ? 188 : 235;
  let dx = 0;
  let dy = 0;
  if (keys.has("ArrowLeft") || keys.has("a")) dx -= 1;
  if (keys.has("ArrowRight") || keys.has("d")) dx += 1;
  if (keys.has("ArrowUp") || keys.has("w")) dy -= 1;
  if (keys.has("ArrowDown") || keys.has("s")) dy += 1;
  if (dx !== 0 || dy !== 0) {
    const length = Math.hypot(dx, dy);
    state.player.x += (dx / length) * speed * delta;
    state.player.y += (dy / length) * speed * delta;
  }
  state.player.x = Math.max(arenaBounds.left + 12, Math.min(arenaBounds.right - 12, state.player.x));
  state.player.y = Math.max(arenaBounds.top + 12, Math.min(arenaBounds.bottom - 12, state.player.y));
}

function updateAttack(delta) {
  state.elapsed += delta * 1000;
  state.spawnElapsed += delta * 1000;
  state.invulnerable = Math.max(0, state.invulnerable - delta * 1000);
  movePlayer(delta);

  const spawnDelay = currentBoss().pattern === "rain" ? 180 : currentBoss().pattern === "radial" ? 950 : 650;
  if (state.spawnElapsed >= spawnDelay) {
    spawnPattern();
    state.spawnElapsed = 0;
  }

  for (let i = state.bullets.length - 1; i >= 0; i -= 1) {
    const bullet = state.bullets[i];
    bullet.x += bullet.vx * delta;
    bullet.y += bullet.vy * delta;
    if (bullet.x < -bullet.radius || bullet.x > canvas.width + bullet.radius ||
        bullet.y < -bullet.radius || bullet.y > canvas.height + bullet.radius) {
      state.bullets.splice(i, 1);
      continue;
    }
    const distance = Math.hypot(bullet.x - state.player.x, bullet.y - state.player.y);
    if (distance < bullet.radius + 9 && state.invulnerable <= 0) {
      state.playerHp = Math.max(0, state.playerHp - (state.defending ? 1 : 2));
      state.invulnerable = 780;
      updateStatus();
    }
  }

  if (state.elapsed >= 6500) finishAttack();
}

function frame(time) {
  const delta = state.lastFrame ? Math.min((time - state.lastFrame) / 1000, 0.05) : 0;
  state.lastFrame = time;
  if (state.mode === "attack") updateAttack(delta);
  draw();
  requestAnimationFrame(frame);
}

document.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) event.preventDefault();
  keys.add(key);
});

document.addEventListener("keyup", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  keys.delete(key);
});

canvas.addEventListener("pointerdown", (event) => {
  if (state.mode !== "attack") return;
  const rect = canvas.getBoundingClientRect();
  state.player.x = arenaBounds.left + ((event.clientX - rect.left) / rect.width) * canvas.width;
  state.player.y = arenaBounds.top + ((event.clientY - rect.top) / rect.height) * canvas.height;
  state.player.x = Math.max(arenaBounds.left + 12, Math.min(arenaBounds.right - 12, state.player.x));
  state.player.y = Math.max(arenaBounds.top + 12, Math.min(arenaBounds.bottom - 12, state.player.y));
});

startButton.addEventListener("click", openTutorial);
tutorialBack.addEventListener("click", () => moveTutorial(-1));
tutorialNext.addEventListener("click", () => {
  if (state.tutorialStep === tutorialSteps.length - 1) {
    beginBattle();
  } else {
    moveTutorial(1);
  }
});
tutorialSkip.addEventListener("click", beginBattle);
showMenu();
updateStatus();
requestAnimationFrame(frame);