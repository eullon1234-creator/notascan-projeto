import './style.css';
import { icons } from './icons.js';
import {
  isChaveValida, formatChave, formatCNPJ, parseChave, findChave,
  extractFromText, CATEGORIAS, guessCategoria, categoriaById,
  fmtBRL, fmtData, fmtAnoMes, consultaUrl
} from './nfe.js';
import {
  loadOpenCV, cvReady, detectDocument, warpDocument,
  applyFilter, FILTERS, rotateCanvas, defaultQuad, fileToCanvas, canvasToBlob
} from './scanner.js';
import { detectCodes, interpretCodes, runOCR } from './reader.js';
import { listNotas, getNota, saveNota, deleteNota, findByChave, requestPersistence } from './db.js';
import { exportCSV, exportPDF } from './exporter.js';

// Estado global da aplicação
const state = {
  tab: 'notas', // 'notas' | 'dashboard'
  notas: [],
  filtroMes: 'todos',
  filtroCat: 'todas',
  busca: '',
  // Câmera & Scanner
  stream: null,
  capturedCanvas: null,
  cropQuad: null,
  activeFilter: 'magic',
  processedCanvas: null,
};

const appEl = document.getElementById('app');
const dlg = document.getElementById('dlg');
const toastsEl = document.getElementById('toasts');
let deferredInstallPrompt = null;

const isAppInstalled = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  document.getElementById('btn-install-app')?.setAttribute('hidden', '');
  showToast('NotaScan instalado com sucesso!', 'success');
});

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error) => console.warn('Não foi possível ativar o modo instalável', error));
  });
}

// Fallback do modern-web-guidance para <dialog closedby="any">
if (!('closedBy' in HTMLDialogElement.prototype)) {
  dlg.addEventListener('click', (event) => {
    if (event.target !== dlg) return;
    const rect = dlg.getBoundingClientRect();
    const isInside = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInside) dlg.close();
  });
}

// Utilitário de Notificação Toast
export function showToast(message, type = 'info', duration = 3500) {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const iconSvg = type === 'success' ? icons.check : (type === 'error' ? icons.alert : icons.sparkle);
  t.innerHTML = `${iconSvg} <span>${message}</span>`;
  toastsEl.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(10px)';
    setTimeout(() => t.remove(), 250);
  }, duration);
}

// Inicialização
async function init() {
  await requestPersistence();
  // Carrega OpenCV em segundo plano sem bloquear a inicialização da UI
  loadOpenCV().catch(() => console.log('OpenCV será carregado sob demanda'));
  await reloadNotas();
  render();
}

async function reloadNotas() {
  state.notas = await listNotas();
}

// ---------------- RENDERIZAÇÃO DA TELA PRINCIPAL ----------------

function render() {
  appEl.innerHTML = `
    <header class="app-header">
      <div class="brand">
        <div class="brand-icon">${icons.logo}</div>
        <div class="brand-text">
          <h1>NotaScan</h1>
          <p>Scanner Fiscal Inteligente</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary btn-install" id="btn-install-app" ${isAppInstalled() ? 'hidden' : ''}>
          ${icons.install} <span>Instalar app</span>
        </button>
        <button class="btn btn-secondary" id="btn-import-file" title="Importar foto ou documento">
          ${icons.upload} <span>Importar</span>
        </button>
        <button class="btn btn-secondary" id="btn-export-menu" title="Exportar dados">
          ${icons.download} <span>Exportar</span>
        </button>
      </div>
    </header>

    ${renderStats()}

    <div class="section-header">
      <h2 class="section-title">Minhas Notas Fiscais</h2>
      <div class="search-box">
        ${icons.search}
        <input type="text" id="input-search" placeholder="Buscar emitente, chave..." value="${escapeHtml(state.busca)}">
      </div>
    </div>

    ${renderFilters()}
    ${renderList()}

    <nav class="bottom-bar" aria-label="Navegação principal">
      <button class="bottom-tab ${state.tab === 'notas' ? 'active' : ''}" id="tab-notas">
        ${icons.file} <span>Notas</span>
      </button>
      <button class="btn-scan-hero" id="btn-open-camera">
        ${icons.camera} <span>Escanear</span>
      </button>
      <button class="bottom-tab ${state.tab === 'dashboard' ? 'active' : ''}" id="tab-dash">
        ${icons.trend} <span>Resumo</span>
      </button>
    </nav>
  `;

  bindMainEvents();
}

