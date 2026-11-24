/**
 * Purushothaman K. — Cybersecurity & Systems Portfolio Engine
 * Minimalist, Fast, Vanilla ES6+ // Zero External Dependencies
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     01. THEME ENGINE (SLIDING PILL TOGGLE)
     -------------------------------------------------------------------------- */
  const themePill = document.getElementById('theme-pill-toggle');

  function initTheme() {
    const savedTheme = localStorage.getItem('pk_portfolio_theme') || 'light';
    applyTheme(savedTheme, false);

    if (themePill) {
      themePill.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme, true);
      });
    }
  }

  function applyTheme(theme, notify = true) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pk_portfolio_theme', theme);

    if (notify) {
      showToast(theme === 'dark' ? 'Switched to Dark Theme' : 'Switched to Light Theme');
    }
  }

  /* --------------------------------------------------------------------------
     02. CUSTOM DUAL TRAILING CURSOR
     -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  function initCursor() {
    if (!cursorDot || !cursorRing) return;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    // Lerp loop for outer ring
    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    // Hover detection
    const hoverTargets = document.querySelectorAll('a, button, [role="button"], [data-hover="true"], input, textarea, .cipher-node');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* --------------------------------------------------------------------------
     03. WEB AUDIO SYNTHESIZER (ARCADE FX)
     -------------------------------------------------------------------------- */
  let audioCtx = null;
  let soundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.2) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  function playChirp(startFreq, endFreq, duration = 0.1) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  /* --------------------------------------------------------------------------
     04. INTERACTIVE CTF DEFENSE MATRIX (HERO DOCK)
     -------------------------------------------------------------------------- */
  let cipherStreak = 0;
  const securityLogs = {
    auth: [
      '[AUTH] PKI CERTIFICATE VALIDATED // SHA-256',
      '[AUTH] MUTUAL TLS HANDSHAKE OK // RSA-4096',
      '[AUTH] BIOMETRIC TOKEN ACCREDITED'
    ],
    crypt: [
      '[CRYPT] AES-GCM-256 SESSION KEY ROTATED',
      '[CRYPT] ELLIPTIC CURVE KEY-EXCHANGE COMPLETE',
      '[CRYPT] PAYLOAD DECRYPTION INTEGRITY VERIFIED'
    ],
    casb: [
      '[CASB] INGRESS PROXY INSPECTED // ZERO PII LEAKS',
      '[CASB] API CALL ROUTED THROUGH DISTILL BROKER',
      '[CASB] SHADOW IT ACCESS PREVENTED'
    ],
    zero: [
      '[ZERO-T] CONTINUOUS VERIFICATION PASSED',
      '[ZERO-T] LEAST-PRIVILEGE POLICY ENFORCED',
      '[ZERO-T] EPHEMERAL TOKEN EXPIRED & REVOKED'
    ]
  };

  function triggerDefenseNode(action) {
    const list = securityLogs[action];
    if (!list) return;

    cipherStreak++;
    const streakDisplay = document.getElementById('cipher-streak-count');
    if (streakDisplay) streakDisplay.textContent = cipherStreak;

    const logText = document.getElementById('cipher-log-text');
    const randomMsg = list[Math.floor(Math.random() * list.length)];
    if (logText) logText.textContent = randomMsg;

    // Visual Flash
    const node = document.querySelector(`.cipher-node[data-action="${action}"]`);
    if (node) {
      node.classList.add('active-flash');
      setTimeout(() => node.classList.remove('active-flash'), 180);
    }

    // Audio chirp
    if (action === 'auth') playChirp(440, 880, 0.08);
    else if (action === 'crypt') playChirp(320, 640, 0.08);
    else if (action === 'casb') playChirp(520, 1040, 0.08);
    else if (action === 'zero') playChirp(600, 1200, 0.08);
  }

  function initDefenseMatrix() {
    const nodes = document.querySelectorAll('.cipher-node');
    nodes.forEach((n) => {
      n.addEventListener('click', () => {
        const action = n.getAttribute('data-action');
        triggerDefenseNode(action);
      });
    });

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === '1') triggerDefenseNode('auth');
      else if (e.key === '2') triggerDefenseNode('crypt');
      else if (e.key === '3') triggerDefenseNode('casb');
      else if (e.key === '4') triggerDefenseNode('zero');
    });
  }

  /* --------------------------------------------------------------------------
     05. INTERACTIVE MINI-GAME: FIREWALL DEFENDER (FOOTER ARCADE)
     -------------------------------------------------------------------------- */
  function initFirewallGame() {
    const canvas = document.getElementById('firewall-game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const startBtn = document.getElementById('game-start-btn');
    const soundBtn = document.getElementById('game-sound-btn');
    const scoreVal = document.getElementById('game-score');
    const highVal = document.getElementById('game-high');
    const livesVal = document.getElementById('game-lives');

    let highScore = parseInt(localStorage.getItem('pk_high_score') || '0', 10);
    if (highVal) highVal.textContent = highScore.toString().padStart(4, '0');

    // Sound toggle button
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundBtn.textContent = soundEnabled ? 'FX: ON' : 'FX: OFF';
      });
    }

    // Game state
    let isRunning = false;
    let score = 0;
    let lives = 3;
    let animationId = null;

    // Canvas internal logical resolution
    const W = 640;
    const H = 300;
    canvas.width = W;
    canvas.height = H;

    // Paddle
    const paddle = {
      w: 84,
      h: 10,
      x: W / 2 - 42,
      y: H - 24,
      speed: 8,
      dx: 0
    };

    // Ball
    const ball = {
      x: W / 2,
      y: H - 40,
      r: 5,
      speed: 4.5,
      dx: 3,
      dy: -3.5
    };

    // Sparks
    let particles = [];
    function spawnSparks(x, y, color) {
      for (let i = 0; i < 8; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          life: 1,
          color
        });
      }
    }

    // Bricks
    const brickRows = 4;
    const brickCols = 8;
    const brickPadding = 6;
    const brickOffsetTop = 32;
    const brickOffsetLeft = 20;
    const brickW = Math.floor((W - (brickOffsetLeft * 2) - ((brickCols - 1) * brickPadding)) / brickCols);
    const brickH = 14;

    const rowColors = [
      '#8B3A2B', // Root (Terracotta)
      '#79543A', // Proxy (Primary Brown)
      '#66735A', // API (Accent Olive)
      '#C49A72'  // Token (Primary Accent)
    ];
    const rowPoints = [40, 30, 20, 10];

    let bricks = [];
    function buildBricks() {
      bricks = [];
      for (let r = 0; r < brickRows; r++) {
        for (let c = 0; c < brickCols; c++) {
          const bx = brickOffsetLeft + c * (brickW + brickPadding);
          const by = brickOffsetTop + r * (brickH + brickPadding);
          bricks.push({
            x: bx,
            y: by,
            w: brickW,
            h: brickH,
            status: 1,
            color: rowColors[r],
            points: rowPoints[r]
          });
        }
      }
    }

    function resetBall() {
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - 10;
      ball.dx = (Math.random() > 0.5 ? 1 : -1) * 3;
      ball.dy = -3.5;
    }

    function startGame() {
      if (isRunning) {
        // Pause
        isRunning = false;
        if (startBtn) startBtn.textContent = 'RESUME';
        return;
      }

      if (lives <= 0 || bricks.every(b => b.status === 0)) {
        // Restart fresh
        score = 0;
        lives = 3;
        buildBricks();
        resetBall();
        updateHUD();
      }

      isRunning = true;
      if (startBtn) startBtn.textContent = 'PAUSE';
      gameLoop();
    }

    if (startBtn) startBtn.addEventListener('click', startGame);

    function updateHUD() {
      if (scoreVal) scoreVal.textContent = score.toString().padStart(4, '0');
      if (livesVal) livesVal.textContent = lives.toString();
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('pk_high_score', highScore.toString());
        if (highVal) highVal.textContent = highScore.toString().padStart(4, '0');
      }
    }

    // Input handlers
    let rightPressed = false;
    let leftPressed = false;

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') rightPressed = true;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') leftPressed = true;
      if (e.code === 'Space' && document.activeElement === canvas) {
        e.preventDefault();
        startGame();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') rightPressed = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') leftPressed = false;
    });

    // Mouse / Touch paddle tracking
    function handlePointer(clientX) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const targetX = (clientX - rect.left) * scaleX - paddle.w / 2;
      paddle.x = Math.max(0, Math.min(W - paddle.w, targetX));
    }

    canvas.addEventListener('mousemove', (e) => {
      handlePointer(e.clientX);
    });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handlePointer(e.touches[0].clientX);
        e.preventDefault();
      }
    }, { passive: false });

    canvas.addEventListener('click', () => {
      if (!isRunning) startGame();
    });

    // Core Game Loop
    function gameLoop() {
      if (!isRunning) return;

      // Update paddle keyboard
      if (rightPressed && paddle.x < W - paddle.w) paddle.x += paddle.speed;
      if (leftPressed && paddle.x > 0) paddle.x -= paddle.speed;

      // Update ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collisions
      if (ball.x + ball.r > W) {
        ball.x = W - ball.r;
        ball.dx = -ball.dx;
        playTone(320, 'sine', 0.04);
      } else if (ball.x - ball.r < 0) {
        ball.x = ball.r;
        ball.dx = -ball.dx;
        playTone(320, 'sine', 0.04);
      }

      if (ball.y - ball.r < 0) {
        ball.y = ball.r;
        ball.dy = -ball.dy;
        playTone(360, 'sine', 0.04);
      }

      // Paddle collision
      if (
        ball.y + ball.r >= paddle.y &&
        ball.y - ball.r <= paddle.y + paddle.h &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.w &&
        ball.dy > 0
      ) {
        const hitOffset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        ball.dx = hitOffset * 4.5;
        ball.dy = -Math.abs(ball.dy);
        playTone(480, 'triangle', 0.06);
        spawnSparks(ball.x, paddle.y, '#288ca0');
      }

      // Brick collisions
      let remainingBricks = 0;
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        if (b.status === 1) {
          remainingBricks++;
          if (
            ball.x + ball.r > b.x &&
            ball.x - ball.r < b.x + b.w &&
            ball.y + ball.r > b.y &&
            ball.y - ball.r < b.y + b.h
          ) {
            ball.dy = -ball.dy;
            b.status = 0;
            score += b.points;
            updateHUD();
            playTone(600 + b.points * 10, 'sine', 0.08);
            spawnSparks(ball.x, ball.y, b.color);
            break;
          }
        }
      }

      // Check win
      if (remainingBricks === 0) {
        isRunning = false;
        playChirp(440, 1200, 0.4);
        if (startBtn) startBtn.textContent = 'PLAY AGAIN';
        drawWinScreen();
        return;
      }

      // Ball fell past paddle
      if (ball.y - ball.r > H) {
        lives--;
        updateHUD();
        playTone(180, 'sawtooth', 0.18, 0.3);

        if (lives > 0) {
          resetBall();
        } else {
          // Game Over
          isRunning = false;
          if (startBtn) startBtn.textContent = 'RETRY';
          drawGameOverScreen();
          return;
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // Render frame
      render();

      animationId = requestAnimationFrame(gameLoop);
    }

    function render() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const bgColor = isDark ? '#211C17' : '#FFFCF6';
      const primaryColor = isDark ? '#F1E8DC' : '#2B211B';
      const mutedColor = isDark ? '#B6A797' : '#76685C';
      const accentColor = isDark ? '#C49A72' : '#79543A';
      const oliveColor = isDark ? '#A5AD83' : '#66735A';

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      // Fine background grid
      ctx.strokeStyle = isDark ? 'rgba(196, 154, 114, 0.08)' : 'rgba(121, 84, 58, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Draw bricks
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        if (b.status === 1) {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);

          // Subtle glossy border
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        }
      }

      // Draw paddle
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 3);
      ctx.fill();

      // Paddle accent power core
      ctx.fillStyle = accentColor;
      ctx.fillRect(paddle.x + paddle.w / 2 - 8, paddle.y + 3, 16, 4);

      // Draw ball
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();

      // Draw sparks
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawGameOverScreen() {
      render();
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? 'rgba(23, 20, 17, 0.88)' : 'rgba(244, 239, 230, 0.88)';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = isDark ? '#F1E8DC' : '#2B211B';
      ctx.font = '22px "Playfair Display", serif';
      ctx.textAlign = 'center';
      ctx.fillText('FIREWALL BREACH DETECTED', W / 2, H / 2 - 12);

      ctx.fillStyle = isDark ? '#C49A72' : '#79543A';
      ctx.font = '11px "DM Mono", monospace';
      ctx.fillText(`FINAL SCORE: ${score} · CLICK OR PRESS START TO RETRY`, W / 2, H / 2 + 18);
    }

    function drawWinScreen() {
      render();
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? 'rgba(23, 20, 17, 0.88)' : 'rgba(244, 239, 230, 0.88)';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = isDark ? '#A5AD83' : '#66735A';
      ctx.font = '22px "Playfair Display", serif';
      ctx.textAlign = 'center';
      ctx.fillText('ALL FIREWALL LAYERS CLEARED!', W / 2, H / 2 - 12);

      ctx.fillStyle = isDark ? '#F1E8DC' : '#2B211B';
      ctx.font = '11px "DM Mono", monospace';
      ctx.fillText(`SCORE: ${score} · EXCELLENT DEFENSE PROTOCOL`, W / 2, H / 2 + 18);
    }

    // Initial setup
    buildBricks();
    resetBall();
    render();

    // Welcome overlay
    ctx.fillStyle = 'rgba(26, 23, 20, 0.05)';
    ctx.font = '12px "DM Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PRESS START TO ENGAGE FIREWALL DEFENDER', W / 2, H / 2 + 30);
  }

  /* --------------------------------------------------------------------------
     06. RADAR CANVAS ANIMATION (HERO ORBIT)
     -------------------------------------------------------------------------- */
  function initRadar() {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = w / 2 - 4;

      ctx.clearRect(0, 0, w, h);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const strokeColor = isDark ? 'rgba(196, 154, 114, 0.22)' : 'rgba(121, 84, 58, 0.22)';
      const sweepColor = isDark ? 'rgba(196, 154, 114, 0.55)' : 'rgba(121, 84, 58, 0.55)';

      // Concentric circles
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      [0.3, 0.6, 0.95].forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * ratio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Axis cross
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.stroke();

      // Sweeping line
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.strokeStyle = sweepColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r, 0);
      ctx.stroke();
      ctx.restore();

      angle += 0.035;
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* --------------------------------------------------------------------------
     07. TELEMETRY STREAM DIVIDERS (32 BARS)
     -------------------------------------------------------------------------- */
  function initWaveDividers() {
    const dividers = document.querySelectorAll('.section-wave-divider');
    dividers.forEach((div) => {
      div.innerHTML = '';
      for (let i = 0; i < 32; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar-unit';
        const delay = (i * 0.05).toFixed(2);
        const height = Math.floor(Math.sin(i / 5) * 35 + 50);
        bar.style.height = `${height}%`;
        bar.style.animationDelay = `${delay}s`;
        div.appendChild(bar);
      }
    });

    // Populate hero telemetry docks: #wave-left and #wave-right
    const waveLeft = document.getElementById('wave-left');
    const waveRight = document.getElementById('wave-right');
    [waveLeft, waveRight].forEach((container) => {
      if (!container) return;
      container.innerHTML = '';
      for (let i = 0; i < 18; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-mini-bar';
        const delay = (i * 0.08).toFixed(2);
        const height = Math.floor(Math.sin(i / 3) * 35 + 50);
        bar.style.height = `${height}%`;
        bar.style.animationDelay = `${delay}s`;
        container.appendChild(bar);
      }
    });
  }

  /* --------------------------------------------------------------------------
     08. NAVBAR SCROLL & ACTIVE LINKS
     -------------------------------------------------------------------------- */
  function initNavbar() {
    const nav = document.getElementById('site-nav');
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      if (nav) {
        if (scrollY > 30) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      }

      // Active section highlight
      let currentId = 'home';
      sections.forEach((sec) => {
        const top = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentId = sec.getAttribute('id');
        }
      });

      navItems.forEach((item) => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentId}`) {
          item.classList.add('active');
        }
      });
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     09. TOAST CONTROLLER
     -------------------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  /* --------------------------------------------------------------------------
     10. MODAL DIALOG CONTROLLER
     -------------------------------------------------------------------------- */
  const modal = document.getElementById('dialog-modal');
  const modalTitle = document.getElementById('dialog-title');
  const modalContent = document.getElementById('dialog-content');
  const modalClose = document.getElementById('dialog-close');

  function openModal(title, html) {
    if (!modal || !modalTitle || !modalContent) return;
    modalTitle.textContent = title;
    modalContent.innerHTML = html;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  /* --------------------------------------------------------------------------
     11. PROJECT SIMULATORS & SCHEMATICS
     -------------------------------------------------------------------------- */
  function initProjectModals() {
    // FLAMES Demo
    const flamesBtn = document.querySelector('.run-flames-modal-btn');
    if (flamesBtn) {
      flamesBtn.addEventListener('click', () => {
        const flamesHtml = `
          <div style="font-family: var(--font-sans);">
            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">
              Test the modular character-cancellation and circular indexing algorithm from Project 001.
            </p>
            <div class="sim-form-group">
              <label class="sim-label">First Name</label>
              <input type="text" id="flames-name1" class="sim-input" placeholder="e.g. Alan Turing" value="Alan Turing">
            </div>
            <div class="sim-form-group">
              <label class="sim-label">Second Name</label>
              <input type="text" id="flames-name2" class="sim-input" placeholder="e.g. Ada Lovelace" value="Ada Lovelace">
            </div>
            <button id="calc-flames-btn" class="btn-action-solid" style="width: 100%; margin-bottom: 16px;" data-hover="true">
              Execute Traversal ⚲
            </button>
            <div id="flames-output" class="sim-output-terminal">[System Ready] Enter names and execute calculation.</div>
          </div>
        `;
        openModal('FLAMES Web Application // Algorithm Simulator', flamesHtml);

        const calcBtn = document.getElementById('calc-flames-btn');
        if (calcBtn) {
          calcBtn.addEventListener('click', executeFlames);
        }
      });
    }

    // Bank System Demo
    let bankBalance = 15000.0;
    const bankBtn = document.querySelector('.run-bank-modal-btn');
    if (bankBtn) {
      bankBtn.addEventListener('click', () => {
        const bankHtml = `
          <div style="font-family: var(--font-sans);">
            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 16px;">
              Interactive console simulation of Project 002 (Java OOP Bank Account Entity).
            </p>
            <div style="padding: 12px; background: var(--bg-surface); border: 1px solid var(--border-primary); border-radius: 4px; margin-bottom: 16px; font-family: var(--font-mono); font-size: 13px;">
              Account: #PK-2027-SEC · Holder: Purushothaman K.<br>
              Encapsulated Balance: <span id="bank-bal-disp" style="color: var(--text-primary); font-weight: 700;">₹${bankBalance.toFixed(2)}</span>
            </div>
            <div class="sim-form-group">
              <label class="sim-label">Transaction Amount (₹)</label>
              <input type="number" id="bank-amt" class="sim-input" placeholder="Enter amount" value="2500">
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 16px;">
              <button id="bank-dep-btn" class="btn-action-solid" style="flex: 1;" data-hover="true">Deposit (+)</button>
              <button id="bank-wdr-btn" class="btn-action-outline" style="flex: 1;" data-hover="true">Withdraw (-)</button>
            </div>
            <div id="bank-output" class="sim-output-terminal">[JVM Environment initialized. Account verified.]</div>
          </div>
        `;
        openModal('Bank Management System // Java OOP Console Emulator', bankHtml);

        const depBtn = document.getElementById('bank-dep-btn');
        const wdrBtn = document.getElementById('bank-wdr-btn');
        const amtInput = document.getElementById('bank-amt');
        const balDisp = document.getElementById('bank-bal-disp');
        const output = document.getElementById('bank-output');

        if (depBtn && amtInput) {
          depBtn.addEventListener('click', () => {
            const val = parseFloat(amtInput.value);
            if (isNaN(val) || val <= 0) {
              output.textContent = '[ERROR: IllegalArgumentException] Deposit amount must be strictly positive.';
              return;
            }
            bankBalance += val;
            balDisp.textContent = `₹${bankBalance.toFixed(2)}`;
            output.textContent = `[SUCCESS] Deposited ₹${val.toFixed(2)}\nNew Balance: ₹${bankBalance.toFixed(2)}\nTransaction Logged: MUTATOR_GUARD_OK`;
          });
        }

        if (wdrBtn && amtInput) {
          wdrBtn.addEventListener('click', () => {
            const val = parseFloat(amtInput.value);
            if (isNaN(val) || val <= 0) {
              output.textContent = '[ERROR: IllegalArgumentException] Withdrawal amount must be strictly positive.';
              return;
            }
            if (val > bankBalance) {
              output.textContent = `[ERROR: InsufficientFundsException] Requested ₹${val.toFixed(2)} exceeds balance ₹${bankBalance.toFixed(2)}. Overdraft prevented.`;
              return;
            }
            bankBalance -= val;
            balDisp.textContent = `₹${bankBalance.toFixed(2)}`;
            output.textContent = `[SUCCESS] Withdrew ₹${val.toFixed(2)}\nRemaining Balance: ₹${bankBalance.toFixed(2)}\nEncapsulation check passed.`;
          });
        }
      });
    }

    // Schematic / Architecture SVG Viewers
    const schematicTriggers = document.querySelectorAll('.view-schematic-trigger');
    schematicTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const imgPath = trigger.getAttribute('data-img');
        const title = trigger.getAttribute('data-title') || 'Architectural Schematic';
        const modalHtml = `
          <div style="text-align: center;">
            <img src="${imgPath}" alt="${title}" style="max-width: 100%; height: auto; border: 1px solid var(--border-primary); border-radius: 4px; background: var(--bg-surface); padding: 12px;">
            <p style="margin-top: 12px; font-family: var(--font-mono); font-size: 11px; color: var(--text-dim); letter-spacing: 1.5px; text-transform: uppercase;">
              Schematic verified · SVG vector resolution
            </p>
          </div>
        `;
        openModal(title, modalHtml);
      });
    });
  }

  function executeFlames() {
    const n1 = document.getElementById('flames-name1').value.trim();
    const n2 = document.getElementById('flames-name2').value.trim();
    const output = document.getElementById('flames-output');
    if (!output) return;

    if (!n1 || !n2) {
      output.textContent = '[ERROR] Please enter both names to execute algorithm.';
      return;
    }

    let a = n1.toLowerCase().replace(/[^a-z]/g, '');
    let b = n2.toLowerCase().replace(/[^a-z]/g, '');

    const map1 = {};
    for (let char of a) map1[char] = (map1[char] || 0) + 1;
    const map2 = {};
    for (let char of b) map2[char] = (map2[char] || 0) + 1;

    let totalChars = a.length + b.length;
    let common = 0;
    for (let char in map1) {
      if (map2[char]) {
        common += Math.min(map1[char], map2[char]);
      }
    }
    const remCount = totalChars - (common * 2);

    let flames = [
      { key: 'F', label: 'Friends' },
      { key: 'L', label: 'Love' },
      { key: 'A', label: 'Affection' },
      { key: 'M', label: 'Marriage' },
      { key: 'E', label: 'Enemies' },
      { key: 'S', label: 'Siblings' }
    ];

    let log = `[ALGORITHM TRACE: FLAMES]\nInput 1: "${n1}" -> length ${a.length}\nInput 2: "${n2}" -> length ${b.length}\nCommon characters eliminated: ${common * 2}\nEffective count (N): ${remCount}\n\n`;

    if (remCount === 0) {
      log += `[RESULT] Perfect match! Outcome: SIBLINGS (default parity)`;
      output.textContent = log;
      return;
    }

    let ptr = 0;
    while (flames.length > 1) {
      ptr = (ptr + remCount - 1) % flames.length;
      const removed = flames.splice(ptr, 1)[0];
      log += `Step: Struck '${removed.key}' (${removed.label}) -> Remaining: ${flames.map(x => x.key).join('')}\n`;
    }

    const finalResult = flames[0];
    log += `\n[FINAL RESULT] Relationship: ${finalResult.label.toUpperCase()} (${finalResult.key})`;
    output.textContent = log;
  }

  /* --------------------------------------------------------------------------
     12. CONTACT ACTIONS & CLIPBOARD
     -------------------------------------------------------------------------- */
  function initContactActions() {
    const copyEmailBtn = document.getElementById('btn-copy-email');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        const email = 'purushothk1525@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(() => {
            showToast('Email copied to clipboard!');
            copyEmailBtn.textContent = 'COPIED!';
            setTimeout(() => {
              copyEmailBtn.textContent = 'COPY';
            }, 2000);
          }).catch(() => {
            fallbackCopy(email, copyEmailBtn);
          });
        } else {
          fallbackCopy(email, copyEmailBtn);
        }
      });
    }

    function fallbackCopy(text, btn) {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Email copied to clipboard!');
        btn.textContent = 'COPIED!';
        setTimeout(() => {
          btn.textContent = 'COPY';
        }, 2000);
      } catch (e) {
        showToast('Email: purushothk1525@gmail.com');
      }
    }
  }

  /* --------------------------------------------------------------------------
     13. INITIALIZATION LIFECYCLE
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCursor();
    initDefenseMatrix();
    initFirewallGame();
    initRadar();
    initWaveDividers();
    initNavbar();
    initProjectModals();
    initContactActions();
  });

})();
