// ========== HAZBIN EXPERIENCE - VERSIÓN COMPLETA CON DADOS ==========

// ========== VARIABLES GLOBALES ==========
let currentAudio = document.getElementById('jukebox-audio');
let currentSong = null;
let isPlaying = false;
let highLowGame = {
  currentCard: 0,
  score: 0,
  lives: 3,
  gameActive: false
};
let blackjackGame = {
  playerHand: [],
  dealerHand: [],
  gameActive: false,
  deck: []
};
let secretClickCount = 0;

// ========== GALERÍA CON TUS 8 IMÁGENES ==========
const galleryImages = [
  // Carátulas de canciones
  { src: 'images/loserbabycaratula.jpeg', alt: 'Loser Baby', category: 'duo', title: 'Loser Baby - Husk y Angel' },
  { src: 'images/poisoncaratula.jpeg', alt: 'Poison', category: 'angel', title: 'Poison - Angel Dust' },
  { src: 'images/addictcaratula.jpeg', alt: 'Addict', category: 'angel', title: 'Addict - Angel Dust' },
  
  // Personajes
  { src: 'images/huskbartender.avif', alt: 'Husk Bartender', category: 'husk', title: 'Husk el Barman' },
  { src: 'images/angelpose.png', alt: 'Angel Pose', category: 'angel', title: 'Angel Dust' },
  { src: 'images/huskyangel.png', alt: 'Husk y Angel', category: 'duo', title: 'Mejores enemigos' },
  
  // Easter eggs
  { src: 'images/fatnuggets.webp', alt: 'Fat Nuggets', category: 'secret', title: 'Fat Nuggets 🐷' },
  { src: 'images/alastor.webp', alt: 'Alastor', category: 'secret', title: 'Alastor sonríe 📻' }
];

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔥 Iniciando Hazbin Experience...');
  initLoadingScreen();
  initAudio();
  initNavigation();
  initJukebox();
  initGallery();
  initBar();
  initHighLow();
  initBlackjack();
  initSlots();
  initDiceGame(); // NUEVA FUNCIÓN
  initSecrets();
  initClock();
  checkAudioFiles();
});

// ========== VERIFICAR QUE LOS AUDIOS EXISTEN ==========
function checkAudioFiles() {
  const audioFiles = [
    'audio/loserbaby.mp3',
    'audio/poison.mp3',
    'audio/addict.mp3'
  ];
  
  audioFiles.forEach(file => {
    fetch(file, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          console.log(`✅ Audio encontrado: ${file}`);
        } else {
          console.warn(`❌ Audio NO encontrado: ${file}`);
        }
      })
      .catch(() => {
        console.warn(`❌ No se puede acceder a: ${file}`);
      });
  });
}

// ========== LOADING SCREEN ==========
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const progress = document.getElementById('loading-progress');
  
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 500);
    } else {
      width += Math.random() * 30;
      if (width > 100) width = 100;
      progress.style.width = width + '%';
    }
  }, 200);
}