function renderStats() {
  const filtered = getFilteredNotas();
  const total = filtered.reduce((acc, n) => acc + (Number(n.valor) || 0), 0);
  const media = filtered.length > 0 ? total / filtered.length : 0;

  // Categoria mais frequente
  const catCounts = {};
  filtered.forEach(n => { catCounts[n.categoria] = (catCounts[n.categoria] || 0) + 1; });
  const topCatId = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'outros';
  const topCat = categoriaById(topCatId);

  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">
          <span>Total Escaneado</span>
          ${icons.sheet}
        </div>
        <div class="stat-value">${fmtBRL(total)}</div>
        <div class="stat-sub">${filtered.length} nota${filtered.length === 1 ? '' : 's'} no filtro</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          <span>Ticket Médio</span>
          ${icons.sparkle}
        </div>
        <div class="stat-value">${fmtBRL(media)}</div>
        <div class="stat-sub">Média por documento</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          <span>Categoria Principal</span>
          ${icons.building}
        </div>
        <div class="stat-value" style="font-size: 1.35rem; color: ${topCat.cor}">
          ${topCat.nome}
        </div>
        <div class="stat-sub">Mais recorrente</div>
      </div>
    </div>
  `;
}

function renderFilters() {
  // Gera lista única de meses disponíveis
  const meses = Array.from(new Set(state.notas.map(n => n.anoMes).filter(Boolean))).sort().reverse();

  let mesChips = `<button class="chip ${state.filtroMes === 'todos' ? 'active' : ''}" data-mes="todos">Todos os meses</button>`;
  meses.forEach(m => {
    mesChips += `<button class="chip ${state.filtroMes === m ? 'active' : ''}" data-mes="${m}">${fmtAnoMes(m)}</button>`;
  });

  let catChips = `<button class="chip ${state.filtroCat === 'todas' ? 'active' : ''}" data-cat="todas">Todas categorias</button>`;
  CATEGORIAS.forEach(c => {
    catChips += `<button class="chip ${state.filtroCat === c.id ? 'active' : ''}" data-cat="${c.id}" style="${state.filtroCat === c.id ? `border-color: ${c.cor}; color: ${c.cor}` : ''}">${c.nome}</button>`;
  });

  return `
    <div class="filter-chips">${mesChips}</div>
    <div class="filter-chips" style="margin-top: -8px;">${catChips}</div>
  `;
}

function renderList() {
  const notas = getFilteredNotas();

  if (notas.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-icon">${icons.scan}</div>
        <h3>Nenhuma nota fiscal encontrada</h3>
        <p>Aponte a câmera para um cupom fiscal (NFC-e) ou DANFE (NF-e) para escanear com corte automático e OCR.</p>
        <button class="btn btn-primary" id="btn-empty-scan">${icons.camera} Escanear Agora</button>
      </div>
    `;
  }

  return `
    <div class="notas-grid">
      ${notas.map(nota => {
        const cat = categoriaById(nota.categoria);
        const thumbUrl = nota.thumbBlob ? URL.createObjectURL(nota.thumbBlob) : null;
        return `
          <div class="nota-card" data-id="${nota.id}">
            <div class="nota-thumb">
              ${thumbUrl ? `<img src="${thumbUrl}" alt="Miniatura da nota" loading="lazy">` : icons.file}
            </div>
            <div class="nota-info">
              <div>
                <div class="nota-top">
                  <h4 class="nota-emitente" title="${escapeHtml(nota.emitente || 'Sem nome')}">${escapeHtml(nota.emitente || 'Emitente não identificado')}</h4>
                  <span class="nota-badge" style="background: ${cat.cor}22; color: ${cat.cor}">${nota.modelo === '65' ? 'NFC-e' : (nota.modelo === '55' ? 'NF-e' : 'DOC')}</span>
                </div>
                <div class="nota-meta">
                  <span>${fmtData(nota.dataEmissao)}</span>
                  ${nota.cnpj ? ` • ${formatCNPJ(nota.cnpj)}` : ''}
                </div>
              </div>
              <div class="nota-bottom">
                <span class="nota-valor">${fmtBRL(nota.valor)}</span>
                <span class="nota-tag">
                  <span class="nota-tag-dot" style="background: ${cat.cor}"></span>
                  ${cat.nome}
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function getFilteredNotas() {
  return state.notas.filter(n => {
    if (state.filtroMes !== 'todos' && n.anoMes !== state.filtroMes) return false;
    if (state.filtroCat !== 'todas' && n.categoria !== state.filtroCat) return false;
    if (state.busca) {
      const q = state.busca.toLowerCase();
      const matchEmit = (n.emitente || '').toLowerCase().includes(q);
      const matchChave = (n.chave || '').includes(q.replace(/\s/g, ''));
      const matchCnpj = (n.cnpj || '').includes(q.replace(/\D/g, ''));
      if (!matchEmit && !matchChave && !matchCnpj) return false;
    }
    return true;
  });
}

function bindMainEvents() {
  document.getElementById('btn-install-app')?.addEventListener('click', installApp);

  // Abas
  document.getElementById('tab-notas')?.addEventListener('click', () => { state.tab = 'notas'; render(); });
  document.getElementById('tab-dash')?.addEventListener('click', () => { showDashboardModal(); });

  // Abertura do Scanner de Câmera
  document.getElementById('btn-open-camera')?.addEventListener('click', openCameraScanner);
  document.getElementById('btn-empty-scan')?.addEventListener('click', openCameraScanner);

  // Importar arquivo
  document.getElementById('btn-import-file')?.addEventListener('click', triggerFileSelect);

  // Menu de Exportação
  document.getElementById('btn-export-menu')?.addEventListener('click', showExportModal);

  // Filtros de mês
  document.querySelectorAll('[data-mes]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filtroMes = btn.getAttribute('data-mes');
      render();
    });
  });

  // Filtros de categoria
  document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filtroCat = btn.getAttribute('data-cat');
      render();
    });
  });

  // Busca
  const inputSearch = document.getElementById('input-search');
  inputSearch?.addEventListener('input', (e) => {
    state.busca = e.target.value;
    // Debounce leve
    clearTimeout(inputSearch._t);
    inputSearch._t = setTimeout(() => render(), 220);
  });

  // Detalhes da nota
  document.querySelectorAll('.nota-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const nota = state.notas.find(n => n.id === id);
      if (nota) showNotaDetails(nota);
    });
  });
}

