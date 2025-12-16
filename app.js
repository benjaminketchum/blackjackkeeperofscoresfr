// Simple scoreboard logic for blackjack/poker
const MAX_PLAYERS = 8
const MIN_PLAYERS = 2
const STORAGE_KEY = 'scoreboard:v1'

const elements = {
  players: document.getElementById('players'),
  playerCount: document.getElementById('player-count'),
  potAmount: document.getElementById('pot-amount'),
  startGameBtn: document.getElementById('start-game'),
  addPlayerBtn: document.getElementById('add-player'),
  saveBtn: document.getElementById('save-state'),
  resetBtn: document.getElementById('reset-state'),
  collectAnteBtn: document.getElementById('collect-ante'),
  clearStorageBtn: document.getElementById('clear-storage'),
  initialPointsInput: document.getElementById('initial-points'),
  roundMinInput: document.getElementById('round-min'),
  modeSelect: document.getElementById('mode-select'),
  playerTemplate: document.getElementById('player-template')
}

let state = {
  mode: 'blackjack',
  initialPoints: 5000,
  roundMin: 100,
  pot: 0,
  players: []
}

function uuid(){ return Date.now().toString(36) + Math.floor(Math.random()*10000).toString(36) }

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
function loadState(){ const raw = localStorage.getItem(STORAGE_KEY); if(raw) state = JSON.parse(raw) }
function clearState(){ localStorage.removeItem(STORAGE_KEY); resetState() }

function resetState(){ state = {mode:'blackjack',initialPoints:5000,roundMin:100,pot:0,players:[]}; ensureMinPlayers(); render(); saveState() }

function ensureMinPlayers(){ while(state.players.length < MIN_PLAYERS) addPlayer() }

function addPlayer(name){ if(state.players.length >= MAX_PLAYERS) return; const n = name || `Player ${state.players.length+1}`; state.players.push({id:uuid(), name:n, score: state.initialPoints || 5000, isDealer: state.players.length===0}); render(); saveState() }

function removePlayer(id){ if(state.players.length <= MIN_PLAYERS) return; state.players = state.players.filter(p=>p.id!==id); render(); saveState() }

function setDealer(id){ state.players.forEach(p => p.isDealer = (p.id === id)); render(); saveState() }

function setPlayerName(id, name){ const p = state.players.find(x=>x.id===id); if(!p) return; p.name = name; render(); saveState() }

function changeScore(id, delta){ const p = state.players.find(x=>x.id===id); if(!p) return; p.score += delta; render(); saveState() }

function startGame(){ state.initialPoints = Number(elements.initialPointsInput.value) || 5000; state.roundMin = Math.max(0, Number(elements.roundMinInput.value) || 100); state.players.forEach(p => p.score = state.initialPoints); state.pot = 0; collectAnte(); render(); saveState() }

function collectAnte(){ const ante = Math.max(0, Number(state.roundMin) || 0); const count = state.players.length; if(count === 0) return; state.players.forEach(p => p.score -= ante); state.pot += ante * count; render(); saveState() }

function awardPotTo(id){ const winner = state.players.find(x=>x.id===id); if(!winner) return; winner.score += state.pot; state.pot = 0; render(); saveState(); // then automatically collect ante for next round
  collectAnte(); }

function render(){ // header and controls
  elements.playerCount.textContent = state.players.length
  elements.potAmount.textContent = state.pot
  elements.initialPointsInput.value = state.initialPoints
  elements.roundMinInput.value = state.roundMin
  elements.modeSelect.value = state.mode

  // players
  elements.players.innerHTML = ''
  if(state.players.length === 0) ensureMinPlayers()

  state.players.forEach((p, idx) => {
    const tpl = elements.playerTemplate.content.cloneNode(true)
    const root = tpl.querySelector('.player')
    const nameInput = tpl.querySelector('.player-name')
    const dealerRadio = tpl.querySelector('.dealer-radio')
    const scoreValue = tpl.querySelector('.score-value')
    const removeBtn = tpl.querySelector('.remove-player')
    const winBtn = tpl.querySelector('.win-round')

    nameInput.value = p.name
    scoreValue.textContent = p.score
    dealerRadio.checked = !!p.isDealer

    nameInput.addEventListener('change', e => { setPlayerName(p.id, e.target.value) })
    dealerRadio.addEventListener('change', () => { setDealer(p.id) })

    tpl.querySelector('.dec-100').addEventListener('click', ()=>changeScore(p.id,-100))
    tpl.querySelector('.dec-10').addEventListener('click', ()=>changeScore(p.id,-10))
    tpl.querySelector('.inc-10').addEventListener('click', ()=>changeScore(p.id,10))
    tpl.querySelector('.inc-100').addEventListener('click', ()=>changeScore(p.id,100))
    removeBtn.addEventListener('click', ()=>{ if(confirm(`Remove ${p.name}?`)) removePlayer(p.id) })
    winBtn.addEventListener('click', ()=>{ if(confirm(`${p.name} wins the round and gets the pot of ${state.pot}?`)) awardPotTo(p.id) })

    // disable remove when at min players
    removeBtn.disabled = (state.players.length <= MIN_PLAYERS)
    elements.addPlayerBtn.disabled = (state.players.length >= MAX_PLAYERS)

    elements.players.appendChild(tpl)
  })
}

// Wiring UI
elements.addPlayerBtn.addEventListener('click', ()=> addPlayer())
elements.startGameBtn.addEventListener('click', ()=> startGame())
elements.saveBtn.addEventListener('click', ()=> { saveState(); alert('Saved to localStorage') })
elements.resetBtn.addEventListener('click', ()=> { if(confirm('Reset state? This will reset scores and pot.')) resetState() })
elements.collectAnteBtn.addEventListener('click', ()=> { if(confirm('Collect ante from every player now?')) collectAnte() })
elements.clearStorageBtn.addEventListener('click', ()=> { if(confirm('Clear saved data from localStorage?')) { clearState(); alert('Cleared') } })

elements.initialPointsInput.addEventListener('change', ()=> { state.initialPoints = Number(elements.initialPointsInput.value) || 5000; saveState() })
elements.roundMinInput.addEventListener('change', ()=> { state.roundMin = Number(elements.roundMinInput.value) || 100; saveState() })
elements.modeSelect.addEventListener('change', ()=> { state.mode = elements.modeSelect.value; saveState() })

// Initialize
loadState(); ensureMinPlayers(); render();