// ========== RELOJ INFERNAL ==========
function initClock() {
  function updateClock() {
    const clock = document.getElementById('hell-clock');
    const now = new Date();
    const hours = String(23 - now.getHours() % 24).padStart(2, '0');
    const minutes = String(66 - now.getMinutes() % 60).padStart(2, '0');
    clock.textContent = `${hours}:${minutes}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
  
  const sinCounter = document.getElementById('sin-counter');
  setInterval(() => {
    sinCounter.innerHTML = `❤️ ${Math.floor(Math.random() * 666 + 100)}`;
  }, 3000);
}

// ========== NAVEGACIÓN SPA ==========
function initNavigation() {
  const dockBtns = document.querySelectorAll('.dock-btn');
  const sections = document.querySelectorAll('.section');
  
  dockBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = btn.dataset.section;
      
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(sectionId).classList.add('active');
      
      dockBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (navigator.vibrate) navigator.vibrate(20);
    });
  });
}

// ========== AUDIO Y JUKEBOX - VERSIÓN CORREGIDA ==========

let fadeInterval = null;
let targetVolume = 0.7;

function initAudio() {
  const volumeSlider = document.getElementById('volume-slider');
  
  // Asegurar que el audio existe
  if (!currentAudio) {
    currentAudio = document.getElementById('jukebox-audio');
  }

  currentAudio.volume = targetVolume;

  volumeSlider.addEventListener('input', (e) => {
    targetVolume = parseFloat(e.target.value);
    currentAudio.volume = targetVolume;
  });

  currentAudio.addEventListener('play', () => {
    isPlaying = true;
    document.getElementById('vinyl').classList.add('spin');
    document.getElementById('tonearm').classList.add('playing');

    const playingCard = document.querySelector(`.song-card[data-url="${currentAudio.src}"]`);
    const songName = playingCard
      ? playingCard.querySelector('.song-title').textContent
      : 'Canción infernal';

    document.getElementById('now-playing').innerHTML = `🎵 Sonando: ${songName}`;
    applySongTheme(currentAudio.src);
  });

  currentAudio.addEventListener('pause', () => {
    isPlaying = false;
    document.getElementById('vinyl').classList.remove('spin');
    document.getElementById('tonearm').classList.remove('playing');
    document.getElementById('now-playing').innerHTML = '⏸️ Pausado';
  });

  currentAudio.addEventListener('ended', () => {
    isPlaying = false;
    document.getElementById('vinyl').classList.remove('spin');
    document.getElementById('tonearm').classList.remove('playing');
    document.getElementById('now-playing').innerHTML = '⏹️ Terminado';
    document.querySelectorAll('.song-card').forEach(card => {
      card.classList.remove('playing');
    });
  });

  currentAudio.addEventListener('error', (e) => {
    console.error('Error de audio:', e);
    console.error('URL que falló:', currentAudio.src);
    document.getElementById('now-playing').innerHTML = '❌ Error al reproducir';
    
    // Intentar cargar de nuevo con URL absoluta
    setTimeout(() => {
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
      const relativeUrl = currentAudio.src.split('/').pop();
      const fullUrl = baseUrl + 'audio/' + relativeUrl;
      console.log('Reintentando con URL absoluta:', fullUrl);
      currentAudio.src = fullUrl;
      currentAudio.load();
    }, 1000);
  });

  // Verificar que los archivos existen
  checkAudioFiles();
}

function initJukebox() {
  const songCards = document.querySelectorAll('.song-card');

  songCards.forEach((card) => {
    const btn = card.querySelector('.play-song-btn');
    const songUrl = card.dataset.url; // Ej: "audio/loserbaby.mp3"
    const songTitle = card.querySelector('.song-title').textContent;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Construir URL ABSOLUTA correcta
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
      const fullUrl = baseUrl + songUrl;
      
      console.log('Reproduciendo:', fullUrl);
      console.log('Base URL:', baseUrl);
      console.log('Song URL:', songUrl);

      if (currentSong === fullUrl && isPlaying) {
        // Si es la misma canción, hacer fade out y pausar
        fadeOut(() => {
          card.classList.remove('playing');
          currentAudio.pause();
        });
      } else {
        // Cambiar a nueva canción
        switchSong(fullUrl, card, songCards, songTitle);
      }
    });

    // Precargar metadata
    const fullUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + songUrl;
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = fullUrl;
  });
}

function switchSong(url, card, allCards, title) {
  if (isPlaying) {
    fadeOut(() => {
      loadAndPlay(url, card, allCards, title);
    });
  } else {
    loadAndPlay(url, card, allCards, title);
  }
}

function loadAndPlay(url, card, allCards, title) {
  clearInterval(fadeInterval);

  // Detener audio actual
  currentAudio.pause();
  
  // Asignar nueva URL
  currentAudio.src = url;
  currentAudio.load(); // Importante: recargar el audio
  
  currentSong = url;

  // Actualizar UI
  allCards.forEach(c => c.classList.remove('playing'));
  card.classList.add('playing');

  document.getElementById('vinyl-label').textContent = title.substring(0, 6);

  // Iniciar reproducción con fade in
  currentAudio.volume = 0;
  
  // Usar promesa para manejar errores de reproducción
  const playPromise = currentAudio.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Reproducción exitosa
        fadeIn(currentAudio);
        console.log('✅ Reproduciendo correctamente:', url);
      })
      .catch(error => {
        // Error al reproducir
        console.error('❌ Error al reproducir:', error);
        document.getElementById('now-playing').innerHTML = '❌ No se puede reproducir';
        
        // Mostrar mensaje amigable al usuario
        alert('No se pudo reproducir el audio. Verifica:\n' +
              '1. Los archivos MP3 están en la carpeta /audio/\n' +
              '2. Los nombres son: loserbaby.mp3, poison.mp3, addict.mp3\n' +
              '3. GitHub Pages terminó de publicar (espera 2-3 minutos)');
      });
  }
}

function fadeIn(audio) {
  clearInterval(fadeInterval);
  audio.volume = 0;

  fadeInterval = setInterval(() => {
    if (audio.volume < targetVolume) {
      audio.volume = Math.min(audio.volume + 0.05, targetVolume);
    } else {
      clearInterval(fadeInterval);
    }
  }, 80);
}

function fadeOut(callback) {
  clearInterval(fadeInterval);

  fadeInterval = setInterval(() => {
    if (currentAudio.volume > 0.05) {
      currentAudio.volume -= 0.05;
    } else {
      clearInterval(fadeInterval);
      currentAudio.pause();
      currentAudio.volume = targetVolume;
      if (callback) callback();
    }
  }, 80);
}

function fadeOutAndPause(card) {
  fadeOut(() => {
    card.classList.remove('playing');
  });
}

function checkAudioFiles() {
  const audioFiles = [
    'audio/loserbaby.mp3',
    'audio/poison.mp3',
    'audio/addict.mp3'
  ];
  
  const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
  
  audioFiles.forEach(file => {
    const fullUrl = baseUrl + file;
    console.log('Verificando audio:', fullUrl);
    
    fetch(fullUrl, { method: 'HEAD', cache: 'no-cache' })
      .then(response => {
        if (response.ok) {
          console.log(`✅ Audio encontrado: ${file}`);
        } else {
          console.warn(`❌ Audio NO encontrado: ${file} (${response.status})`);
        }
      })
      .catch(error => {
        console.warn(`❌ Error accediendo a: ${file}`, error);
      });
  });
}

function applySongTheme(song) {
  document.body.classList.remove(
    "theme-loser",
    "theme-poison",
    "theme-addict"
  );

  if (song.includes("loser")) {
    document.body.classList.add("theme-loser");
  } else if (song.includes("poison")) {
    document.body.classList.add("theme-poison");
  } else if (song.includes("addict")) {
    document.body.classList.add("theme-addict");
  }
}


// ========= JUKEBOX MEJORADA =========

function initJukebox() {
  const songCards = document.querySelectorAll('.song-card');

  songCards.forEach((card) => {
    const btn = card.querySelector('.play-song-btn');
    const songUrl = card.dataset.url;
    const songTitle = card.querySelector('.song-title').textContent;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const fullUrl = songUrl; // 👈 FIX AQUÍ

      if (currentSong === fullUrl && isPlaying) {
        fadeOutAndPause(card);
      } else {
        switchSong(fullUrl, card, songCards, songTitle);
      }
    });
  });
}



// ========= TRANSICIÓN SUAVE ENTRE CANCIONES =========

function switchSong(url, card, allCards, title) {
  if (isPlaying) {
    fadeOut(() => {
      loadAndPlay(url, card, allCards, title);
    });
  } else {
    loadAndPlay(url, card, allCards, title);
  }
}

function loadAndPlay(url, card, allCards, title) {
  clearInterval(fadeInterval);

  currentAudio.pause();
  currentAudio.src = url;
  currentAudio.load(); // 🔥 importante

  currentSong = url;

  allCards.forEach(c => c.classList.remove('playing'));
  card.classList.add('playing');

  document.getElementById('vinyl-label').textContent =
    title.substring(0, 6);

  currentAudio.volume = 0;
  currentAudio.play();

  fadeIn(currentAudio);
}



// ========= FADE IN / OUT REAL =========

function fadeIn(audio) {
  clearInterval(fadeInterval);

  audio.volume = 0;

  fadeInterval = setInterval(() => {
    if (audio.volume < targetVolume) {
      audio.volume = Math.min(audio.volume + 0.05, targetVolume);
    } else {
      clearInterval(fadeInterval);
    }
  }, 80);
}



function fadeOut(callback) {
  clearInterval(fadeInterval);

  fadeInterval = setInterval(() => {
    if (currentAudio.volume > 0.05) {
      currentAudio.volume -= 0.05;
    } else {
      clearInterval(fadeInterval);
      currentAudio.pause();
      currentAudio.volume = targetVolume;

      if (callback) callback();
    }
  }, 80);
}

function fadeOutAndPause(card) {
  fadeOut(() => {
    card.classList.remove('playing');
  });
}


// ========= TEMA DINÁMICO (DUO ANGEL x HUSK) =========

function applySongTheme(song) {
  document.body.classList.remove(
    "theme-loser",
    "theme-poison",
    "theme-addict"
  );

  if (song.includes("loserbaby")) {
    document.body.classList.add("theme-loser");
  } 
  else if (song.includes("poison")) {
    document.body.classList.add("theme-poison");
  } 
  else if (song.includes("addict")) {
    document.body.classList.add("theme-addict");
  }
}



// ========== GALERÍA ==========
function initGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');
  const closeModal = document.querySelector('.close-modal');
  
  function renderGallery(filter = 'all') {
    galleryGrid.innerHTML = '';
    
    const filtered = filter === 'all' 
      ? galleryImages 
      : galleryImages.filter(img => img.category === filter);
    
    if (filtered.length === 0) {
      galleryGrid.innerHTML = '<p style="color: white; text-align: center; padding: 20px;">No hay imágenes en esta categoría</p>';
      return;
    }
    
    filtered.forEach(img => {
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.innerHTML = `
        <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=Imagen+no+encontrada'">
        <div class="card-overlay">${img.title}</div>
      `;
      
      card.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
        modalCaption.innerHTML = img.title;
      });
      
      galleryGrid.appendChild(card);
    });
  }
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    });
  });
  
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  renderGallery('all');
}

// ========== HUSK'S BAR ==========
function initBar() {
  const orderBtn = document.getElementById('order-random-btn');
  const drinkResult = document.getElementById('drink-result');
  const huskSpeech = document.getElementById('husk-speech');
  const drinkItems = document.querySelectorAll('.drink-item');
  
  const huskPhrases = {
    whiskey: [
      'Whiskey del infierno... como mi ex. Toma.',
      'Esto quema más que tu futuro. Salú.',
      'Directo del barril de la condenación.',
      'Para olvidar que existes.'
    ],
    cocktail: [
      'El Angel\'s Kiss... asquerosamente dulce, como él.',
      'Con este te creerás bonito. No funciona.',
      'Una copa rosa para el alma negra.',
      'Te va a gustar más que a Angel.'
    ],
    beer: [
      'Cerveza de Charlie. La única bebida optimista.',
      'Sabe a esperanza fallida. Disfruta.',
      'La más suave... para los débiles.',
      'Con esta hasta Alastor sonríe. Bueno, no.'
    ],
    special: [
      'La casa nunca gana... excepto cuando gana. Toma.',
      'Secreto de la casa: no preguntes qué tiene.',
      'Una vez alguien sobrevivió a esto. Una vez.',
      'Te vas a cagar en todo, pero te gustará.'
    ]
  };
  
  drinkItems.forEach(item => {
    item.addEventListener('click', () => {
      drinkItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
    });
  });
  
  orderBtn.addEventListener('click', () => {
    const selected = document.querySelector('.drink-item.selected');
    const drinkType = selected ? selected.dataset.drink : 'special';
    const phrases = huskPhrases[drinkType] || huskPhrases.special;
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    huskSpeech.textContent = `"${randomPhrase}"`;
    
    const drinkNames = {
      whiskey: '🥃 Whiskey del infierno',
      cocktail: '🍹 Angel\'s Kiss',
      beer: '🍺 Cerveza de Charlie',
      special: '🎲 La casa nunca gana'
    };
    
    drinkResult.innerHTML = `
      <strong>${drinkNames[drinkType]}</strong><br>
      <span style="color: #ff0055">${randomPhrase}</span>
    `;
    
    if (navigator.vibrate) navigator.vibrate(50);
    
    orderBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      orderBtn.style.transform = '';
    }, 100);
  });
  
  // Tabs del bar
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
    });
  });
}

// ========== JUEGO HIGH-LOW ==========
function initHighLow() {
  const higherBtn = document.getElementById('higher-btn');
  const lowerBtn = document.getElementById('lower-btn');
  const newGameBtn = document.getElementById('new-highlow');
  const currentCardEl = document.getElementById('current-card');
  const scoreEl = document.getElementById('game-score');
  const livesEl = document.getElementById('game-lives');
  const gameMessage = document.getElementById('game-message');
  
  const cardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  
  function getCardSymbol(value) {
    if (value <= 10) return value.toString();
    const symbols = {11: 'J', 12: 'Q', 13: 'K', 14: 'A'};
    return symbols[value];
  }
  
  function newGame() {
    highLowGame = {
      currentCard: cardValues[Math.floor(Math.random() * cardValues.length)],
      score: 0,
      lives: 3,
      gameActive: true
    };
    updateDisplay();
    gameMessage.textContent = '¿Mayor o menor?';
    higherBtn.disabled = false;
    lowerBtn.disabled = false;
  }
  
  function updateDisplay() {
    currentCardEl.textContent = getCardSymbol(highLowGame.currentCard);
    scoreEl.textContent = highLowGame.score;
    livesEl.textContent = highLowGame.lives;
  }
  
  function checkGuess(isHigher) {
    if (!highLowGame.gameActive) return;
    
    const nextCard = cardValues[Math.floor(Math.random() * cardValues.length)];
    const current = highLowGame.currentCard;
    
    let won = false;
    if (isHigher) {
      won = nextCard > current;
    } else {
      won = nextCard < current;
    }
    
    if (nextCard === current) {
      won = false;
      gameMessage.textContent = '¡Empate! La casa gana...';
    }
    
    if (won) {
      highLowGame.score += 10;
      gameMessage.textContent = `¡Ganaste! Sale ${getCardSymbol(nextCard)}`;
      currentCardEl.style.transform = 'rotateY(360deg)';
      setTimeout(() => {
        currentCardEl.style.transform = '';
      }, 500);
    } else {
      highLowGame.lives -= 1;
      gameMessage.textContent = `Perdiste... Sale ${getCardSymbol(nextCard)}`;
      
      if (highLowGame.lives <= 0) {
        gameMessage.textContent = '💀 GAME OVER 💀';
        highLowGame.gameActive = false;
        higherBtn.disabled = true;
        lowerBtn.disabled = true;
      }
    }
    
    highLowGame.currentCard = nextCard;
    updateDisplay();
  }
  
  higherBtn.addEventListener('click', () => checkGuess(true));
  lowerBtn.addEventListener('click', () => checkGuess(false));
  newGameBtn.addEventListener('click', newGame);
  
  newGame();
}

// ========== BLACKJACK INFERNAL ==========
function initBlackjack() {
  const hitBtn = document.getElementById('hit-btn');
  const standBtn = document.getElementById('stand-btn');
  const newGameBtn = document.getElementById('new-blackjack');
  const playerCardsEl = document.getElementById('player-cards');
  const dealerCardsEl = document.getElementById('dealer-cards');
  const playerValueEl = document.getElementById('player-value');
  const dealerValueEl = document.getElementById('dealer-value');
  const bjStatus = document.getElementById('bj-status');
  
  function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
    const displayValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    const deck = [];
    for (let suit of suits) {
      for (let i = 0; i < values.length; i++) {
        deck.push({
          value: values[i],
          display: displayValues[i],
          suit: suit,
          id: `${displayValues[i]}${suit}`
        });
      }
    }
    
    for (let shuffle = 0; shuffle < 7; shuffle++) {
      deck.sort(() => Math.random() - 0.5);
    }
    
    return deck;
  }
  
  function calculateHand(hand) {
    let sum = hand.reduce((acc, card) => acc + card.value, 0);
    let aces = hand.filter(c => c.display === 'A').length;
    
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  }
  
  function createCardElement(card, isHidden = false) {
    const cardDiv = document.createElement('span');
    cardDiv.className = `husk-card ${isHidden ? 'back' : ''}`;
    
    if (!isHidden) {
      cardDiv.setAttribute('data-suit', card.suit);
      cardDiv.setAttribute('data-value', card.display);
      cardDiv.textContent = `${card.display}${card.suit}`;
      
      if (['J', 'Q', 'K', 'A'].includes(card.display)) {
        cardDiv.style.fontSize = '1.5rem';
        cardDiv.style.fontWeight = '800';
      }
    }
    
    return cardDiv;
  }
  
  function updateDisplay() {
    playerCardsEl.innerHTML = '';
    dealerCardsEl.innerHTML = '';
    
    blackjackGame.playerHand.forEach(card => {
      playerCardsEl.appendChild(createCardElement(card));
    });
    
    if (blackjackGame.gameActive) {
      if (blackjackGame.dealerHand.length > 0) {
        dealerCardsEl.appendChild(createCardElement(blackjackGame.dealerHand[0]));
        dealerCardsEl.appendChild(createCardElement(null, true));
      }
    } else {
      blackjackGame.dealerHand.forEach(card => {
        dealerCardsEl.appendChild(createCardElement(card));
      });
    }
    
    playerValueEl.textContent = calculateHand(blackjackGame.playerHand);
    
    if (!blackjackGame.gameActive) {
      dealerValueEl.textContent = calculateHand(blackjackGame.dealerHand);
    } else {
      dealerValueEl.textContent = blackjackGame.dealerHand[0]?.value || 0;
    }
  }
  
  function newBlackjack() {
    blackjackGame = {
      playerHand: [],
      dealerHand: [],
      gameActive: true,
      deck: createDeck()
    };
    
    blackjackGame.playerHand.push(blackjackGame.deck.pop());
    blackjackGame.dealerHand.push(blackjackGame.deck.pop());
    blackjackGame.playerHand.push(blackjackGame.deck.pop());
    blackjackGame.dealerHand.push(blackjackGame.deck.pop());
    
    updateDisplay();
    bjStatus.textContent = '🎴 Tu turno, ¿otra carta?';
    hitBtn.disabled = false;
    standBtn.disabled = false;
    
    if (calculateHand(blackjackGame.playerHand) === 21) {
      setTimeout(() => {
        bjStatus.textContent = '🎉 ¡BLACKJACK! ¡Ganaste automáticamente!';
        blackjackGame.gameActive = false;
        hitBtn.disabled = true;
        standBtn.disabled = true;
        updateDisplay();
        dealerValueEl.textContent = calculateHand(blackjackGame.dealerHand);
      }, 500);
    }
  }
  
  function hit() {
    if (!blackjackGame.gameActive) return;
    
    const newCard = blackjackGame.deck.pop();
    blackjackGame.playerHand.push(newCard);
    
    playerCardsEl.style.transform = 'scale(1.02)';
    setTimeout(() => {
      playerCardsEl.style.transform = '';
    }, 200);
    
    updateDisplay();
    
    const playerValue = calculateHand(blackjackGame.playerHand);
    
    if (playerValue > 21) {
      bjStatus.textContent = '💥 ¡Te pasaste! Perdiste.';
      blackjackGame.gameActive = false;
      hitBtn.disabled = true;
      standBtn.disabled = true;
      
      setTimeout(() => {
        updateDisplay();
        dealerValueEl.textContent = calculateHand(blackjackGame.dealerHand);
      }, 500);
    }
  }
  
  function stand() {
    if (!blackjackGame.gameActive) return;
    
    bjStatus.textContent = '✋ Te plantas... turno de Husk';
    blackjackGame.gameActive = false;
    
    updateDisplay();
    
    setTimeout(() => {
      let dealerValue = calculateHand(blackjackGame.dealerHand);
      
      while (dealerValue < 17) {
        const newCard = blackjackGame.deck.pop();
        blackjackGame.dealerHand.push(newCard);
        
        dealerCardsEl.style.transform = 'scale(1.02)';
        setTimeout(() => {
          dealerCardsEl.style.transform = '';
        }, 200);
        
        updateDisplay();
        dealerValue = calculateHand(blackjackGame.dealerHand);
      }
      
      const playerValue = calculateHand(blackjackGame.playerHand);
      dealerValueEl.textContent = dealerValue;
      
      if (dealerValue > 21) {
        bjStatus.textContent = '🎉 ¡El dealer se pasó! ¡GANASTE!';
      } else if (dealerValue > playerValue) {
        bjStatus.textContent = '😿 PERDISTE... Husk gana.';
      } else if (dealerValue < playerValue) {
        bjStatus.textContent = '🎊 ¡GANASTE! Husk está sorprendido.';
      } else {
        bjStatus.textContent = '🤝 EMPATE. La casa nunca pierde.';
      }
      
      hitBtn.disabled = true;
      standBtn.disabled = true;
    }, 800);
  }
  
  hitBtn.addEventListener('click', hit);
  standBtn.addEventListener('click', stand);
  newGameBtn.addEventListener('click', newBlackjack);
  
  setTimeout(() => {
    newBlackjack();
  }, 500);
}

// ========== FUNCIÓN #1: TRAGAPERRAS INFERNAL ==========
function initSlots() {
  const reel1 = document.getElementById('reel1');
  const reel2 = document.getElementById('reel2');
  const reel3 = document.getElementById('reel3');
  const spinBtn = document.getElementById('spin-slot');
  const resultDiv = document.getElementById('slot-result');
  const playerSoulsSpan = document.getElementById('player-souls');
  const currentBetSpan = document.getElementById('current-bet');
  const increaseBet = document.getElementById('increase-bet');
  const decreaseBet = document.getElementById('decrease-bet');
  const betDisplay = document.querySelector('.bet-display');
  
  let playerSouls = 100;
  let currentBet = 10;
  let isSpinning = false;
  
  const symbols = [
    { emoji: '🍺', name: 'Cerveza', value: 10 },
    { emoji: '🐱', name: 'Husk', value: 20 },
    { emoji: '💗', name: 'Angel', value: 30 },
    { emoji: '👑', name: 'Alastor', value: 40 },
    { emoji: '🎰', name: 'Jackpot', value: 50 }
  ];
  
  function updateUI() {
    playerSoulsSpan.textContent = playerSouls;
    currentBetSpan.textContent = currentBet;
    betDisplay.textContent = `${currentBet} almas`;
  }
  
  function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
  }
  
  function calculatePrize(sym1, sym2, sym3) {
    if (sym1.emoji === sym2.emoji && sym2.emoji === sym3.emoji) {
      return sym1.value * 10;
    }
    
    if (sym1.emoji === sym2.emoji || sym1.emoji === sym3.emoji || sym2.emoji === sym3.emoji) {
      return currentBet;
    }
    
    return 0;
  }
  
  function getHuskMessage(prize) {
    const messages = [
      'Husk: "Ja, perdiste, como siempre."',
      'Husk: "Mi abuela juega mejor que tú."',
      'Husk: "¿Otra vez? Vas a terminar vendiendo el alma."',
      'Husk: "Ni Fat Nuggets juega tan mal."',
      'Husk: "La casa siempre gana, idiota."'
    ];
    
    const winMessages = [
      'Husk: "¿Ganaste? Debe ser un error."',
      'Husk: "Toma tu premio... y no te acostumbres."',
      'Husk: "Suerte de principiante."',
      'Husk: "Bueno, hasta un reloj rojo da la hora bien."'
    ];
    
    const jackpotMessages = [
      'Husk: "¡¿JACKPOT?! ¡Esto no puede estar pasando!"',
      'Husk: "Maldición, me vas a dejar en bancarrota."',
      'Husk: "Toma todo y vete de mi bar."',
      'Husk: "Alastor va a tener que pagar esto."'
    ];
    
    if (prize >= 500) {
      return jackpotMessages[Math.floor(Math.random() * jackpotMessages.length)];
    } else if (prize > 0) {
      return winMessages[Math.floor(Math.random() * winMessages.length)];
    } else {
      return messages[Math.floor(Math.random() * messages.length)];
    }
  }
  
  async function spin() {
    if (isSpinning) return;
    if (playerSouls < currentBet) {
      resultDiv.innerHTML = '❌ No tienes suficientes almas, muerto de hambre.';
      return;
    }
    
    isSpinning = true;
    spinBtn.disabled = true;
    
    playerSouls -= currentBet;
    updateUI();
    
    reel1.classList.add('spinning');
    reel2.classList.add('spinning');
    reel3.classList.add('spinning');
    
    const spinInterval = setInterval(() => {
      if (!isSpinning) return;
      reel1.textContent = getRandomSymbol().emoji;
      reel2.textContent = getRandomSymbol().emoji;
      reel3.textContent = getRandomSymbol().emoji;
    }, 50);
    
    setTimeout(() => {
      clearInterval(spinInterval);
      
      reel1.classList.remove('spinning');
      reel2.classList.remove('spinning');
      reel3.classList.remove('spinning');
      
      const result1 = getRandomSymbol();
      const result2 = getRandomSymbol();
      const result3 = getRandomSymbol();
      
      reel1.textContent = result1.emoji;
      reel2.textContent = result2.emoji;
      reel3.textContent = result3.emoji;
      
      const prize = calculatePrize(result1, result2, result3);
      
      if (prize > 0) {
        playerSouls += prize;
        
        if (prize >= 500) {
          resultDiv.innerHTML = `🎉🎉🎉 ¡JACKPOT! +${prize} almas 🎉🎉🎉<br>${getHuskMessage(prize)}`;
          document.querySelector('.slot-machine').style.animation = 'neonPulse 1s infinite';
          setTimeout(() => {
            document.querySelector('.slot-machine').style.animation = '';
          }, 3000);
        } else {
          resultDiv.innerHTML = `🎉 ¡Ganaste ${prize} almas! 🎉<br>${getHuskMessage(prize)}`;
        }
      } else {
        resultDiv.innerHTML = `😿 Perdiste ${currentBet} almas...<br>${getHuskMessage(0)}`;
      }
      
      updateUI();
      isSpinning = false;
      spinBtn.disabled = false;
      
      if (navigator.vibrate) {
        if (prize > 0) {
          navigator.vibrate([50, 50, 50]);
        } else {
          navigator.vibrate(100);
        }
      }
      
      const huskSpeech = document.getElementById('husk-speech');
      if (huskSpeech) {
        huskSpeech.textContent = `"${getHuskMessage(prize).replace('Husk: ', '')}"`;
      }
      
    }, 1500);
  }
  
  increaseBet.addEventListener('click', () => {
    if (currentBet < 50 && !isSpinning && playerSouls >= currentBet + 10) {
      currentBet += 10;
      updateUI();
    }
  });
  
  decreaseBet.addEventListener('click', () => {
    if (currentBet > 10 && !isSpinning) {
      currentBet -= 10;
      updateUI();
    }
  });
  
  spinBtn.addEventListener('click', spin);
  
  updateUI();
  resultDiv.innerHTML = '🎰 ¡Bienvenido al tragamonedas de Husk!';
}

// ========== FUNCIÓN #2: DADOS DE ANGEL ==========
function initDiceGame() {
  // Elementos del DOM
  const playerDice = document.getElementById('player-dice');
  const playerDiceFace = document.getElementById('player-dice-face');
  const angelDice = document.getElementById('angel-dice');
  const angelDiceFace = document.getElementById('angel-dice-face');
  const rollBtn = document.getElementById('roll-dice');
  const starPointsSpan = document.getElementById('star-points');
  const winStreakSpan = document.getElementById('win-streak');
  const historyList = document.getElementById('history-list');
  const angelMessage = document.getElementById('angel-message');
  
  // Variables del juego
  let starPoints = 0;
  let winStreak = 0;
  let isRolling = false;
  
  // Representaciones de dados (unicode)
  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  
  // Mensajes de Angel
  const angelMessages = {
    win: [
      '¡Otra vez! Esta vez fue suerte, nena.',
      'Uy, me ganaste... ¿quieres un premio?',
      'No está mal para un mortal...',
      '¿Seguro que no haces trampa?',
      'Husk, este me está ganando!'
    ],
    lose: [
      '¡Te gané, cariño! ¿Otra?',
      'Los ángeles siempre ganamos ~',
      'Awww, qué pena... ¿revancha?',
      'Husk, dile algo a este perdedor!',
      'Ni Fat Nuggets juega tan mal...'
    ],
    streak: [
      '¡${streak} VICTORIAS SEGUIDAS! Estás on fire, nene! 🔥',
      '${streak} seguidas... ¿eres un ángel caído?',
      '¡${streak}! Me estás enamorando ~',
      'Con ${streak} seguidas ya eres parte del hotel!'
    ],
    tie: [
      'Empate... otra vez será, precioso.',
      'Igualitos tú y yo... literlamente.',
      'Qué aburrido, los dos sacamos lo mismo.'
    ]
  };
  
  // Función para actualizar UI
  function updateUI() {
    starPointsSpan.textContent = starPoints;
    winStreakSpan.textContent = winStreak;
  }
  
  // Función para añadir al historial
  function addToHistory(message, isWin = null) {
    const historyItem = document.createElement('p');
    historyItem.className = 'history-item';
    if (isWin === true) historyItem.classList.add('win');
    if (isWin === false) historyItem.classList.add('lose');
    
    const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    historyItem.innerHTML = `[${time}] ${message}`;
    
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Limitar historial a 10 items
    while (historyList.children.length > 10) {
      historyList.removeChild(historyList.lastChild);
    }
  }
  
  // Función para mensaje aleatorio
  function getRandomMessage(type, streak = 0) {
    if (type === 'streak') {
      const msg = angelMessages.streak[Math.floor(Math.random() * angelMessages.streak.length)];
      return msg.replace('${streak}', streak);
    }
    return angelMessages[type][Math.floor(Math.random() * angelMessages[type].length)];
  }
  
  // Función para tirar dados
  async function rollDice() {
    if (isRolling) return;
    
    isRolling = true;
    rollBtn.disabled = true;
    
    // Animación de dados
    playerDice.classList.add('rolling');
    angelDice.classList.add('rolling');
    
    // Efecto de cambio rápido
    const rollInterval = setInterval(() => {
      const randomPlayer = Math.floor(Math.random() * 6);
      const randomAngel = Math.floor(Math.random() * 6);
      playerDiceFace.textContent = diceFaces[randomPlayer];
      angelDiceFace.textContent = diceFaces[randomAngel];
    }, 50);
    
    // Resultado final después de 1 segundo
    setTimeout(() => {
      clearInterval(rollInterval);
      
      playerDice.classList.remove('rolling');
      angelDice.classList.remove('rolling');
      
      const playerRoll = Math.floor(Math.random() * 6) + 1;
      const angelRoll = Math.floor(Math.random() * 6) + 1;
      
      playerDiceFace.textContent = diceFaces[playerRoll - 1];
      angelDiceFace.textContent = diceFaces[angelRoll - 1];
      
      // Determinar resultado
      if (playerRoll > angelRoll) {
        // Victoria
        starPoints += 10;
        winStreak++;
        
        if (winStreak >= 3) {
          starPoints += 20; // Bonus por racha
          angelMessage.textContent = `"${getRandomMessage('streak', winStreak)}"`;
          addToHistory(`🔥 ¡RACHA DE ${winStreak}! +30 puntos`, true);
        } else {
          angelMessage.textContent = `"${getRandomMessage('win')}"`;
          addToHistory(`🎉 Victoria! Tú:${playerRoll} - Angel:${angelRoll} +10 pts`, true);
        }
        
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        
      } else if (playerRoll < angelRoll) {
        // Derrota
        winStreak = 0;
        angelMessage.textContent = `"${getRandomMessage('lose')}"`;
        addToHistory(`😿 Derrota... Tú:${playerRoll} - Angel:${angelRoll}`, false);
        
        if (navigator.vibrate) navigator.vibrate(200);
        
      } else {
        // Empate
        angelMessage.textContent = `"${getRandomMessage('tie')}"`;
        addToHistory(`🤝 Empate! Ambos sacaron ${playerRoll}`, null);
        
        if (navigator.vibrate) navigator.vibrate(100);
      }
      
      updateUI();
      isRolling = false;
      rollBtn.disabled = false;
      
    }, 1000);
  }
  
  rollBtn.addEventListener('click', rollDice);
  
  // Mensaje inicial
  angelMessage.textContent = '"¿A que no me ganas, cariño?"';
  addToHistory('🎲 Juego iniciado');
  updateUI();
}

// ========== SECRETOS Y EASTER EGGS ==========
function initSecrets() {
  const huskLogo = document.getElementById('husk-logo');
  const polaroids = document.querySelectorAll('.polaroid');
  
  huskLogo.addEventListener('click', () => {
    secretClickCount++;
    
    if (secretClickCount === 3) {
      alert('🔥 ¡HUSBANDO MODO ACTIVADO! 🔥\nHusk ahora te quiere... un poco.');
      document.body.style.backgroundImage = 'radial-gradient(circle at 30% 30%, #ff0055, #0d0d0d)';
      huskLogo.style.animation = 'pulse 0.5s infinite';
      secretClickCount = 0;
    }
  });
  
  polaroids.forEach(polaroid => {
    polaroid.addEventListener('click', () => {
      polaroid.style.transform = 'scale(1.1) rotate(0deg)';
      setTimeout(() => {
        polaroid.style.transform = '';
      }, 500);
      
      const caption = polaroid.querySelector('.polaroid-caption').textContent;
      if (caption.includes('Fat Nuggets')) {
        alert('🐷 ¡Es Fat Nuggets! El cerdito de Angel está hambriento.');
      } else if (caption.includes('Alastor')) {
        alert('📻 "¡Esto es una transmisión especial!" - Alastor');
        document.documentElement.style.setProperty('--husk-gold', '#ff0000');
        setTimeout(() => {
          document.documentElement.style.setProperty('--husk-gold', '#d4af37');
        }, 2000);
      }
    });
  });
}

// ========== FUNCIÓN #3: RULETA RUSA INFERNAL ==========
function initRoulette() {
  // Elementos del DOM
  const spinBtn = document.getElementById('spin-chamber');
  const shootBtn = document.getElementById('pull-trigger');
  const newGameBtn = document.getElementById('new-roulette');
  const messageEl = document.getElementById('roulette-message');
  const storyEl = document.getElementById('husk-story');
  const winsEl = document.getElementById('roulette-wins');
  const lossesEl = document.getElementById('roulette-losses');
  const streakEl = document.getElementById('roulette-streak');
  const gunCylinder = document.getElementById('gun-cylinder');
  const bulletIndicator = document.querySelector('.bullet-count');
  const gun = document.getElementById('gun');
  
  // Variables del juego
  let bulletPosition = Math.floor(Math.random() * 6);
  let currentChamber = 0;
  let wins = 0;
  let losses = 0;
  let streak = 0;
  let gameActive = true;
  let isSpinning = false;
  
  // Frases de Husk
  const huskPhrases = {
    spin: [
      "Girando... ¿dónde estará la bala?",
      "La suerte está en movimiento...",
      "Las probabilidades cambian...",
      "El destino es caprichoso..."
    ],
    safe: [
      "Click... sigues vivo. Por ahora.",
      "Esa recámara estaba vacía. ¿Otra?",
      "La muerte te susurró y pasó de largo.",
      "Click. La parca sigue esperando."
    ],
    death: [
      "💀 ¡BANG! ¡Te agarró la huesuda! 💀",
      "¡PUM! Descansa en paz, idiota.",
      "La bala encontró su hogar... en tu cabeza.",
      "Eso fue... espectacularmente mortal."
    ],
    win: [
      "Sobreviviste... esta vez.",
      "Eres más duro de lo que pareces.",
      "Hmph. Impresionante.",
      "La muerte te tiene miedo."
    ],
    newGame: [
      "Una bala, seis recámaras... ¿te sientes con suerte?",
      "Nueva partida. Nueva oportunidad de morir.",
      "Vamos a jugar de nuevo. Te tengo fe... o no."
    ]
  };
  
  // Actualizar UI de las recámaras
  function updateChambers() {
    for (let i = 1; i <= 6; i++) {
      const chamber = document.getElementById(`chamber${i}`);
      chamber.classList.remove('loaded');
      if (i - 1 === bulletPosition) {
        chamber.classList.add('loaded');
      }
    }
    bulletIndicator.textContent = `💀 1 bala (posición ${bulletPosition + 1}/6)`;
  }
  
  // Actualizar estadísticas
  function updateStats() {
    winsEl.textContent = wins;
    lossesEl.textContent = losses;
    streakEl.textContent = streak;
  }
  
  // Mensaje de Husk
  function setHuskMessage(type) {
    const phrases = huskPhrases[type];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    storyEl.querySelector('.story-text').textContent = `"${randomPhrase}"`;
  }
  
  // Girar recámara
  function spinChamber() {
    if (!gameActive || isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    shootBtn.disabled = true;
    
    // Animación
    gunCylinder.classList.add('spinning');
    setHuskMessage('spin');
    messageEl.textContent = '🔄 Girando recámara...';
    
    setTimeout(() => {
      gunCylinder.classList.remove('spinning');
      
      // Nueva posición aleatoria de la bala
      bulletPosition = Math.floor(Math.random() * 6);
      currentChamber = 0;
      gameActive = true;
      
      updateChambers();
      messageEl.textContent = '✅ Recámara girada. ¿Te atreves a disparar?';
      
      isSpinning = false;
      spinBtn.disabled = false;
      shootBtn.disabled = false;
      
      if (navigator.vibrate) navigator.vibrate(100);
      
    }, 1000);
  }
  
  // Disparar
  function shoot() {
    if (!gameActive || isSpinning) return;
    
    gameActive = false;
    shootBtn.disabled = true;
    spinBtn.disabled = true;
    
    // Animación del disparo
    gun.classList.add('shooting');
    
    setTimeout(() => {
      gun.classList.remove('shooting');
    }, 200);
    
    // Verificar si la bala está en la recámara actual
    if (currentChamber === bulletPosition) {
      // Muerte
      losses++;
      streak = 0;
      messageEl.innerHTML = '💀 ¡BANG! 💀<br>HAS MUERTO... pero vuelves a intentarlo.';
      setHuskMessage('death');
      
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      
      // Efecto visual de muerte
      document.querySelector('.roulette-game').style.animation = 'neonPulse 1s';
      setTimeout(() => {
        document.querySelector('.roulette-game').style.animation = '';
      }, 1000);
      
    } else {
      // Sobrevive
      wins++;
      streak++;
      messageEl.innerHTML = `🔫 Click... ¡Sobreviviste!<br>Recámara ${currentChamber + 1} estaba vacía.`;
      setHuskMessage(currentChamber === 5 ? 'win' : 'safe');
      
      if (navigator.vibrate) navigator.vibrate(100);
      
      // Avanzar a la siguiente recámara
      currentChamber++;
      
      // Si llegó al final, reiniciar pero contar como victoria
      if (currentChamber >= 6) {
        messageEl.innerHTML += '<br>🎉 ¡Sobreviviste a todas las recámaras! Has ganado.';
        setHuskMessage('win');
        gameActive = false;
      } else {
        gameActive = true;
        shootBtn.disabled = false;
        spinBtn.disabled = false;
      }
    }
    
    updateStats();
    
    // Si el juego terminó, desactivar botones
    if (!gameActive) {
      shootBtn.disabled = true;
      spinBtn.disabled = true;
    }
  }
  
  // Nueva partida
  function newGame() {
    bulletPosition = Math.floor(Math.random() * 6);
    currentChamber = 0;
    gameActive = true;
    isSpinning = false;
    
    updateChambers();
    
    messageEl.textContent = '🔄 Nueva partida. Gira la recámara y dispara.';
    setHuskMessage('newGame');
    
    shootBtn.disabled = false;
    spinBtn.disabled = false;
    
    gunCylinder.classList.remove('spinning');
    
    if (navigator.vibrate) navigator.vibrate(50);
  }
  
  // Event listeners
  spinBtn.addEventListener('click', spinChamber);
  shootBtn.addEventListener('click', shoot);
  newGameBtn.addEventListener('click', newGame);
  
  // Inicializar
  updateChambers();
  updateStats();
  messageEl.textContent = '🔫 ¡Bienvenido a la ruleta rusa infernal!';
  setHuskMessage('newGame');
}

// ========== ACTUALIZAR LA INICIALIZACIÓN ==========
// Busca la función DOMContentLoaded y AÑADE initRoulette();

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔥 Iniciando Hazbin Experience...');
  initLoadingScreen();
  initAudio();
  initNavigation();
  initJukebox();
  initGallery();
  initBar();
  initHighLow();
  initBlackjack();
  initSlots();
  initDiceGame();
  initRoulette(); // <-- AÑADE ESTA LÍNEA
  initSecrets();
  initClock();
  checkAudioFiles();
});

// ========== FUNCIÓN #4: COCTELERÍA 3D INTERACTIVA ==========
function initCocktailLab() {
  // Elementos del DOM
  const liquid = document.getElementById('liquid');
  const iceCubes = document.getElementById('ice-cubes');
  const garnish = document.getElementById('garnish');
  const recipeDisplay = document.getElementById('recipe-display');
  const cocktailMessage = document.getElementById('cocktail-message');
  const huskComment = document.getElementById('husk-comment');
  const mixBtn = document.getElementById('mix-cocktail');
  const clearBtn = document.getElementById('clear-cocktail');
  const ingredientBtns = document.querySelectorAll('.ingredient-btn');
  const recipeCards = document.querySelectorAll('.recipe-card');
  
  // Estado del cóctel
  let currentCocktail = {
    base: null,
    mixer: null,
    extra: []
  };
  
  // Colores para las bebidas
  const liquidColors = {
    vodka: { base: '#3498db', name: 'Vodka' },
    whiskey: { base: '#8b4513', name: 'Whiskey' },
    rum: { base: '#d35400', name: 'Ron' },
    gin: { base: '#27ae60', name: 'Ginebra' },
    orange: { base: '#f39c12', name: 'Naranja' },
    cranberry: { base: '#c0392b', name: 'Arándano' },
    lime: { base: '#2ecc71', name: 'Limón' },
    cola: { base: '#7f8c8d', name: 'Cola' }
  };
  
  // Combinaciones especiales (recetas secretas)
  const specialRecipes = {
    'angel-kiss': {
      name: 'Angel\'s Kiss',
      ingredients: { base: 'vodka', mixer: 'cranberry', extra: ['cherry'] },
      color: '#ff69b4',
      message: '¡El beso de Angel! Dulce y peligroso como él.',
      husk: 'Husk: "Ese trago siempre lo pide Angel... es empalagoso."'
    },
    'husk-old': {
      name: 'Husk\'s Old Fashioned',
      ingredients: { base: 'whiskey', mixer: null, extra: ['sugar', 'orange'] },
      color: '#8b4513',
      message: 'Un clásico. Fuerte, amargo, como yo.',
      husk: 'Husk: "Mi favorito. Bien hecho."'
    },
    'alastor-radio': {
      name: 'Radio Demon',
      ingredients: { base: 'rum', mixer: 'cola', extra: ['lime'] },
      color: '#c0392b',
      message: '¡Esto es una transmisión especial! 🎙️',
      husk: 'Husk: "Alastor lo pide a veces. Es... inquietante."'
    },
    'charlie-hope': {
      name: 'La Esperanza de Charlie',
      ingredients: { base: 'gin', mixer: 'lime', extra: ['mint'] },
      color: '#27ae60',
      message: 'Refrescante y optimista. Como la princesa.',
      husk: 'Husk: "Charlie cree que esto redime almas. Yo solo lo sirvo."'
    }
  };
  
  // Frases de Husk para mezclas aleatorias
  const huskPhrases = {
    good: [
      'No está mal... para ser tu primer trago.',
      'Bebible. Y eso que lo hiciste tú.',
      'Tiene potencial. Como tú, supongo.',
      'Me recuerda a cuando yo empezaba.'
    ],
    bad: [
      '¿Esto es un chiste?',
      'Ni Angel se tomaría eso.',
      'Parece medicina para Alastor.',
      'Lo voy a tener que tirar.'
    ],
    perfect: [
      '¡Perfecto! Así se hace.',
      'Exactamente como a mí me gusta.',
      'Has nacido para esto.',
      'Te ganas un trago cortesía de la casa.'
    ]
  };
  
  // Actualizar la apariencia del vaso
  function updateGlass() {
    // Color del líquido
    let liquidColor = '#f0e68c'; // Color por defecto
    
    if (currentCocktail.base && liquidColors[currentCocktail.base]) {
      liquidColor = liquidColors[currentCocktail.base].base;
    }
    if (currentCocktail.mixer && liquidColors[currentCocktail.mixer]) {
      // Mezclar colores (simulación)
      const baseColor = liquidColor;
      const mixerColor = liquidColors[currentCocktail.mixer].base;
      liquidColor = mixColors(baseColor, mixerColor);
    }
    
    liquid.style.background = `linear-gradient(145deg, ${liquidColor}, ${adjustColor(liquidColor, -20)})`;
    
    // Altura del líquido (base + mixer = más líquido)
    let liquidHeight = 30; // Base
    if (currentCocktail.base) liquidHeight += 10;
    if (currentCocktail.mixer) liquidHeight += 10;
    if (currentCocktail.extra.length > 0) liquidHeight += 5;
    liquid.style.height = `${Math.min(liquidHeight, 80)}%`;
    
    // Hielo
    iceCubes.innerHTML = '';
    if (currentCocktail.extra.includes('ice')) {
      iceCubes.classList.add('has-ice');
      for (let i = 0; i < 3; i++) {
        const ice = document.createElement('div');
        ice.className = 'ice-cube';
        ice.style.left = `${20 + i * 15}px`;
        ice.style.animationDelay = `${i * 0.2}s`;
        iceCubes.appendChild(ice);
      }
    } else {
      iceCubes.classList.remove('has-ice');
    }
    
    // Decoración
    garnish.className = 'garnish';
    if (currentCocktail.extra.includes('cherry')) {
      garnish.classList.add('has-garnish', 'cherry');
    } else if (currentCocktail.extra.includes('mint')) {
      garnish.classList.add('has-garnish', 'mint');
    } else if (currentCocktail.extra.includes('orange')) {
      garnish.classList.add('has-garnish', 'orange');
    } else {
      garnish.classList.remove('has-garnish');
    }
    
    // Actualizar receta mostrada
    updateRecipeDisplay();
  }
  
  // Mezclar colores (simplificado)
  function mixColors(color1, color2) {
    // Extraer valores RGB (simplificado para demo)
    return color1; // Por ahora solo devolvemos el primer color
  }
  
  function adjustColor(color, percent) {
    return color; // Simplificado para demo
  }
  
  // Actualizar display de receta
  function updateRecipeDisplay() {
    const ingredients = [];
    if (currentCocktail.base) ingredients.push(liquidColors[currentCocktail.base].name);
    if (currentCocktail.mixer) ingredients.push(liquidColors[currentCocktail.mixer].name);
    if (currentCocktail.extra.length > 0) {
      const extraNames = currentCocktail.extra.map(e => {
        const names = { ice: 'Hielo', sugar: 'Azúcar', mint: 'Menta', cherry: 'Cereza', orange: 'Naranja' };
        return names[e] || e;
      });
      ingredients.push(...extraNames);
    }
    
    recipeDisplay.textContent = ingredients.length > 0 ? ingredients.join(' + ') : 'Vacío';
  }
  
  // Verificar si es una receta especial
  function checkSpecialRecipe() {
    for (const [key, recipe] of Object.entries(specialRecipes)) {
      const matches = 
        (!recipe.ingredients.base || currentCocktail.base === recipe.ingredients.base) &&
        (!recipe.ingredients.mixer || currentCocktail.mixer === recipe.ingredients.mixer) &&
        (!recipe.ingredients.extra || 
          recipe.ingredients.extra.every(e => currentCocktail.extra.includes(e)));
      
      if (matches) {
        return recipe;
      }
    }
    return null;
  }
  
  // Mezclar cóctel
  function mixCocktail() {
    if (!currentCocktail.base && !currentCocktail.mixer) {
      cocktailMessage.textContent = '❌ No hay nada que mezclar. Elige ingredientes.';
      huskComment.textContent = '😾 Husk: "¿Vas a mezclar aire?"';
      return;
    }
    
    const specialRecipe = checkSpecialRecipe();
    
    if (specialRecipe) {
      // Receta especial encontrada
      cocktailMessage.innerHTML = `🎉 ¡RECETA SECRETA: ${specialRecipe.name}!<br>${specialRecipe.message}`;
      huskComment.textContent = specialRecipe.husk;
      
      // Efecto especial
      document.querySelector('.glass-3d').style.animation = 'neonPulse 1s';
      setTimeout(() => {
        document.querySelector('.glass-3d').style.animation = '';
      }, 1000);
      
    } else {
      // Mezcla aleatoria
      const hasBase = !!currentCocktail.base;
      const hasMixer = !!currentCocktail.mixer;
      const extraCount = currentCocktail.extra.length;
      
      let quality = 'good';
      if (hasBase && hasMixer && extraCount >= 2) {
        quality = 'perfect';
      } else if (!hasBase || !hasMixer) {
        quality = 'bad';
      }
      
      const phrase = huskPhrases[quality][Math.floor(Math.random() * huskPhrases[quality].length)];
      
      if (quality === 'perfect') {
        cocktailMessage.innerHTML = '✨ ¡Cóctel perfecto! ✨<br>Tiene el balance ideal.';
      } else if (quality === 'bad') {
        cocktailMessage.innerHTML = '😿 El cóctel no quedó muy bien...<br>Faltan ingredientes.';
      } else {
        cocktailMessage.innerHTML = '🍸 Cóctel decente.<br>Podría ser peor. Podría ser mejor.';
      }
      
      huskComment.textContent = `😾 Husk: "${phrase}"`;
    }
    
    if (navigator.vibrate) navigator.vibrate(100);
  }
  
  // Limpiar vaso
  function clearGlass() {
    currentCocktail = {
      base: null,
      mixer: null,
      extra: []
    };
    
    // Deseleccionar todos los ingredientes
    ingredientBtns.forEach(btn => {
      btn.classList.remove('selected');
    });
    
    updateGlass();
    cocktailMessage.textContent = '🧼 Vaso limpio. ¿Qué vas a preparar?';
    huskComment.textContent = '😾 Husk: "Empieza de cero... como tu vida."';
    
    if (navigator.vibrate) navigator.vibrate(30);
  }
  
  // Manejar clic en ingredientes
  ingredientBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const ingredient = btn.dataset.ingredient;
      
      if (type === 'extra') {
        // Toggle para extras
        if (currentCocktail.extra.includes(ingredient)) {
          currentCocktail.extra = currentCocktail.extra.filter(i => i !== ingredient);
          btn.classList.remove('selected');
        } else {
          currentCocktail.extra.push(ingredient);
          btn.classList.add('selected');
        }
      } else {
        // Para base y mixer, solo uno de cada tipo
        if (type === 'base') {
          // Deseleccionar otras bases
          document.querySelectorAll('[data-type="base"]').forEach(b => b.classList.remove('selected'));
          currentCocktail.base = currentCocktail.base === ingredient ? null : ingredient;
        } else if (type === 'mixer') {
          document.querySelectorAll('[data-type="mixer"]').forEach(b => b.classList.remove('selected'));
          currentCocktail.mixer = currentCocktail.mixer === ingredient ? null : ingredient;
        }
        
        if (currentCocktail[type] === ingredient) {
          btn.classList.add('selected');
        }
      }
      
      updateGlass();
    });
  });
  
  // Manejar clic en recetas
  recipeCards.forEach(card => {
    card.addEventListener('click', () => {
      const recipe = specialRecipes[card.dataset.recipe];
      if (recipe) {
        // Limpiar todo
        clearGlass();
        
        // Aplicar receta
        if (recipe.ingredients.base) {
          currentCocktail.base = recipe.ingredients.base;
          document.querySelector(`[data-ingredient="${recipe.ingredients.base}"]`).classList.add('selected');
        }
        if (recipe.ingredients.mixer) {
          currentCocktail.mixer = recipe.ingredients.mixer;
          document.querySelector(`[data-ingredient="${recipe.ingredients.mixer}"]`).classList.add('selected');
        }
        if (recipe.ingredients.extra) {
          recipe.ingredients.extra.forEach(extra => {
            currentCocktail.extra.push(extra);
            document.querySelector(`[data-ingredient="${extra}"]`).classList.add('selected');
          });
        }
        
        updateGlass();
        cocktailMessage.textContent = `📖 Receta cargada: ${recipe.name}`;
        huskComment.textContent = '😾 Husk: "Siguiendo la receta... aburrido."';
      }
    });
  });
  
  // Event listeners
  mixBtn.addEventListener('click', mixCocktail);
  clearBtn.addEventListener('click', clearGlass);
  
  // Inicializar
  clearGlass();
}

// ========== ACTUALIZAR LA INICIALIZACIÓN ==========
// Busca la función DOMContentLoaded y AÑADE initCocktailLab();

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔥 Iniciando Hazbin Experience...');
  initLoadingScreen();
  initAudio();
  initNavigation();
  initJukebox();
  initGallery();
  initBar();
  initHighLow();
  initBlackjack();
  initSlots();
  initDiceGame();
  initRoulette();
  initCocktailLab(); // <-- AÑADE ESTA LÍNEA
  initSecrets();
  initClock();
  checkAudioFiles();
});

function initDuoIntro() {
  const text = "Este pequeño rincón del infierno es para ti...\nPorque incluso en el caos,\nalguien siempre se queda.";
  const introText = document.getElementById("intro-text");
  const enterBtn = document.getElementById("enter-btn");
  let i = 0;

  function type() {
    if (i < text.length) {
      introText.innerHTML += text.charAt(i) === "\n" ? "<br>" : text.charAt(i);
      i++;
      setTimeout(type, 40);
    } else {
      enterBtn.classList.remove("hidden");
    }
  }

  type();

  enterBtn.addEventListener("click", () => {
    document.getElementById("duo-intro").style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", initDuoIntro);

function duoReaction(context) {
  const reactions = {
    loserSong: [
      "Husk: No la pongas tan alto...",
      "Angel: Ay, ¿te pusiste sentimental?"
    ],
    blackjackWin: [
      "Angel: Wow, milagro estadístico.",
      "Husk: No te emociones."
    ],
    cocktailPerfect: [
      "Husk: Sorprendentemente decente.",
      "Angel: Oh cariño, tienes talento."
    ]
  };

  const lines = reactions[context];
  return lines[Math.floor(Math.random() * lines.length)];
}


// ========== FEEDBACK TÁCTIL ==========
document.querySelectorAll('button, .drink-item, .polaroid, .gallery-card').forEach(el => {
  el.addEventListener('touchstart', () => {
    el.style.transform = 'scale(0.98)';
  });
  el.addEventListener('touchend', () => {
    el.style.transform = '';
  });
  el.addEventListener('touchcancel', () => {
    el.style.transform = '';
  });
});

console.log('🔥 HAZBIN EXPERIENCE - VERSIÓN COMPLETA');
console.log('🎰 Función #1: TRAGAPERRAS INFERNAL');
console.log('🎲 Función #2: DADOS DE ANGEL');