async function installApp() {
  if (isAppInstalled()) {
    showToast('O NotaScan já está instalado neste aparelho.', 'info');
    return;
  }

  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') showToast('Instalação iniciada!', 'success');
    else showToast('Instalação cancelada. Você pode tentar novamente pelo menu do navegador.', 'info');
    deferredInstallPrompt = null;
    return;
  }

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const instructions = isIOS
    ? '<p>No Safari, toque em <strong>Compartilhar</strong> e depois em <strong>Adicionar à Tela de Início</strong>.</p>'
    : '<p>Abra o menu do navegador e escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>. Se a opção não aparecer, abra esta página no Safari (iPhone) ou Chrome (Android) usando o endereço HTTPS publicado do app.</p>';

  dlg.innerHTML = `
    <div class="dlg-header">
      <h2 id="dlg-title">Instalar NotaScan</h2>
      <button class="btn btn-icon btn-secondary" id="btn-close-dlg" aria-label="Fechar">${icons.x}</button>
    </div>
    <div class="dlg-body install-help">
      <div class="install-help-icon">${icons.install}</div>
      ${instructions}
      <p class="install-help-note">Depois de instalado, o NotaScan abre como um app e mantém suas notas neste aparelho.</p>
    </div>
    <div class="dlg-footer"><button class="btn btn-primary" id="btn-close-install">Entendi</button></div>
  `;
  dlg.showModal();
  dlg.querySelector('#btn-close-dlg').onclick = () => dlg.close();
  dlg.querySelector('#btn-close-install').onclick = () => dlg.close();
}

// ---------------- MÓDULO DE CÂMERA & ESCANEAMENTO ----------------

