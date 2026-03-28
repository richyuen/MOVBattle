const TICK_RATE = 1000 / 30;
const DEFAULT_TEAM_BUDGET = 1200;
const ARENA = { width: 960, height: 540 };
const TEAM_BOUNDS = {
  red: { minX: 20, maxX: ARENA.width * 0.46 },
  blue: { minX: ARENA.width * 0.54, maxX: ARENA.width - 20 },
};

const ROSTER = [
  { id: 'clubber', name: 'Clubber', hp: 110, speed: 1.9, damage: 8, range: 18, cooldown: 900, radius: 8, cost: 60 },
  { id: 'spear', name: 'Spear', hp: 80, speed: 2.15, damage: 14, range: 34, cooldown: 1200, radius: 7, cost: 90 },
  { id: 'shield', name: 'Shield', hp: 170, speed: 1.45, damage: 7, range: 17, cooldown: 750, radius: 9, cost: 120 },
  { id: 'archer', name: 'Archer', hp: 65, speed: 1.55, damage: 18, range: 135, cooldown: 1450, radius: 6, cost: 140 },
  { id: 'brute', name: 'Brute', hp: 260, speed: 1.25, damage: 21, range: 20, cooldown: 1000, radius: 11, cost: 260 },
];

const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');
const activeTeamSelect = document.getElementById('activeTeam');
const budgetInput = document.getElementById('teamBudget');
const unitTypeSelect = document.getElementById('unitType');
const tapActionSelect = document.getElementById('tapAction');
const speedMultiplierSelect = document.getElementById('speedMultiplier');
const randomFillBtn = document.getElementById('randomFillBtn');
const mirrorBtn = document.getElementById('mirrorBtn');
const formationSlotInput = document.getElementById('formationSlot');
const saveFormationBtn = document.getElementById('saveFormationBtn');
const loadFormationBtn = document.getElementById('loadFormationBtn');
const clearTeamBtn = document.getElementById('clearTeamBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const statusNode = document.getElementById('status');
const teamStatsNode = document.getElementById('teamStats');
const rosterList = document.getElementById('rosterList');

const baseState = {
  units: [],
  isRunning: false,
  isPaused: false,
  winner: null,
  nextId: 1,
  teamBudget: DEFAULT_TEAM_BUDGET,
};

let state = structuredClone(baseState);
let timer = null;

function configureRosterUi() {
  for (const unit of ROSTER) {
    const option = document.createElement('option');
    option.value = unit.id;
    option.textContent = `${unit.name} (${unit.cost})`;
    unitTypeSelect.append(option);

    const item = document.createElement('li');
    item.textContent = `${unit.name}: HP ${unit.hp}, DMG ${unit.damage}, Range ${unit.range}`;
    rosterList.append(item);
  }
}

function setStatus(message, kind = 'muted') {
  statusNode.textContent = message;
  statusNode.style.color = kind === 'danger' ? 'var(--danger)' : kind === 'good' ? 'var(--accent-2)' : 'var(--muted)';
}

function getUnitTemplate(id) {
  return ROSTER.find((u) => u.id === id);
}

function getTeamSpent(team) {
  return state.units
    .filter((u) => u.team === team)
    .reduce((sum, unit) => {
      const t = getUnitTemplate(unit.typeId);
      return sum + (t?.cost ?? 0);
    }, 0);
}

function updateTeamStats() {
  const redSpent = getTeamSpent('red');
  const blueSpent = getTeamSpent('blue');
  teamStatsNode.textContent = `Red: ${redSpent}/${state.teamBudget} | Blue: ${blueSpent}/${state.teamBudget}`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFillTeam(team) {
  if (state.isRunning) {
    setStatus('Cannot random-fill during battle.', 'danger');
    return;
  }

  state.units = state.units.filter((u) => u.team !== team);
  const bounds = TEAM_BOUNDS[team];
  const minY = 30;
  const maxY = ARENA.height - 30;
  let spent = 0;
  let attempts = 0;
  const maxAttempts = 250;

  while (spent < state.teamBudget && attempts < maxAttempts) {
    attempts++;
    const template = ROSTER[randomInt(0, ROSTER.length - 1)];
    if (spent + template.cost > state.teamBudget) {
      continue;
    }

    const candidateX = randomInt(Math.floor(bounds.minX), Math.floor(bounds.maxX));
    const candidateY = randomInt(minY, maxY);
    const tooClose = state.units.some((u) => u.team === team && distance(candidateX, candidateY, u.x, u.y) < 18);
    if (tooClose) {
      continue;
    }

    state.units.push({
      instanceId: state.nextId++,
      team,
      typeId: template.id,
      x: candidateX,
      y: candidateY,
      hp: template.hp,
      cooldownLeft: 0,
    });
    spent += template.cost;
  }

  setStatus(`Random-filled ${team.toUpperCase()} team (spent ${spent}/${state.teamBudget}).`);
  updateTeamStats();
  draw();
}

function getFormationStorageKey() {
  const raw = formationSlotInput.value.trim().toLowerCase();
  const slot = raw === '' ? 'default' : raw.replace(/[^a-z0-9_-]/g, '').slice(0, 24) || 'default';
  formationSlotInput.value = slot;
  return `movbattle:formation:${slot}`;
}

function saveFormation() {
  if (state.isRunning) {
    setStatus('Pause or reset battle before saving formations.', 'danger');
    return;
  }
  const key = getFormationStorageKey();
  const payload = {
    teamBudget: state.teamBudget,
    units: state.units.map((u) => ({ team: u.team, typeId: u.typeId, x: u.x, y: u.y })),
  };
  localStorage.setItem(key, JSON.stringify(payload));
  setStatus(`Saved formation to slot "${formationSlotInput.value}".`, 'good');
}

function loadFormation() {
  if (state.isRunning) {
    setStatus('Pause or reset battle before loading formations.', 'danger');
    return;
  }
  const key = getFormationStorageKey();
  const raw = localStorage.getItem(key);
  if (!raw) {
    setStatus(`No saved formation in slot "${formationSlotInput.value}".`, 'danger');
    return;
  }

  try {
    const payload = JSON.parse(raw);
    if (!Array.isArray(payload.units)) {
      throw new Error('invalid payload');
    }

    state.units = payload.units
      .map((u) => {
        const template = getUnitTemplate(u.typeId);
        if (!template || (u.team !== 'red' && u.team !== 'blue')) {
          return null;
        }
        return {
          instanceId: state.nextId++,
          team: u.team,
          typeId: u.typeId,
          x: Number(u.x),
          y: Number(u.y),
          hp: template.hp,
          cooldownLeft: 0,
        };
      })
      .filter(Boolean);

    if (Number.isFinite(payload.teamBudget) && payload.teamBudget >= 100) {
      state.teamBudget = Math.floor(payload.teamBudget);
      budgetInput.value = String(state.teamBudget);
    }

    setStatus(`Loaded formation from slot "${formationSlotInput.value}".`, 'good');
    updateTeamStats();
    draw();
  } catch {
    setStatus('Saved formation is corrupted and could not be loaded.', 'danger');
  }
}

function spawnUnit(team, templateId, x, y) {
  const t = getUnitTemplate(templateId);
  if (!t) {
    return;
  }

  const spent = getTeamSpent(team);
  if (spent + t.cost > state.teamBudget) {
    setStatus(`${team.toUpperCase()} is over budget. Increase budget or choose a cheaper unit.`, 'danger');
    return;
  }

  state.units.push({
    instanceId: state.nextId++,
    team,
    typeId: t.id,
    x,
    y,
    hp: t.hp,
    cooldownLeft: 0,
  });

  setStatus(`${t.name} placed for ${team.toUpperCase()}.`);
  updateTeamStats();
}

function removeNearestUnit(x, y) {
  let nearestIndex = -1;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < state.units.length; i++) {
    const unit = state.units[i];
    const d = distance(x, y, unit.x, unit.y);
    if (d < nearestDistance && d < 20) {
      nearestDistance = d;
      nearestIndex = i;
    }
  }

  if (nearestIndex >= 0) {
    const [removed] = state.units.splice(nearestIndex, 1);
    const t = getUnitTemplate(removed.typeId);
    setStatus(`Removed ${t?.name ?? 'unit'} from ${removed.team.toUpperCase()}.`);
    updateTeamStats();
  }
}

function canvasToWorld(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function isPointValidForTeam(x, team) {
  const bounds = TEAM_BOUNDS[team];
  return x >= bounds.minX && x <= bounds.maxX;
}

function setupEvents() {
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());

  canvas.addEventListener('mousedown', (event) => {
    if (state.isRunning) {
      return;
    }

    const { x, y } = canvasToWorld(event);
    if (event.button === 2) {
      removeNearestUnit(x, y);
      draw();
      return;
    }

    const team = activeTeamSelect.value;
    if (!isPointValidForTeam(x, team)) {
      setStatus(`Place ${team.toUpperCase()} units on their side of the arena.`, 'danger');
      return;
    }

    spawnUnit(team, unitTypeSelect.value, x, y);
    draw();
  });

  canvas.addEventListener('pointerdown', (event) => {
    if (state.isRunning || event.pointerType === 'mouse') {
      return;
    }

    const { x, y } = canvasToWorld(event);
    const action = tapActionSelect.value;
    if (action === 'erase') {
      removeNearestUnit(x, y);
      draw();
      return;
    }

    const team = activeTeamSelect.value;
    if (!isPointValidForTeam(x, team)) {
      setStatus(`Place ${team.toUpperCase()} units on their side of the arena.`, 'danger');
      return;
    }

    spawnUnit(team, unitTypeSelect.value, x, y);
    draw();
  });

  clearTeamBtn.addEventListener('click', () => {
    const active = activeTeamSelect.value;
    state.units = state.units.filter((u) => u.team !== active);
    setStatus(`Cleared all ${active.toUpperCase()} units.`);
    updateTeamStats();
    draw();
  });

  clearAllBtn.addEventListener('click', () => {
    state.units = [];
    state.winner = null;
    setStatus('Cleared all units.');
    updateTeamStats();
    draw();
  });

  mirrorBtn.addEventListener('click', () => {
    if (state.isRunning) {
      setStatus('Cannot mirror teams during battle.', 'danger');
      return;
    }

    const redUnits = state.units.filter((u) => u.team === 'red');
    const redSpent = getTeamSpent('red');
    if (redSpent > state.teamBudget) {
      setStatus('Red team is over budget, cannot mirror.', 'danger');
      return;
    }
    const mirroredUnits = redUnits.map((u) => ({
      ...u,
      instanceId: state.nextId++,
      team: 'blue',
      x: ARENA.width - u.x,
    }));
    state.units = state.units.filter((u) => u.team !== 'blue').concat(mirroredUnits);
    setStatus('Mirrored red team placement to blue.');
    updateTeamStats();
    draw();
  });

  budgetInput.addEventListener('change', () => {
    const value = Number.parseInt(budgetInput.value, 10);
    if (!Number.isFinite(value) || value < 100) {
      budgetInput.value = String(state.teamBudget);
      return;
    }
    state.teamBudget = value;
    updateTeamStats();
  });

  randomFillBtn.addEventListener('click', () => {
    randomFillTeam(activeTeamSelect.value);
  });
  saveFormationBtn.addEventListener('click', saveFormation);
  loadFormationBtn.addEventListener('click', loadFormation);
  startBtn.addEventListener('click', startBattle);
  pauseBtn.addEventListener('click', togglePause);
  resetBtn.addEventListener('click', resetBattle);
}

function startBattle() {
  if (state.isRunning && !state.isPaused) {
    return;
  }

  if (state.isPaused) {
    state.isPaused = false;
    setStatus('Battle resumed...');
    return;
  }

  const redCount = state.units.filter((u) => u.team === 'red').length;
  const blueCount = state.units.filter((u) => u.team === 'blue').length;

  if (redCount === 0 || blueCount === 0) {
    setStatus('Both teams need at least one unit to start.', 'danger');
    return;
  }

  state.isRunning = true;
  state.isPaused = false;
  setStatus('Battle running...');
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(tickFrame, TICK_RATE);
}

function togglePause() {
  if (!state.isRunning) {
    return;
  }
  state.isPaused = !state.isPaused;
  setStatus(state.isPaused ? 'Battle paused.' : 'Battle resumed...');
}

function resetBattle() {
  if (timer) {
    clearInterval(timer);
  }
  state = structuredClone(baseState);
  budgetInput.value = String(DEFAULT_TEAM_BUDGET);
  setStatus('Battle reset. Place units, then start battle.');
  updateTeamStats();
  draw();
}

function stopBattle(message, kind = 'good') {
  state.isRunning = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  setStatus(message, kind);
}

function tickFrame() {
  if (state.isPaused || !state.isRunning) {
    return;
  }
  const multiplier = Number.parseInt(speedMultiplierSelect.value, 10) || 1;
  for (let i = 0; i < multiplier; i++) {
    tick();
    if (!state.isRunning) {
      break;
    }
  }
}

function tick() {
  const aliveUnits = state.units.filter((u) => u.hp > 0);
  for (const unit of aliveUnits) {
    const template = getUnitTemplate(unit.typeId);
    const enemies = aliveUnits.filter((u) => u.team !== unit.team);
    if (enemies.length === 0) {
      continue;
    }

    const target = closestEnemy(unit, enemies);
    const dist = distance(unit.x, unit.y, target.x, target.y);

    if (dist > template.range) {
      const speed = template.speed;
      const dirX = (target.x - unit.x) / dist;
      const dirY = (target.y - unit.y) / dist;
      unit.x += dirX * speed;
      unit.y += dirY * speed;
    } else {
      unit.cooldownLeft -= TICK_RATE;
      if (unit.cooldownLeft <= 0) {
        target.hp -= template.damage;
        unit.cooldownLeft = template.cooldown;
      }
    }
  }

  state.units = state.units.filter((u) => u.hp > 0);

  const redAlive = state.units.some((u) => u.team === 'red');
  const blueAlive = state.units.some((u) => u.team === 'blue');

  if (!redAlive && !blueAlive) {
    stopBattle('Draw.', 'muted');
  } else if (!redAlive) {
    stopBattle('Blue team wins.', 'good');
  } else if (!blueAlive) {
    stopBattle('Red team wins.', 'good');
  }

  draw();
}

function closestEnemy(unit, enemies) {
  let closest = enemies[0];
  let bestDistance = distance(unit.x, unit.y, closest.x, closest.y);
  for (let i = 1; i < enemies.length; i++) {
    const candidate = enemies[i];
    const d = distance(unit.x, unit.y, candidate.x, candidate.y);
    if (d < bestDistance) {
      bestDistance = d;
      closest = candidate;
    }
  }
  return closest;
}

function distance(ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  return Math.sqrt(dx * dx + dy * dy);
}

function drawArenaBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(201, 80, 80, 0.07)';
  ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

  ctx.fillStyle = 'rgba(71, 123, 214, 0.07)';
  ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);

  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawUnits() {
  for (const unit of state.units) {
    const t = getUnitTemplate(unit.typeId);
    const hpRatio = Math.max(0, unit.hp / t.hp);

    ctx.beginPath();
    ctx.fillStyle = unit.team === 'red' ? '#f27474' : '#6f95ff';
    ctx.arc(unit.x, unit.y, t.radius, 0, Math.PI * 2);
    ctx.fill();

    const barWidth = 20;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(unit.x - barWidth / 2, unit.y - 15, barWidth, 4);

    ctx.fillStyle = '#78d2a1';
    ctx.fillRect(unit.x - barWidth / 2, unit.y - 15, barWidth * hpRatio, 4);
  }
}

function draw() {
  drawArenaBackground();
  drawUnits();
}

configureRosterUi();
setupEvents();
setStatus('Place units, then start battle.');
updateTeamStats();
draw();
