/**
 * =============================================================================
 * 🎂 ИНТЕРАКТИВНАЯ ЛОГИКА САЙТА-ПОДАРКА НА 20-ЛЕТИЕ
 * =============================================================================
 */

(function () {
  'use strict';

  // Проверка наличия конфигурации
  const cfg = window.BIRTHDAY_CONFIG || (typeof BIRTHDAY_CONFIG !== 'undefined' ? BIRTHDAY_CONFIG : {});

  // ===========================================================================
  // 1. АУДИО-СИНТЕЗАТОР (WEB AUDIO API)
  // Работает автономно без внешних звуковых файлов, включается по клику
  // ===========================================================================
  const SoundFX = {
    audioCtx: null,
    enabled: true,

    init() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    },

    playClick() {
      if (!this.enabled || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.08);
      } catch (e) {}
    },

    playLightSwitch() {
      if (!this.enabled || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(850, this.audioCtx.currentTime);
        osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.12);
      } catch (e) {}
    },

    playCardFlip() {
      if (!this.enabled || !this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, this.audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.12);
      } catch (e) {}
    },

    playFanfare() {
      if (!this.enabled || !this.audioCtx) return;
      try {
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const startTime = this.audioCtx.currentTime + idx * 0.1;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.2, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
      } catch (e) {}
    }
  };


  // ===========================================================================
  // 2. УПРАВЛЕНИЕ НАВИГАЦИЕЙ И ЭКРАНАМИ (SPA)
  // ===========================================================================
  let currentScreen = 1;

  function goToScreen(stepNumber) {
    if (stepNumber < 1 || stepNumber > 3) return;
    currentScreen = stepNumber;

    SoundFX.init();
    SoundFX.playClick();

    // Переключение экранов
    document.querySelectorAll('.screen-view').forEach((view, idx) => {
      const step = idx + 1;
      if (step === stepNumber) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Обновление прогресс-бара в шапке
    document.querySelectorAll('.step-pill').forEach((pill) => {
      const pillStep = parseInt(pill.getAttribute('data-step'), 10);
      if (pillStep === stepNumber) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Смена темы оформления в шапке для экрана 3 (теплый фон)
    if (stepNumber === 3) {
      document.body.classList.add('theme-warm');
    } else {
      document.body.classList.remove('theme-warm');
    }

    // Специфические действия при входе на экран
    if (stepNumber === 2) {
      triggerPokerDealingAnimation();
    } else if (stepNumber === 3) {
      // Легкий приветственный салют при входе в фотогалерею
      setTimeout(() => Confetti.burst(window.innerWidth / 2, 200, 35), 400);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  // ===========================================================================
  // 3. ИНИЦИАЛИЗАЦИЯ И ДАННЫЕ ИЗ CONFIG.JS
  // ===========================================================================
  function populateContent() {
    // Шапка
    const sisterBadge = document.getElementById('headerSisterBadge');
    if (sisterBadge && cfg.sisterName) {
      sisterBadge.textContent = `${cfg.sisterName} • ${cfg.age || 20} лет`;
    }

    // --- ЭКРАН 1: МАФИЯ ---
    const s1 = cfg.screen1 || {};
    if (document.getElementById('s1Title')) document.getElementById('s1Title').textContent = s1.pageTitle || '';
    if (document.getElementById('s1Subtitle')) document.getElementById('s1Subtitle').textContent = s1.subtitle || '';

    // Карточка 1 (Брат)
    if (s1.card1) {
      if (document.getElementById('s1Card1Role')) document.getElementById('s1Card1Role').textContent = s1.card1.role || '';
      if (document.getElementById('s1Card1Quote')) document.getElementById('s1Card1Quote').textContent = s1.card1.quote || '';
      if (document.getElementById('s1Card1Status')) document.getElementById('s1Card1Status').textContent = s1.card1.status || '';
      if (s1.card1.coverImage && document.getElementById('s1Card1Cover')) document.getElementById('s1Card1Cover').src = s1.card1.coverImage;
      const realImg1 = s1.card1.realImage || s1.card1.image;
      if (realImg1 && document.getElementById('s1Card1Img')) document.getElementById('s1Card1Img').src = realImg1;
    }

    // Карточка 2 (Тётя)
    if (s1.card2) {
      if (document.getElementById('s1Card2Role')) document.getElementById('s1Card2Role').textContent = s1.card2.role || '';
      if (document.getElementById('s1Card2Quote')) document.getElementById('s1Card2Quote').textContent = s1.card2.quote || '';
      if (document.getElementById('s1Card2Status')) document.getElementById('s1Card2Status').textContent = s1.card2.status || '';
      if (s1.card2.coverImage && document.getElementById('s1Card2Cover')) document.getElementById('s1Card2Cover').src = s1.card2.coverImage;
      const realImg2 = s1.card2.realImage || s1.card2.image;
      if (realImg2 && document.getElementById('s1Card2Img')) document.getElementById('s1Card2Img').src = realImg2;
    }

    // Фонарик подсказка
    if (s1.flashlightHint && document.getElementById('flashlightHintText')) {
      document.getElementById('flashlightHintText').textContent = s1.flashlightHint;
    }

    // Скрытый протокол
    if (s1.hiddenLetter) {
      if (document.getElementById('s1LetterTitle')) document.getElementById('s1LetterTitle').textContent = s1.hiddenLetter.title || '';
      if (document.getElementById('s1LetterDate')) document.getElementById('s1LetterDate').textContent = s1.hiddenLetter.date || '';
      const pContainer = document.getElementById('s1Paragraphs');
      if (pContainer && s1.hiddenLetter.paragraphs) {
        pContainer.innerHTML = s1.hiddenLetter.paragraphs.map(p => {
          // Автоматическая очистка Unicode-зачеркивания (U+0336), чтобы на смартфонах не было квадратов
          let cleanText = p;
          if (cleanText.includes('\u0336') || cleanText.includes('\u0335')) {
            cleanText = cleanText.replace(/((?:[^\s\u0336\u0335][\u0336\u0335]+|\s+[\u0336\u0335]+)+)/gu, (match) => {
              const stripped = match.replace(/[\u0336\u0335]/gu, '');
              return `<s>${stripped}</s>`;
            });
          }
          return `<p>${cleanText}</p>`;
        }).join('');
      }
    }

    if (s1.nextButtonText && document.getElementById('s1NextBtnText')) {
      document.getElementById('s1NextBtnText').textContent = s1.nextButtonText;
    }

    // --- ЭКРАН 2: ПОКЕР ---
    const s2 = cfg.screen2 || {};
    if (document.getElementById('s2Title')) document.getElementById('s2Title').textContent = s2.pageTitle || '';
    if (document.getElementById('s2Subtitle')) document.getElementById('s2Subtitle').textContent = s2.subtitle || '';
    if (s2.nextButtonText && document.getElementById('s2NextBtnText')) {
      document.getElementById('s2NextBtnText').textContent = s2.nextButtonText;
    }

    // Генерация покерных карт
    renderPokerCards(s2.cards || []);

    // --- ЭКРАН 3: ГАЛЕРЕЯ ВОСПОМИНАНИЙ ---
    const s3 = cfg.screen3 || {};
    if (document.getElementById('s3TopTitle')) document.getElementById('s3TopTitle').textContent = s3.topTitle || '';
    if (document.getElementById('s3TopSubtitle')) document.getElementById('s3TopSubtitle').textContent = s3.topSubtitle || '';
    if (document.getElementById('s3DividerTitle')) document.getElementById('s3DividerTitle').textContent = s3.dividerTitle || '';
    if (document.getElementById('s3DividerSubtitle')) document.getElementById('s3DividerSubtitle').textContent = s3.dividerSubtitle || '';

    // Слайдер
    renderCarousel(s3.carouselPhotos || []);

    // Статичные полароиды
    renderStaticPhotos(s3.staticPhotos || []);

    // Финальный блок
    if (s3.finalBlock) {
      if (document.getElementById('s3FinalTitle')) document.getElementById('s3FinalTitle').textContent = s3.finalBlock.title || '';
      if (document.getElementById('s3FinalText')) document.getElementById('s3FinalText').textContent = s3.finalBlock.text || '';
      if (document.getElementById('s3ConfettiBtnText')) document.getElementById('s3ConfettiBtnText').textContent = s3.finalBlock.confettiButtonText || '';
      if (document.getElementById('s3RestartBtnText')) document.getElementById('s3RestartBtnText').textContent = s3.finalBlock.restartButtonText || '';
    }
  }


  // ===========================================================================
  // 4. ЭКРАН 1: ЛОГИКА ФОНАРИКА И ОСВЕЩЕНИЯ ТЕКСТА
  // ===========================================================================
  let isFlashlightActive = false;
  let isFullLightOn = false;
  const flashlightDock = document.getElementById('flashlightDock');
  const hiddenTextContainer = document.getElementById('hiddenTextContainer');
  const flashlightStatusBadge = document.getElementById('flashlightStatusBadge');
  const toggleFullLightBtn = document.getElementById('toggleFullLightBtn');
  const fullLightBtnText = document.getElementById('fullLightBtnText');

  function toggleFlashlight(forceState) {
    SoundFX.init();
    SoundFX.playLightSwitch();

    isFlashlightActive = typeof forceState === 'boolean' ? forceState : !isFlashlightActive;

    if (isFlashlightActive) {
      document.body.classList.add('flashlight-active');
      if (flashlightStatusBadge) flashlightStatusBadge.textContent = 'СТАТУС: В РУКЕ 🔦';
      
      // Позиционируем свет по центру контейнера для мгновенного эффекта
      if (hiddenTextContainer) {
        const rect = hiddenTextContainer.getBoundingClientRect();
        updateSpotlightPos(rect.width / 2, rect.height / 2);
      }
    } else {
      document.body.classList.remove('flashlight-active');
      if (flashlightStatusBadge) flashlightStatusBadge.textContent = 'СТАТУС: ВЫКЛЮЧЕН';
      updateSpotlightPos(-500, -500);
    }
  }

  function updateSpotlightPos(x, y) {
    if (!hiddenTextContainer) return;
    hiddenTextContainer.style.setProperty('--spotlight-x', `${x}px`);
    hiddenTextContainer.style.setProperty('--spotlight-y', `${y}px`);
    hiddenTextContainer.style.setProperty('--spotlight-radius', `140px`);
  }

  // Обработка движения мыши и тач-событий пальцем
  function handlePointerMove(e) {
    if (!isFlashlightActive || !hiddenTextContainer) return;

    const rect = hiddenTextContainer.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    if (typeof clientX === 'undefined' || typeof clientY === 'undefined') return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    updateSpotlightPos(x, y);
  }

  // Глобальное отслеживание курсора когда фонарик активен
  document.addEventListener('mousemove', (e) => {
    if (isFlashlightActive && currentScreen === 1) {
      handlePointerMove(e);
    }
  });

  if (flashlightDock) {
    flashlightDock.addEventListener('click', () => toggleFlashlight());
  }

  if (hiddenTextContainer) {
    hiddenTextContainer.addEventListener('mousemove', handlePointerMove);
    hiddenTextContainer.addEventListener('touchmove', handlePointerMove, { passive: true });
    hiddenTextContainer.addEventListener('touchstart', (e) => {
      if (!isFlashlightActive) {
        toggleFlashlight(true);
      }
      handlePointerMove(e);
    }, { passive: true });

    // Клик по темной зоне, если фонарик еще не взят — автоматическое включение
    hiddenTextContainer.addEventListener('click', () => {
      if (!isFlashlightActive) {
        toggleFlashlight(true);
      }
    });
  }

  // Кнопка включения полного света (на случай если лень водить фонариком)
  if (toggleFullLightBtn) {
    toggleFullLightBtn.addEventListener('click', () => {
      SoundFX.init();
      SoundFX.playLightSwitch();
      isFullLightOn = !isFullLightOn;
      if (isFullLightOn) {
        document.body.classList.add('full-light-on');
        fullLightBtnText.textContent = 'Выключить верхний свет';
      } else {
        document.body.classList.remove('full-light-on');
        fullLightBtnText.textContent = 'Включить верхний свет';
      }
    });
  }

  // Кнопка «Дальше в казино»
  const s1NextBtn = document.getElementById('s1NextBtn');
  if (s1NextBtn) {
    s1NextBtn.addEventListener('click', () => goToScreen(2));
  }

  // Интерактивное вскрытие ролей карт Мафии и Шерифа (3D переворот)
  const roleCard1 = document.getElementById('roleCard1');
  if (roleCard1) {
    roleCard1.addEventListener('click', () => {
      SoundFX.init();
      SoundFX.playCardFlip();
      roleCard1.classList.toggle('is-revealed');
    });
  }

  const roleCard2 = document.getElementById('roleCard2');
  if (roleCard2) {
    roleCard2.addEventListener('click', () => {
      SoundFX.init();
      SoundFX.playCardFlip();
      roleCard2.classList.toggle('is-revealed');
    });
  }


  // ===========================================================================
  // 5. ЭКРАН 2: ЛОГИКА ПОКЕРНОГО СТОЛА И КАРТ
  // ===========================================================================
  let flippedCount = 0;
  const cardsRow = document.getElementById('pokerCardsRow');
  const cardsFlippedCounter = document.getElementById('cardsFlippedCounter');
  const pokerComboBanner = document.getElementById('pokerComboBanner');
  const redealBtn = document.getElementById('redealBtn');
  const pokerDeckStack = document.getElementById('pokerDeckStack');
  const cardDetailDrawer = document.getElementById('cardDetailDrawer');
  const drawerCardBadge = document.getElementById('drawerCardBadge');
  const drawerCardTitle = document.getElementById('drawerCardTitle');
  const drawerCardWish = document.getElementById('drawerCardWish');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function renderPokerCards(cards) {
    if (!cardsRow) return;
    cardsRow.innerHTML = '';
    flippedCount = 0;

    cards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'poker-card-item';
      cardEl.setAttribute('data-id', card.id);
      cardEl.setAttribute('data-index', index);

      const suitColorClass = card.suitName || (card.suit === '♥' || card.suit === '♦' ? 'hearts' : 'spades');

      cardEl.innerHTML = `
        <div class="poker-card-inner">
          <div class="poker-card-face poker-card-back">
            <img src="images/card_back.svg" alt="Рубашка карты">
          </div>
          <div class="poker-card-face poker-card-front ${suitColorClass}">
            <div class="card-top-index">
              <span class="card-rank">${card.rank}</span>
              <span class="card-suit">${card.suit}</span>
            </div>
            <div class="card-center-body">
              <div class="card-center-suit">${card.suit}</div>
              <div class="card-front-title">${card.title}</div>
              <span class="card-tap-hint">Нажми 👆</span>
            </div>
            <div class="card-bottom-index">
              <span class="card-rank">${card.rank}</span>
              <span class="card-suit">${card.suit}</span>
            </div>
          </div>
        </div>
      `;

      cardEl.addEventListener('click', () => handleCardClick(cardEl, card));
      cardsRow.appendChild(cardEl);
    });

    updateFlippedCounter();
  }

  function handleCardClick(cardEl, cardData) {
    SoundFX.init();
    SoundFX.playCardFlip();

    const isAlreadyFlipped = cardEl.classList.contains('flipped');
    cardEl.classList.toggle('flipped');

    if (!isAlreadyFlipped) {
      flippedCount++;
      // Небольшой всплеск конфетти над картой
      const rect = cardEl.getBoundingClientRect();
      Confetti.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
    }

    updateFlippedCounter();

    // Открываем модальную плашку с полным текстом открытой карты
    showCardDrawer(cardData);

    // Если все 5 карт перевернуты — Royal Flush!
    const totalCards = (cfg.screen2 && cfg.screen2.cards) ? cfg.screen2.cards.length : 5;
    if (flippedCount >= totalCards) {
      if (pokerComboBanner) pokerComboBanner.classList.add('visible');
      SoundFX.playFanfare();
      setTimeout(() => {
        Confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
      }, 300);
    }
  }

  function updateFlippedCounter() {
    const total = (cfg.screen2 && cfg.screen2.cards) ? cfg.screen2.cards.length : 5;
    if (cardsFlippedCounter) {
      cardsFlippedCounter.textContent = `Открыто карт: ${flippedCount} / ${total}`;
    }
  }

  function showCardDrawer(cardData) {
    if (!cardDetailDrawer) return;
    if (drawerCardBadge) drawerCardBadge.textContent = `${cardData.rank} ${cardData.suit}`;
    if (drawerCardTitle) drawerCardTitle.textContent = cardData.title;
    if (drawerCardWish) drawerCardWish.textContent = cardData.wish;
    cardDetailDrawer.classList.add('open');
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', () => {
      cardDetailDrawer.classList.remove('open');
    });
  }

  // Анимация раздачи карт из колоды
  function triggerPokerDealingAnimation() {
    if (!cardsRow) return;
    const cards = cardsRow.querySelectorAll('.poker-card-item');
    cards.forEach((card, idx) => {
      card.style.opacity = '0';
      card.style.transform = 'translate(120px, 140px) scale(0.6) rotate(15deg)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.opacity = '1';
        card.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
        SoundFX.playCardFlip();
      }, 150 + idx * 160);
    });
  }

  // Перераздать карты
  function resetAndRedeal() {
    SoundFX.init();
    SoundFX.playClick();
    if (pokerComboBanner) pokerComboBanner.classList.remove('visible');
    if (cardDetailDrawer) cardDetailDrawer.classList.remove('open');
    const cards = cardsRow.querySelectorAll('.poker-card-item');
    cards.forEach(c => c.classList.remove('flipped'));
    flippedCount = 0;
    updateFlippedCounter();
    triggerPokerDealingAnimation();
  }

  if (redealBtn) redealBtn.addEventListener('click', resetAndRedeal);
  if (pokerDeckStack) pokerDeckStack.addEventListener('click', resetAndRedeal);

  // Навигация экрана 2
  const s2BackBtn = document.getElementById('s2BackBtn');
  const s2NextBtn = document.getElementById('s2NextBtn');
  if (s2BackBtn) s2BackBtn.addEventListener('click', () => goToScreen(1));
  if (s2NextBtn) s2NextBtn.addEventListener('click', () => goToScreen(3));


  // ===========================================================================
  // 6. ЭКРАН 3: ДИНАМИЧЕСКАЯ КРУГОВАЯ КАРУСЕЛЬ И ПОЛАРОИДЫ
  // ===========================================================================
  let activeCarouselIndex = 0;
  let rawCarouselPhotos = [];
  let carouselDisplayList = [];
  const carouselStage = document.getElementById('carouselStage');
  const carouselDots = document.getElementById('carouselDots');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');
  const staticPhotosGrid = document.getElementById('staticPhotosGrid');

  function renderCarousel(photos) {
    if (!carouselStage || !photos || photos.length === 0) return;
    rawCarouselPhotos = photos;
    carouselStage.innerHTML = '';
    if (carouselDots) carouselDots.innerHTML = '';

    // Для бесшовного кругового вращения нужно минимум 6 карточек на сцене
    carouselDisplayList = [...photos];
    while (carouselDisplayList.length < 6) {
      carouselDisplayList = carouselDisplayList.concat(photos);
    }

    activeCarouselIndex = 0;

    // Создаем карточки на сцене
    carouselDisplayList.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'carousel-card';
      card.setAttribute('data-index', idx);

      card.innerHTML = `
        <div class="card-img-box">
          <img src="${photo.src}" alt="${photo.title}" loading="lazy">
        </div>
        <div class="card-info-box">
          <h3 class="card-info-title">${photo.title}</h3>
          <p class="card-info-caption">${photo.caption}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        if (card.classList.contains('pos-center')) {
          // Клик по центральной активной карточке открывает просмотр на весь экран
          openLightbox(photo.src, `${photo.title} — ${photo.caption}`);
        } else {
          // Клик по боковой карточке плавно поворачивает ее в центр
          SoundFX.init();
          SoundFX.playClick();
          activeCarouselIndex = idx;
          updateCarouselPositions();
        }
      });

      carouselStage.appendChild(card);
    });

    // Точки пагинации для оригинальных фоток
    if (carouselDots) {
      photos.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          SoundFX.init();
          SoundFX.playClick();
          activeCarouselIndex = idx;
          updateCarouselPositions();
        });
        carouselDots.appendChild(dot);
      });
    }

    updateCarouselPositions();
  }

  function updateCarouselPositions() {
    if (!carouselStage) return;
    const cards = carouselStage.querySelectorAll('.carousel-card');
    const total = cards.length;
    if (total === 0) return;

    cards.forEach((card, idx) => {
      // Вычисляем кратчайшее циклическое расстояние от активного элемента
      let diff = idx - activeCarouselIndex;
      while (diff > total / 2) diff -= total;
      while (diff < -total / 2) diff += total;

      card.classList.remove('pos-center', 'pos-right', 'pos-left', 'pos-far-right', 'pos-far-left', 'pos-hidden');

      if (diff === 0) {
        card.classList.add('pos-center');
      } else if (diff === 1) {
        card.classList.add('pos-right');
      } else if (diff === -1) {
        card.classList.add('pos-left');
      } else if (diff === 2) {
        card.classList.add('pos-far-right');
      } else if (diff === -2) {
        card.classList.add('pos-far-left');
      } else {
        card.classList.add('pos-hidden');
      }
    });

    // Обновляем активную точку
    if (carouselDots && rawCarouselPhotos.length > 0) {
      const realIdx = ((activeCarouselIndex % rawCarouselPhotos.length) + rawCarouselPhotos.length) % rawCarouselPhotos.length;
      const dots = carouselDots.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === realIdx);
      });
    }
  }

  function stepCarousel(direction) {
    if (carouselDisplayList.length === 0) return;
    SoundFX.init();
    SoundFX.playClick();
    const total = carouselDisplayList.length;
    activeCarouselIndex = (activeCarouselIndex + direction + total) % total;
    updateCarouselPositions();
  }

  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', () => stepCarousel(-1));
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', () => stepCarousel(1));
  }

  // Поддержка свайпов на смартфонах и планшетах
  let touchStartX = 0;
  let touchEndX = 0;
  const photoCarousel = document.getElementById('photoCarousel');
  if (photoCarousel) {
    photoCarousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    photoCarousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const threshold = 35;
    if (touchEndX < touchStartX - threshold) {
      stepCarousel(1); // свайп влево -> вращение вправо
    } else if (touchEndX > touchStartX + threshold) {
      stepCarousel(-1); // свайп вправо -> вращение влево
    }
  }

  // Рендер статичных фото-полароидов
  function renderStaticPhotos(photos) {
    if (!staticPhotosGrid) return;
    staticPhotosGrid.innerHTML = '';

    photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      const rotation = photo.rotation || (idx % 2 === 0 ? '-3deg' : '3deg');
      card.style.transform = `rotate(${rotation})`;

      card.innerHTML = `
        <div class="polaroid-img-box" title="Нажми для увеличения">
          <img src="${photo.src}" alt="${photo.title}" loading="lazy">
        </div>
        <div class="polaroid-caption">
          <h3 class="polaroid-title">${photo.title}</h3>
          <p class="polaroid-text">${photo.caption}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightbox(photo.src, `${photo.title}: ${photo.caption}`);
      });

      staticPhotosGrid.appendChild(card);
    });
  }


  // ===========================================================================
  // 7. LIGHTBOX (УВЕЛИЧЕНИЕ ФОТОГРАФИЙ)
  // ===========================================================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  function openLightbox(src, caption) {
    if (!lightboxModal) return;
    SoundFX.init();
    SoundFX.playClick();
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });


  // ===========================================================================
  // 8. САЛЮТ И ПРАЗДНИЧНЫЙ КОНФЕТТИ (CANVAS СИСТЕМА ЧАСТИЦ)
  // ===========================================================================
  const Confetti = {
    canvas: document.getElementById('confettiCanvas'),
    ctx: null,
    particles: [],
    animId: null,

    init() {
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    burst(x, y, count = 50) {
      this.init();
      const colors = ['#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#fef08a'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.particles.push({
          x: x || window.innerWidth / 2,
          y: y || window.innerHeight / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: Math.random() * 7 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          life: 1,
          decay: Math.random() * 0.012 + 0.008
        });
      }

      if (!this.animId) {
        this.loop();
      }
    },

    loop() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18; // Гравитация
        p.vx *= 0.98; // Сопротивление воздуха
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = p.life;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  };

  // Кнопки салюта и рестарта
  const fireConfettiBtn = document.getElementById('fireConfettiBtn');
  if (fireConfettiBtn) {
    fireConfettiBtn.addEventListener('click', () => {
      SoundFX.init();
      SoundFX.playFanfare();
      // Серия залпов с разных сторон
      Confetti.burst(window.innerWidth * 0.3, window.innerHeight * 0.5, 60);
      setTimeout(() => Confetti.burst(window.innerWidth * 0.7, window.innerHeight * 0.5, 60), 200);
      setTimeout(() => Confetti.burst(window.innerWidth * 0.5, window.innerHeight * 0.3, 80), 400);
    });
  }

  const restartQuestBtn = document.getElementById('restartQuestBtn');
  if (restartQuestBtn) {
    restartQuestBtn.addEventListener('click', () => {
      SoundFX.init();
      SoundFX.playClick();
      // Сброс фонарика и карт
      toggleFlashlight(false);
      resetAndRedeal();
      goToScreen(1);
    });
  }


  // ===========================================================================
  // 9. КНОПКА ЗВУКА И НАВИГАЦИОННЫЕ ПИЛЛЫ
  // ===========================================================================
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      SoundFX.init();
      SoundFX.enabled = !SoundFX.enabled;
      soundToggleBtn.querySelector('.sound-icon').textContent = SoundFX.enabled ? '🔊' : '🔇';
      soundToggleBtn.style.opacity = SoundFX.enabled ? '1' : '0.5';
    });
  }

  document.querySelectorAll('.step-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      const step = parseInt(pill.getAttribute('data-step'), 10);
      goToScreen(step);
    });
  });


  // ===========================================================================
  // 10. ЗАПУСК ПРИ ЗАГРУЗКЕ
  // ===========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    populateContent();
    Confetti.init();
  });

})();