async function openCameraScanner() {
  const overlay = document.createElement('div');
  overlay.className = 'scanner-overlay';
  overlay.id = 'scanner-view';
  overlay.innerHTML = `
    <div class="scanner-header">
      <button class="btn btn-icon btn-secondary" id="btn-close-scanner" aria-label="Fechar câmera">${icons.x}</button>
      <span class="scanner-title">Posicione a Nota Fiscal</span>
      <button class="btn btn-icon btn-secondary" id="btn-toggle-torch" style="display: none;" aria-label="Lanterna">${icons.bolt}</button>
    </div>
    <div class="scanner-viewport">
      <video id="scanner-video" playsinline autoplay muted></video>
      <canvas class="overlay-canvas" id="scanner-canvas"></canvas>
      <div class="scan-laser"></div>
    </div>
    <div class="scanner-controls">
      <button class="btn btn-icon btn-secondary" id="btn-pick-image" title="Carregar da galeria">${icons.image}</button>
      <button class="shutter-btn" id="btn-shutter" aria-label="Tirar foto">
        <div class="shutter-btn-inner"></div>
      </button>
      <button class="btn btn-icon btn-secondary" id="btn-manual-key" title="Digitar chave manualmente">${icons.keyboard}</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const video = overlay.querySelector('#scanner-video');
  const canvas = overlay.querySelector('#scanner-canvas');
  const btnClose = overlay.querySelector('#btn-close-scanner');
  const btnShutter = overlay.querySelector('#btn-shutter');
  const btnTorch = overlay.querySelector('#btn-toggle-torch');
  const btnPick = overlay.querySelector('#btn-pick-image');
  const btnManual = overlay.querySelector('#btn-manual-key');

  let stream = null;
  let animId = null;
  let track = null;
  let torchOn = false;

  const closeScanner = () => {
    if (animId) cancelAnimationFrame(animId);
    if (stream) stream.getTracks().forEach(t => t.stop());
    overlay.remove();
  };

  btnClose.addEventListener('click', closeScanner);
  btnPick.addEventListener('click', () => {
    closeScanner();
    triggerFileSelect();
  });
  btnManual.addEventListener('click', () => {
    closeScanner();
    showManualEntryModal();
  });

  // Inicia câmera traseira com foco
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    });
    video.srcObject = stream;
    await video.play();

    track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities ? track.getCapabilities() : {};
    if (capabilities.torch) {
      btnTorch.style.display = 'inline-flex';
      btnTorch.addEventListener('click', async () => {
        torchOn = !torchOn;
        await track.applyConstraints({ advanced: [{ torch: torchOn }] });
        btnTorch.style.color = torchOn ? '#fbbf24' : '#fff';
      });
    }

    // Loop de detecção ao vivo de bordas e QR Code
    let frameCount = 0;
    const ctx = canvas.getContext('2d');
    const detectLoop = async () => {
      if (!video.videoWidth) {
        animId = requestAnimationFrame(detectLoop);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frameCount++;
      // A cada 30 quadros tenta detectar se há QR Code direto no fluxo
      if (frameCount % 30 === 0) {
        detectCodes(video).then(codes => {
          if (codes.length > 0) {
            const parsed = interpretCodes(codes);
            if (parsed.chave || parsed.qrUrl) {
              // Notifica detecção rápida
              showToast('Código de barras / QR identificado!', 'success');
            }
          }
        }).catch(() => {});
      }

      animId = requestAnimationFrame(detectLoop);
    };
    animId = requestAnimationFrame(detectLoop);

  } catch (err) {
    showToast('Não foi possível acessar a câmera: ' + err.message, 'error');
    closeScanner();
    triggerFileSelect();
    return;
  }

  // Disparo / Foto
  btnShutter.addEventListener('click', async () => {
    const snap = document.createElement('canvas');
    snap.width = video.videoWidth;
    snap.height = video.videoHeight;
    snap.getContext('2d').drawImage(video, 0, 0);
    closeScanner();
    openCropEditor(snap);
  });
}

function triggerFileSelect() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,application/pdf';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      showToast('Carregando imagem...', 'info', 1500);
      const canvas = await fileToCanvas(file);
      openCropEditor(canvas);
    } catch (err) {
      showToast('Erro ao abrir imagem: ' + err.message, 'error');
    }
  };
  input.click();
}

// ---------------- EDITOR DE RECORTE & PERSPECTIVA (CROP) ----------------

function openCropEditor(sourceCanvas) {
  state.capturedCanvas = sourceCanvas;
  const overlay = document.createElement('div');
  overlay.className = 'scanner-overlay';
  overlay.id = 'crop-view';
  overlay.innerHTML = `
    <div class="scanner-header">
      <button class="btn btn-icon btn-secondary" id="btn-cancel-crop">${icons.back}</button>
      <span class="scanner-title">Ajuste as Bordas</span>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-icon btn-secondary" id="btn-rotate" title="Girar 90°">${icons.rotR}</button>
        <button class="btn btn-primary" id="btn-apply-crop">
          <span>Avançar</span> ${icons.chevR}
        </button>
      </div>
    </div>
    <div class="crop-canvas-wrapper" id="crop-wrapper">
      <canvas id="crop-canvas"></canvas>
    </div>
    <div class="crop-toolbar">
      <button class="btn btn-secondary" id="btn-full-doc">${icons.expand} Imagem Completa</button>
      <button class="btn btn-secondary" id="btn-auto-detect">${icons.auto} Auto Detectar</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const canvas = overlay.querySelector('#crop-canvas');
  const wrapper = overlay.querySelector('#crop-wrapper');
  const ctx = canvas.getContext('2d');

  // Tenta detecção com OpenCV se pronto, ou cria quad padrão com margem
  let detected = null;
  if (cvReady()) {
    try { detected = detectDocument(sourceCanvas); } catch { /* fallback */ }
  }
  state.cropQuad = detected || defaultQuad(sourceCanvas.width, sourceCanvas.height, 0.05);

  let activeHandle = null;

  function drawCrop() {
    // Redimensiona o canvas para caber na tela mantendo proporção
    const r = wrapper.getBoundingClientRect();
    const scale = Math.min((r.width - 32) / sourceCanvas.width, (r.height - 32) / sourceCanvas.height);
    canvas.width = Math.round(sourceCanvas.width * scale);
    canvas.height = Math.round(sourceCanvas.height * scale);

    ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);

    const pts = state.cropQuad.map(p => ({ x: p.x * scale, y: p.y * scale }));

    // Desenha polígono de seleção semi-transparente
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Desenha os 4 manipuladores de cantos (estilo CamScanner)
    pts.forEach((p, idx) => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Interação de toque / mouse para arrastar os cantos
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scale = canvas.width / sourceCanvas.width;
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale
    };
  }

  const onPointerDown = (e) => {
    const pos = getPos(e);
    // Encontra ponto mais próximo em um raio de 45px
    let minDist = 50;
    activeHandle = null;
    state.cropQuad.forEach((p, idx) => {
      const d = Math.hypot(p.x - pos.x, p.y - pos.y);
      if (d < minDist) {
        minDist = d;
        activeHandle = idx;
      }
    });
  };

  const onPointerMove = (e) => {
    if (activeHandle === null) return;
    e.preventDefault();
    const pos = getPos(e);
    state.cropQuad[activeHandle] = {
      x: Math.max(0, Math.min(sourceCanvas.width, pos.x)),
      y: Math.max(0, Math.min(sourceCanvas.height, pos.y)),
    };
    drawCrop();
  };

  const onPointerUp = () => { activeHandle = null; };

  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp);

  drawCrop();
  window.addEventListener('resize', drawCrop);

  // Botões
  overlay.querySelector('#btn-cancel-crop').onclick = () => overlay.remove();

  overlay.querySelector('#btn-rotate').onclick = () => {
    sourceCanvas = rotateCanvas(sourceCanvas, true);
    state.capturedCanvas = sourceCanvas;
    state.cropQuad = defaultQuad(sourceCanvas.width, sourceCanvas.height, 0.05);
    drawCrop();
  };

  overlay.querySelector('#btn-full-doc').onclick = () => {
    state.cropQuad = defaultQuad(sourceCanvas.width, sourceCanvas.height, 0);
    drawCrop();
  };

  overlay.querySelector('#btn-auto-detect').onclick = async () => {
    showToast('Detectando bordas...', 'info', 1000);
    await loadOpenCV();
    const det = detectDocument(sourceCanvas);
    if (det) {
      state.cropQuad = det;
      drawCrop();
    } else {
      showToast('Bordas automáticas não encontradas, use os cantos manuais', 'info');
    }
  };

  overlay.querySelector('#btn-apply-crop').onclick = async () => {
    showToast('Processando recorte...', 'info', 1000);
    const warped = warpDocument(sourceCanvas, state.cropQuad);
    overlay.remove();
    openFilterEditor(warped);
  };
}

