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
    maxHp: 34,
    pattern: "aimed",
    act: "Compliment the wings",
    response: "Mossback's antennae perk up. A few petals drift down.",
    intro: "Mossback flutters into the moonlit garden. \"Easy now, little spark. The garden bites back.\"",
    attack: "Mossback scatters seed-stars across the garden!"
  },
  {
    name: "Zip the Storm Kite",
    title: "Courier of the High Skies",
    color: "#ffcb78",
    accent: "#ef7a65",
    maxHp: 40,
    pattern: "sides",
    act: "Ask for a weather report",
    response: "Zip proudly forecasts a 100% chance of excellent company.",
    intro: "Zip loops overhead. \"Last one to the clouds is a sleepy snail!\"",
    attack: "Zip dives in with a crackling crosswind!"
  },
  {
    name: "Lady Shard",
    title: "The Prism Duelist",
    color: "#a9eaff",
    accent: "#a487f5",
    maxHp: 46,
    pattern: "radial",
    act: "Admire the crystal armor",
    response: "Lady Shard's reflection smiles back. She seems delighted.",
    intro: "Lady Shard glides in. \"Do keep your eyes open. I do.\"",
    attack: "Lady Shard turns the arena into a wheel of prismatic sparks!"
  },
  {
    name: "The Cloud Shepherd",
    title: "Tender of the Softest Storm",
    color: "#e1caff",
    accent: "#8bb9e8",
    maxHp: 52,
    pattern: "rain",
    act: "Offer to help herd clouds",
    response: "A tiny cloud nuzzles your hand. The Shepherd relaxes.",
    intro: "The Cloud Shepherd floats in. \"Shh. The thunderheads are trying to nap.\"",
    attack: "A grumpy little cloud starts a sudden star-shower!"
  },
  {
    name: "Regent Tick-Tock",
    title: "Warden of the Last Minute",
    color: "#ffadba",
    accent: "#e2b875",
    maxHp: 58,
    pattern: "clock",
    act: "Ask what time it is",
    response: "The Regent checks twice, then gives you an extra moment.",
    intro: "Regent Tick-Tock steps from a doorway in the air. \"You are precisely on time. For trouble.\"",
    attack: "Tick-tock! The Regent winds up a volley of time-stars!"
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
    copy: "Strike deals damage. Talk uses a unique friendly choice for each challenger. Talk twice to make them ready to Spare.",
    example: "<strong>Strike</strong> hurts · <strong>Talk</strong> builds rapport · <strong>Spare</strong> ends the fight peacefully"
  },
  {
    title: "Stay on your feet",
    copy: "Use your one Starfruit from the Pack to restore up to 7 stardust. Brace slows your movement, but each hit costs less health.",
    example: "You start with <strong>16 stardust</strong> · Regular hit: 2 · Defending hit: 1"
  },
  {
    title: "Dodge the attack",
    copy: "When the arena lights up, move your star out of the way until the 8-second attack ends. Later challengers fire faster, denser patterns, and each gets more dangerous at half health. You can also tap or click inside the arena to move.",
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
  playerHp: 16,
  maxPlayerHp: 16,
  rapport: 0,
  rapportNeeded: 2,
  potions: 1,
  tutorialStep: 0,
  player: { x: 400, y: 270 },
  bullets: [],
  elapsed: 0,
  spawnElapsed: 0,
  invulnerable: 0,
  strikeElapsed: 0,
  strikeDamage: 0,
  strikeMessage: "",
  defending: false,
  phase: false,
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
  const heat = (1 + state.bossIndex * 0.14).toFixed(2);
  const phaseLabel = state.phase ? " · PHASE II" : "";
  bossCount.textContent = `BOSS ${Math.min(state.bossIndex + 1, bosses.length)} / ${bosses.length} · ${heat}x${phaseLabel}`;
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
    addButton("Strike", fight);
    addButton("Talk", act);
    addButton(`Pack · ${state.potions}`, useItem, { disabled: state.potions === 0 || state.playerHp === state.maxPlayerHp });
    addButton("Brace", defend);
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
  state.phase = false;
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
  const damage = 5 + Math.floor(Math.random() * 5);
  state.bossHp = Math.max(0, state.bossHp - damage);
  state.mode = "strike";
  state.strikeElapsed = 0;
  state.strikeDamage = damage;
  state.strikeMessage = `You land a ${damage}-damage hit!`;
  setMessage(state.strikeMessage);
  showMenu();
  updateStatus();
}