// ---------------- EDITOR DE FILTROS & PROCESSAMENTO OCR ----------------

function openFilterEditor(warpedCanvas) {
  state.processedCanvas = warpedCanvas;
  const overlay = document.createElement('div');
  overlay.className = 'scanner-overlay';
  overlay.id = 'filter-view';
  overlay.innerHTML = `
    <div class="scanner-header">
      <button class="btn btn-icon btn-secondary" id="btn-back-crop">${icons.back}</button>
      <span class="scanner-title">Melhoria & OCR</span>
      <button class="btn btn-primary" id="btn-start-ocr">
        ${icons.sparkle} <span>Reconhecer</span>
      </button>
    </div>
    <div class="crop-canvas-wrapper" id="filter-wrapper">
      <canvas id="filter-canvas"></canvas>
    </div>
    <div class="filter-bar" id="filter-chips-bar">
      ${FILTERS.map(f => `
        <button class="filter-thumb-btn ${state.activeFilter === f.id ? 'active' : ''}" data-filter="${f.id}">
          <div class="filter-thumb-preview" id="thumb-${f.id}"></div>
          <span>${f.nome}</span>
        </button>
      `).join('')}
    </div>
  `;
  document.body.appendChild(overlay);

  const canvas = overlay.querySelector('#filter-canvas');
  const wrapper = overlay.querySelector('#filter-wrapper');

  function renderFiltered() {
    const filtered = applyFilter(warpedCanvas, state.activeFilter);
    state.processedCanvas = filtered;

    const r = wrapper.getBoundingClientRect();
    const scale = Math.min((r.width - 32) / filtered.width, (r.height - 32) / filtered.height);
    canvas.width = Math.round(filtered.width * scale);
    canvas.height = Math.round(filtered.height * scale);
    canvas.getContext('2d').drawImage(filtered, 0, 0, canvas.width, canvas.height);
  }

  // Previews nos botões de filtro
  FILTERS.forEach(f => {
    const thumbContainer = overlay.querySelector(`#thumb-${f.id}`);
    if (thumbContainer) {
      const mini = document.createElement('canvas');
      mini.width = 60; mini.height = 60;
      mini.getContext('2d').drawImage(warpedCanvas, 0, 0, 60, 60);
      const styled = applyFilter(mini, f.id);
      thumbContainer.appendChild(styled);
    }
  });

  renderFiltered();

  // Seleção de filtros
  overlay.querySelectorAll('[data-filter]').forEach(btn => {
    btn.onclick = () => {
      overlay.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.getAttribute('data-filter');
      renderFiltered();
    };
  });

  overlay.querySelector('#btn-back-crop').onclick = () => {
    overlay.remove();
    openCropEditor(state.capturedCanvas);
  };

  overlay.querySelector('#btn-start-ocr').onclick = async () => {
    await processExtractionAndSave(state.processedCanvas, overlay);
  };
}

// ---------------- PIPELINE DE EXTRAÇÃO (BARCODE/QR + OCR) ----------------

async function processExtractionAndSave(finalCanvas, overlayToRemove) {
  // Modal de progresso
  dlg.innerHTML = `
    <div class="dlg-header">
      <h2 id="dlg-title">Extraindo Dados Fiscais</h2>
    </div>
    <div class="dlg-body" style="text-align: center; padding: 32px 20px;">
      <div class="spinner" style="width: 44px; height: 44px; margin: 0 auto 18px; border-width: 3px;"></div>
      <p id="ocr-status-text" style="font-weight: 600; font-size: 1rem;">Lendo código de barras / QR Code...</p>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" id="ocr-progress" style="width: 15%;"></div>
      </div>
    </div>
  `;
  dlg.showModal();

  const statusText = dlg.querySelector('#ocr-status-text');
  const progressFill = dlg.querySelector('#ocr-progress');

  try {
    // 1. Barcode & QR Code Scan
    const codes = await detectCodes(finalCanvas);
    const barcodeData = interpretCodes(codes);
    progressFill.style.width = '45%';
    statusText.innerText = 'Executando OCR em português...';

    // 2. Tesseract OCR
    const ocrText = await runOCR(finalCanvas, (m) => {
      if (m.status === 'recognizing text' && m.progress) {
        const pct = Math.round(45 + m.progress * 50);
        progressFill.style.width = `${pct}%`;
        statusText.innerText = `Lendo texto da nota (${Math.round(m.progress * 100)}%)...`;
      }
    });

    progressFill.style.width = '100%';
    statusText.innerText = 'Consolidando informações...';

    // 3. Mescla dados fiscais (QR tem prioridade sobre OCR)
    const ocrExtracted = extractFromText(ocrText);
    const chave = barcodeData.chave || ocrExtracted.chave;
    const parsedChave = parseChave(chave);

    const nota = {
      id: 'nota_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      criadoEm: Date.now(),
      chave: chave || null,
      modelo: parsedChave?.modelo || (barcodeData.qrUrl ? '65' : (chave ? '55' : '65')),
      serie: parsedChave?.serie || '',
      numero: parsedChave?.numero || '',
      uf: parsedChave?.uf || '',
      anoMes: parsedChave?.anoMes || (ocrExtracted.dataEmissao?.slice(0, 7)) || new Date().toISOString().slice(0, 7),
      cnpj: parsedChave?.cnpj || barcodeData.cnpj || ocrExtracted.cnpj || '',
      emitente: ocrExtracted.emitente || (barcodeData.qrUrl ? 'NFC-e Emitida' : 'DANFE'),
      dataEmissao: barcodeData.dataEmissao || ocrExtracted.dataEmissao || new Date().toISOString().slice(0, 10),
      valor: barcodeData.valor ?? ocrExtracted.valor ?? 0,
      categoria: guessCategoria(ocrExtracted.emitente || ''),
      qrUrl: barcodeData.qrUrl || null,
      textoOCR: ocrText,
      observacao: '',
    };

    // Gera miniatura comprimida e imagem completa
    const thumbCanvas = document.createElement('canvas');
    const scale = 360 / Math.max(finalCanvas.width, finalCanvas.height);
    thumbCanvas.width = Math.round(finalCanvas.width * scale);
    thumbCanvas.height = Math.round(finalCanvas.height * scale);
    thumbCanvas.getContext('2d').drawImage(finalCanvas, 0, 0, thumbCanvas.width, thumbCanvas.height);

    nota.thumbBlob = await canvasToBlob(thumbCanvas, 'image/jpeg', 0.8);
    nota.imagem = await canvasToBlob(finalCanvas, 'image/jpeg', 0.85);

    dlg.close();
    if (overlayToRemove) overlayToRemove.remove();

    // Abre formulário para confirmação
    showEditNotaModal(nota, true);

  } catch (err) {
    dlg.close();
    showToast('Falha na extração de dados: ' + err.message, 'error');
  }
}