function act() {
  state.rapport = Math.min(state.rapportNeeded, state.rapport + 1);
  const response = currentBoss().response;
  const ready = state.rapport >= state.rapportNeeded ? " The challenger is ready to be spared!" : "";
  startAttack(`${currentBoss().act}: ${response}${ready} ${currentBoss().attack}`);
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
  const enteringPhase = !state.phase && state.bossHp <= Math.ceil(currentBoss().maxHp / 2);
  if (enteringPhase) state.phase = true;
  state.mode = "attack";
  state.elapsed = 0;
  state.spawnElapsed = 0;
  state.invulnerable = 0;
  state.bullets = [];
  setMessage(enteringPhase ? `${currentBoss().name} changes tactics! ${message}` : message);
  showMenu();
  updateStatus();
}

function finishStrike() {
  if (state.bossHp === 0) {
    state.mode = "victory";
    setMessage(`${currentBoss().name} applauds your skill and yields the arena.`);
    showMenu();
    updateStatus();
    return;
  }
  startAttack(`${state.strikeMessage} ${currentBoss().attack}`);
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
  state.phase = false;
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
  state.phase = false;
  state.potions = 1;
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
  context.fillStyle = "#080808";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    const glow = 0.35 + (Math.sin(time / 900 + star.phase) + 1) * 0.25;
    context.globalAlpha = glow;
    context.fillStyle = "#aaa394";
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
  const hit = state.mode === "strike" && state.strikeElapsed < 260;
  const hitShake = hit ? Math.sin(state.strikeElapsed * 0.11) * (1 - state.strikeElapsed / 260) * 9 : 0;
  const attackWindup = state.mode === "attack" && state.elapsed < 420;
  const attackPulse = attackWindup ? Math.sin((state.elapsed / 420) * Math.PI) : 0;
  const bob = Math.sin(time / (430 + state.bossIndex * 35)) * (4 + state.bossIndex);
  const y = 105 + bob;
  context.save();
  context.translate(400 + hitShake, y - attackPulse * 8);
  context.rotate(Math.sin(time / 850 + state.bossIndex) * 0.045 + (hit ? Math.sin(state.strikeElapsed * 0.08) * 0.12 : 0));
  context.scale(1 + attackPulse * 0.09, 1 - attackPulse * 0.05);
  context.shadowColor = boss.color;
  context.shadowBlur = hit ? 30 : 18;
  context.fillStyle = hit ? "#fff4d1" : boss.accent;
  context.strokeStyle = hit ? "#ffffff" : boss.color;
  context.lineWidth = 3;

  if (state.bossIndex === 0) {
    for (const side of [-1, 1]) {
      context.save();
      context.scale(side, 1);
      context.beginPath();
      context.ellipse(34, -3, 25, 38, -0.5, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.fillStyle = boss.color;
      context.beginPath();
      context.ellipse(34, -11, 10, 15, -0.5, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
    context.fillStyle = boss.color;
    context.beginPath();
    context.ellipse(0, 0, 20, 27, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = boss.color;
    context.beginPath();
    context.moveTo(-7, -22);
    context.quadraticCurveTo(-22, -52, -29, -39);
    context.moveTo(7, -22);
    context.quadraticCurveTo(22, -52, 29, -39);
    context.stroke();
    context.fillStyle = "#20261b";
    context.fillRect(-8, -5, 3, 5);
    context.fillRect(5, -5, 3, 5);
    context.fillRect(-3, 9, 6, 2);
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
    context.fillStyle = boss.color;
    context.beginPath();
    context.moveTo(0, 39);
    context.lineTo(9, 57);
    context.lineTo(-2, 53);
    context.lineTo(-10, 61);
    context.closePath();
    context.fill();
    context.fillStyle = "#34251c";
    context.fillRect(-2, 11, 4, 2);
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
    context.fillStyle = boss.color;
    context.fillRect(-4, 7, 8, 2);
    context.strokeStyle = boss.color;
    context.beginPath();
    context.moveTo(-20, -29);
    context.lineTo(-26, -48);
    context.lineTo(-8, -37);
    context.moveTo(20, -29);
    context.lineTo(26, -48);
    context.lineTo(8, -37);
    context.stroke();
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
    context.fillStyle = "#d9eff5";
    context.beginPath();
    context.arc(-28, 29, 4, 0, Math.PI * 2);
    context.arc(26, 28, 3, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = boss.color;
    context.beginPath();
    context.moveTo(-18, -28);
    context.lineTo(-26, -39);
    context.moveTo(18, -28);
    context.lineTo(26, -39);
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
    context.strokeStyle = boss.color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -39);
    context.lineTo(0, -29);
    context.moveTo(29, -2);
    context.lineTo(19, -2);
    context.moveTo(0, 27);
    context.lineTo(0, 17);
    context.moveTo(-29, -2);
    context.lineTo(-19, -2);
    context.stroke();
  }

  context.restore();
  context.shadowBlur = 0;
  context.fillStyle = "#fff4d1";
  context.font = "bold 15px monospace";
  context.textAlign = "center";
  context.fillText(boss.title, 400, 165);
}

function drawArena() {
  context.save();
  context.strokeStyle = state.mode === "attack" ? "#ffd866" : "#d5d0c3";
  context.lineWidth = 3;
  context.shadowColor = "#ffd866";
  context.shadowBlur = state.mode === "attack" ? 7 : 0;
  context.strokeRect(arenaBounds.left, arenaBounds.top, arenaBounds.right - arenaBounds.left, arenaBounds.bottom - arenaBounds.top);
  context.restore();

  if (state.mode === "attack") {
    for (const bullet of state.bullets) {
      context.save();
      context.shadowColor = bullet.color;
      context.shadowBlur = 5;
      context.fillStyle = bullet.color;
      context.beginPath();
      if (bullet.pattern === "clock" || bullet.pattern === "sides") {
        context.rect(bullet.x - bullet.radius, bullet.y - bullet.radius, bullet.radius * 2, bullet.radius * 2);
      } else if (bullet.pattern === "radial") {
        context.moveTo(bullet.x, bullet.y - bullet.radius * 1.5);
        context.lineTo(bullet.x + bullet.radius, bullet.y);
        context.lineTo(bullet.x, bullet.y + bullet.radius * 1.5);
        context.lineTo(bullet.x - bullet.radius, bullet.y);
        context.closePath();
      } else if (state.mode === "strike") {
        const progress = Math.min(1, state.strikeElapsed / 620);
        const slashX = 284 + progress * 232;
        const slashY = 101 + Math.sin(progress * Math.PI) * 16;
        context.save();
        context.globalAlpha = Math.sin(progress * Math.PI) * 0.95;
        context.strokeStyle = "#fff4d1";
        context.shadowColor = currentBoss().color;
        context.shadowBlur = 22;
        context.lineWidth = 9;
        context.beginPath();
        context.moveTo(slashX - 40, slashY + 27);
        context.lineTo(slashX + 40, slashY - 27);
        context.stroke();
        context.lineWidth = 3;
        context.strokeStyle = currentBoss().color;
        context.beginPath();
        context.moveTo(slashX - 28, slashY + 31);
        context.lineTo(slashX + 45, slashY - 17);
        context.stroke();
        context.globalAlpha = Math.sin(progress * Math.PI);
        context.fillStyle = "#fff4d1";
        for (let i = 0; i < 5; i += 1) {
          const angle = (Math.PI * 2 * i) / 5 + progress * 2;
          context.beginPath();
          context.arc(slashX + Math.cos(angle) * 30, slashY + Math.sin(angle) * 20, 2.5, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();

        const playerY = 262 - Math.sin(progress * Math.PI) * 64;
        context.save();
        context.fillStyle = "#ff6d82";
        context.shadowColor = "#ff6d82";
        context.shadowBlur = 14;
        context.translate(400, playerY);
        context.rotate(Math.PI / 4);
        context.fillRect(-7, -7, 14, 14);
        context.restore();
      } else {
        context.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      }
      context.fill();
      context.restore();
    }
    if (state.invulnerable <= 0 || Math.floor(state.elapsed / 80) % 2 === 0) {
      context.save();
      context.shadowColor = "#ff6d82";
      context.shadowBlur = 8;
      context.fillStyle = "#ff6d82";
      context.translate(state.player.x, state.player.y);
      context.rotate(Math.PI / 4);
      context.fillRect(-8, -8, 16, 16);
      context.restore();
    }
    context.fillStyle = "#c8c2db";
    context.font = "bold 12px monospace";
    context.textAlign = "center";
    context.fillText(`${Math.max(0, Math.ceil((8000 - state.elapsed) / 1000))}s`, 400, 352);
  } else {
    context.save();
    context.globalAlpha = 0.75;
    context.fillStyle = "#ffd866";
    context.shadowColor = "#ffd866";
    context.shadowBlur = 8;
    context.beginPath();
    context.arc(400, 262, 7, 0, Math.PI * 2);
    context.fill();
    context.restore();
    context.fillStyle = "#aaa394";
    context.font = "bold 11px monospace";
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
  const difficulty = 1 + state.bossIndex * 0.16 + (state.phase ? 0.12 : 0);
  state.bullets.push({
    x,
    y,
    vx: Math.cos(angle) * speed * difficulty,
    vy: Math.sin(angle) * speed * difficulty,
    radius,
    color: currentBoss().color,
    pattern: currentBoss().pattern
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
    if (state.phase || (state.bossIndex >= 1 && Math.floor(state.elapsed / 1200) % 2 === 1)) {
      const spread = state.phase ? 0.56 : 0.28;
      aimAtPlayer(400, 151, -spread);
      aimAtPlayer(400, 151, spread);
      if (state.phase) {
        aimAtPlayer(400, 151, -spread * 0.5);
        aimAtPlayer(400, 151, spread * 0.5);
      }
    }
  } else if (pattern === "sides") {
    const fromLeft = Math.floor(state.elapsed / 850) % 2 === 0;
    const x = fromLeft ? arenaBounds.left - 4 : arenaBounds.right + 4;
    const direction = fromLeft ? 0 : Math.PI;
    const offsets = state.phase || state.bossIndex >= 3
      ? [-0.5, -0.25, 0, 0.25, 0.5]
      : [-0.28, 0, 0.28];
    for (const offset of offsets) {
      spawnBullet(x, 260, direction + offset, 155);
    }
  } else if (pattern === "radial") {
    const rotation = (state.elapsed / 950) * 0.45;
    const count = 8 + state.bossIndex + (state.phase ? 2 : 0);
    for (let i = 0; i < count; i += 1) {
      spawnBullet(400, 152, rotation + (Math.PI * 2 * i) / count, 125, 5);
    }
  } else if (pattern === "rain") {
    const count = state.phase ? 3 : state.bossIndex >= 3 ? 2 : 1;
    for (let i = 0; i < count; i += 1) {
      const x = arenaBounds.left + 12 + Math.random() * (arenaBounds.right - arenaBounds.left - 24);
      spawnBullet(x, arenaBounds.top - 4, Math.PI / 2 + (Math.random() - 0.5) * 0.35, 155, 5);
    }
  } else {
    const spread = state.phase ? 0.36 : 0.22;
    aimAtPlayer(400, 151, -spread);
    aimAtPlayer(400, 151);
    aimAtPlayer(400, 151, spread);
    if (state.phase) {
      aimAtPlayer(400, 151, -0.12);
      aimAtPlayer(400, 151, 0.12);
    }
  }
}

function movePlayer(delta) {
  const speed = state.defending ? 178 : 235;
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

  const baseSpawnDelay = {
    aimed: 610,
    sides: 730,
    radial: 1000,
    rain: 245,
    clock: 570
  }[currentBoss().pattern];
  const adjustedBaseDelay = currentBoss().pattern === "rain" ? 420 : baseSpawnDelay;
  const spawnDelay = adjustedBaseDelay * (1 - state.bossIndex * 0.06) * (state.phase ? 0.86 : 1);
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
      state.invulnerable = 500;
      updateStatus();
    }
  }

  if (state.elapsed >= 8000) finishAttack();
}

function updateStrike(delta) {
  state.strikeElapsed += delta * 1000;
  if (state.strikeElapsed >= 620) finishStrike();
}

function frame(time) {
  const delta = state.lastFrame ? Math.min((time - state.lastFrame) / 1000, 0.05) : 0;
  state.lastFrame = time;
  if (state.mode === "attack") updateAttack(delta);
  if (state.mode === "strike") updateStrike(delta);
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