// ---------------- MODAL DE EDIÇÃO & CONFIRMAÇÃO DA NOTA ----------------

async function showEditNotaModal(nota, isNew = false) {
  // Se for nova, checa se já existe nota com essa chave no banco
  let isDup = false;
  if (nota.chave) {
    const existing = await findByChave(nota.chave);
    if (existing && existing.id !== nota.id) isDup = true;
  }

  dlg.innerHTML = `
    <div class="dlg-header">
      <h2 id="dlg-title">${isNew ? 'Confirmar Nota Fiscal' : 'Editar Nota Fiscal'}</h2>
      <button class="btn btn-icon btn-secondary" id="btn-close-dlg">${icons.x}</button>
    </div>
    <div class="dlg-body">
      ${isDup ? `
        <div style="background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.4); border-radius: var(--radius-md); padding: 12px; margin-bottom: 16px; font-size: 0.85rem; color: #fca5a5;">
          ${icons.alert} <strong>Atenção:</strong> Já existe uma nota salva com esta mesma chave de acesso!
        </div>
      ` : ''}

      <div class="form-group">
        <label for="edit-emitente">Emitente / Estabelecimento</label>
        <input type="text" id="edit-emitente" value="${escapeHtml(nota.emitente || '')}" placeholder="Nome do mercado, loja...">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="edit-valor">Valor Total (R$)</label>
          <input type="number" step="0.01" id="edit-valor" value="${nota.valor || 0}">
        </div>
        <div class="form-group">
          <label for="edit-data">Data de Emissão</label>
          <input type="date" id="edit-data" value="${nota.dataEmissao || ''}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="edit-categoria">Categoria</label>
          <select id="edit-categoria">
            ${CATEGORIAS.map(c => `<option value="${c.id}" ${nota.categoria === c.id ? 'selected' : ''}>${c.nome}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="edit-cnpj">CNPJ</label>
          <input type="text" id="edit-cnpj" value="${formatCNPJ(nota.cnpj || '')}" placeholder="00.000.000/0000-00">
        </div>
      </div>

      <div class="form-group">
        <label for="edit-chave">Chave de Acesso (44 dígitos)</label>
        <input type="text" id="edit-chave" value="${formatChave(nota.chave || '')}" placeholder="Ex: 3524 0912 3456 ...">
        <small id="chave-status" style="display: block; margin-top: 4px; font-size: 0.75rem; color: var(--text-muted);"></small>
      </div>

      <div class="form-group">
        <label for="edit-obs">Observações</label>
        <textarea id="edit-obs" rows="2" placeholder="Detalhes, reembolsável, etc.">${escapeHtml(nota.observacao || '')}</textarea>
      </div>
    </div>
    <div class="dlg-footer">
      <button class="btn btn-secondary" id="btn-cancel-edit">Cancelar</button>
      <button class="btn btn-primary" id="btn-save-nota">
        ${icons.check} <span>Salvar Nota</span>
      </button>
    </div>
  `;

  dlg.showModal();

  const editChave = dlg.querySelector('#edit-chave');
  const chaveStatus = dlg.querySelector('#chave-status');
  const updateChaveHint = () => {
    const raw = editChave.value.replace(/\D/g, '');
    if (!raw) { chaveStatus.innerText = ''; return; }
    if (isChaveValida(raw)) {
      chaveStatus.innerHTML = '<span style="color: #34d399;">✓ Chave válida (DV correto)</span>';
    } else {
      chaveStatus.innerHTML = `<span style="color: #f87171;">Chave incompleta ou com dígito verificador inválido (${raw.length}/44)</span>`;
    }
  };
  editChave.addEventListener('input', updateChaveHint);
  updateChaveHint();

  dlg.querySelector('#btn-close-dlg').onclick = () => dlg.close();
  dlg.querySelector('#btn-cancel-edit').onclick = () => dlg.close();

  dlg.querySelector('#btn-save-nota').onclick = async () => {
    nota.emitente = dlg.querySelector('#edit-emitente').value.trim();
    nota.valor = Number(dlg.querySelector('#edit-valor').value) || 0;
    nota.dataEmissao = dlg.querySelector('#edit-data').value;
    nota.anoMes = nota.dataEmissao ? nota.dataEmissao.slice(0, 7) : new Date().toISOString().slice(0, 7);
    nota.categoria = dlg.querySelector('#edit-categoria').value;
    nota.cnpj = dlg.querySelector('#edit-cnpj').value.replace(/\D/g, '');
    nota.observacao = dlg.querySelector('#edit-obs').value.trim();

    const cleanCh = editChave.value.replace(/\s/g, '');
    if (cleanCh) {
      nota.chave = cleanCh;
      const parsed = parseChave(cleanCh);
      if (parsed) {
        nota.modelo = parsed.modelo;
        nota.serie = parsed.serie;
        nota.numero = parsed.numero;
        nota.uf = parsed.uf;
      }
    }

    await saveNota(nota);
    dlg.close();
    showToast('Nota salva com sucesso!', 'success');
    await reloadNotas();
    render();
  };
}

// ---------------- MODAL DE DETALHES DA NOTA ----------------

function showNotaDetails(nota) {
  const cat = categoriaById(nota.categoria);
  const imgUrl = nota.imagem ? URL.createObjectURL(nota.imagem) : null;
  const linkPortal = consultaUrl(nota);

  dlg.innerHTML = `
    <div class="dlg-header">
      <h2 id="dlg-title">${escapeHtml(nota.emitente || 'Detalhes da Nota')}</h2>
      <button class="btn btn-icon btn-secondary" id="btn-close-dlg">${icons.x}</button>
    </div>
    <div class="dlg-body">
      ${imgUrl ? `
        <div style="max-height: 260px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 18px; border: 1px solid var(--border-subtle); display: flex; justify-content: center; background: #020617;">
          <img src="${imgUrl}" alt="Documento escaneado" style="max-height: 260px; width: auto; object-fit: contain;">
        </div>
      ` : ''}

      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px;">
        <span style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--accent-emerald);">
          ${fmtBRL(nota.valor)}
        </span>
        <span class="nota-badge" style="background: ${cat.cor}22; color: ${cat.cor}; font-size: 0.8rem; padding: 4px 10px;">
          ${cat.nome}
        </span>
      </div>

      <div style="font-size: 0.85rem; line-height: 1.8; color: var(--text-muted); background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div><strong>Data de Emissão:</strong> ${fmtData(nota.dataEmissao)}</div>
        ${nota.cnpj ? `<div><strong>CNPJ:</strong> ${formatCNPJ(nota.cnpj)}</div>` : ''}
        ${nota.modelo ? `<div><strong>Modelo:</strong> ${nota.modelo === '65' ? 'NFC-e (Consumidor)' : (nota.modelo === '55' ? 'NF-e (DANFE)' : nota.modelo)}</div>` : ''}
        ${nota.numero ? `<div><strong>Número / Série:</strong> ${nota.numero} (série ${nota.serie || '1'})</div>` : ''}
        ${nota.uf ? `<div><strong>UF:</strong> ${nota.uf}</div>` : ''}
        ${nota.observacao ? `<div><strong>Observações:</strong> ${escapeHtml(nota.observacao)}</div>` : ''}
      </div>

      ${nota.chave ? `
        <div style="margin-top: 14px; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Chave de Acesso</span>
            <button class="btn btn-secondary" id="btn-copy-chave" style="padding: 4px 10px; font-size: 0.75rem;">
              ${icons.copy} Copiar
            </button>
          </div>
          <div style="font-family: monospace; font-size: 0.8rem; word-break: break-all; color: #fff;">
            ${formatChave(nota.chave)}
          </div>
        </div>
      ` : ''}
    </div>
    <div class="dlg-footer" style="justify-content: space-between;">
      <button class="btn btn-danger" id="btn-delete-nota">
        ${icons.trash} Excluir
      </button>
      <div style="display: flex; gap: 8px;">
        ${linkPortal ? `
          <a class="btn btn-secondary" href="${linkPortal}" target="_blank" rel="noopener noreferrer">
            ${icons.ext} Portal Sefaz
          </a>
        ` : ''}
        <button class="btn btn-primary" id="btn-edit-nota">
          ${icons.edit} Editar
        </button>
      </div>
    </div>
  `;

  dlg.showModal();

  dlg.querySelector('#btn-close-dlg').onclick = () => dlg.close();

  dlg.querySelector('#btn-copy-chave')?.addEventListener('click', () => {
    navigator.clipboard.writeText(nota.chave).then(() => showToast('Chave copiada!', 'success'));
  });

  dlg.querySelector('#btn-edit-nota').onclick = () => {
    dlg.close();
    showEditNotaModal(nota, false);
  };

  dlg.querySelector('#btn-delete-nota').onclick = async () => {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      await deleteNota(nota.id);
      dlg.close();
      showToast('Nota excluída', 'info');
      await reloadNotas();
      render();
    }
  };
}

// ---------------- ENTRADA MANUAL ----------------

function showManualEntryModal() {
  const nota = {
    id: 'nota_' + Date.now(),
    criadoEm: Date.now(),
    chave: '',
    emitente: '',
    valor: 0,
    dataEmissao: new Date().toISOString().slice(0, 10),
    categoria: 'outros',
    cnpj: '',
    observacao: '',
  };
  showEditNotaModal(nota, true);
}

// ---------------- EXPORTAÇÃO CSV / PDF ----------------

function showExportModal() {
  const notas = getFilteredNotas();
  dlg.innerHTML = `
    <div class="dlg-header">
      <h2 id="dlg-title">Exportar Notas</h2>
      <button class="btn btn-icon btn-secondary" id="btn-close-dlg">${icons.x}</button>
    </div>
    <div class="dlg-body">
      <p style="margin-bottom: 16px; color: var(--text-muted); font-size: 0.9rem;">
        Exportando <strong>${notas.length}</strong> nota${notas.length === 1 ? '' : 's'} de acordo com os filtros atuais.
      </p>

      <div style="display: grid; gap: 12px;">
        <button class="btn btn-secondary" id="btn-export-csv" style="justify-content: flex-start; padding: 14px;">
          ${icons.sheet}
          <div style="text-align: left; margin-left: 8px;">
            <div style="font-weight: 600;">Planilha CSV (Excel)</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Formatado para Excel em português (separador ";" e vírgula decimal)</div>
          </div>
        </button>

        <button class="btn btn-secondary" id="btn-export-pdf" style="justify-content: flex-start; padding: 14px;">
          ${icons.file}
          <div style="text-align: left; margin-left: 8px;">
            <div style="font-weight: 600;">Relatório em PDF</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Relatório visual com capa, resumo de gastos e comprovantes escaneados</div>
          </div>
        </button>
      </div>
    </div>
    <div class="dlg-footer">
      <button class="btn btn-secondary" id="btn-cancel-exp">Fechar</button>
    </div>
  `;

  dlg.showModal();
  dlg.querySelector('#btn-close-dlg').onclick = () => dlg.close();
  dlg.querySelector('#btn-cancel-exp').onclick = () => dlg.close();

  dlg.querySelector('#btn-export-csv').onclick = () => {
    exportCSV(notas);
    dlg.close();
    showToast('Planilha CSV gerada!', 'success');
  };

  dlg.querySelector('#btn-export-pdf').onclick = async () => {
    showToast('Gerando documento PDF com comprovantes...', 'info', 2500);
    dlg.close();
    await exportPDF(notas);
    showToast('PDF gerado com sucesso!', 'success');
  };
}

// ---------------- DASHBOARD RESUMO ----------------

function showDashboardModal() {
  const notas = state.notas;
  const totalGeral = notas.reduce((acc, n) => acc + (Number(n.valor) || 0), 0);

  // Totais por categoria
  const porCat = {};
  CATEGORIAS.forEach(c => { porCat[c.id] = { nome: c.nome, cor: c.cor, total: 0, count: 0 }; });
  notas.forEach(n => {
    const cid = n.categoria || 'outros';
    if (!porCat[cid]) porCat[cid] = { nome: cid, cor: '#94a3b8', total: 0, count: 0 };
    porCat[cid].total += Number(n.valor) || 0;
    porCat[cid].count += 1;
  });

  const catList = Object.values(porCat).filter(c => c.count > 0).sort((a, b) => b.total - a.total);

  dlg.innerHTML = `
    <div class="dlg-header">
      <h2 id="dlg-title">Resumo Financeiro</h2>
      <button class="btn btn-icon btn-secondary" id="btn-close-dlg">${icons.x}</button>
    </div>
    <div class="dlg-body">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Gasto Total Registrado</span>
        <div style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: #fff;">
          ${fmtBRL(totalGeral)}
        </div>
        <div style="font-size: 0.82rem; color: var(--accent-emerald);">${notas.length} documentos arquivados</div>
      </div>

      <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px;">Gastos por Categoria</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${catList.map(c => {
          const pct = totalGeral > 0 ? Math.round((c.total / totalGeral) * 100) : 0;
          return `
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                <span style="font-weight: 600;">${c.nome} (${c.count})</span>
                <span style="font-weight: 700; color: #fff;">${fmtBRL(c.total)} <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: normal;">(${pct}%)</span></span>
              </div>
              <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.08); border-radius: 999px; overflow: hidden;">
                <div style="width: ${pct}%; height: 100%; background: ${c.cor}; border-radius: 999px;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
    <div class="dlg-footer">
      <button class="btn btn-secondary" id="btn-close-dash">Fechar</button>
    </div>
  `;

  dlg.showModal();
  dlg.querySelector('#btn-close-dlg').onclick = () => dlg.close();
  dlg.querySelector('#btn-close-dash').onclick = () => dlg.close();
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// Inicializa a aplicação
init();
