// Motor de imagem inspirado no pipeline do CamScanner (libpagescanner/libscannercs + libmagicenhancer),
// implementado com OpenCV.js carregado sob demanda.

const OPENCV_URL = 'https://docs.opencv.org/4.10.0/opencv.js';
let cvPromise = null;

export function loadOpenCV() {
  if (cvPromise) return cvPromise;
  cvPromise = new Promise((resolve, reject) => {
    if (window.cv && window.cv.Mat) return resolve(window.cv);
    const s = document.createElement('script');
    s.src = OPENCV_URL;
    s.async = true;
    s.onerror = () => { cvPromise = null; reject(new Error('Falha ao carregar o OpenCV.js')); };
    s.onload = () => {
      const cv = window.cv;
      if (cv instanceof Promise) cv.then((m) => { window.cv = m; resolve(m); });
      else if (cv.Mat) resolve(cv);
      else cv.onRuntimeInitialized = () => resolve(cv);
    };
    document.head.appendChild(s);
  });
  return cvPromise;
}

export const cvReady = () => !!(window.cv && window.cv.Mat);

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Ordena 4 pontos como [topo-esq, topo-dir, baixo-dir, baixo-esq]. */
export function orderPoints(pts) {
  const bySum = [...pts].sort((a, b) => a.x + a.y - (b.x + b.y));
  const byDiff = [...pts].sort((a, b) => a.y - a.x - (b.y - b.x));
  return [bySum[0], byDiff[0], bySum[3], byDiff[3]];
}

export function defaultQuad(w, h, inset = 0.06) {
  const dx = w * inset, dy = h * inset;
  return [{ x: dx, y: dy }, { x: w - dx, y: dy }, { x: w - dx, y: h - dy }, { x: dx, y: h - dy }];
}

/**
 * Detecta o contorno do documento. Retorna 4 pontos nas coordenadas da fonte ou null.
 * @param {HTMLCanvasElement|HTMLVideoElement} source
 */
export function detectDocument(source, work = document.createElement('canvas')) {
  const cv = window.cv;
  if (!cv || !cv.Mat) return null;
  const sw = source.videoWidth || source.width;
  const sh = source.videoHeight || source.height;
  if (!sw || !sh) return null;

  const scale = 480 / Math.max(sw, sh);
  work.width = Math.round(sw * scale);
  work.height = Math.round(sh * scale);
  const ctx = work.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(source, 0, 0, work.width, work.height);

  const src = cv.imread(work);
  const gray = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
  let best = null;

  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);
    // Fecha o texto do papel para que a folha vire uma mancha uniforme
    cv.morphologyEx(gray, gray, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 2);
    cv.Canny(gray, edges, 30, 120);
    cv.dilate(edges, edges, kernel);
    cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    const minArea = work.width * work.height * 0.12;
    let bestArea = 0;
    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);
      if (area > minArea && area > bestArea) {
        const peri = cv.arcLength(cnt, true);
        const approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
        if (approx.rows === 4 && cv.isContourConvex(approx)) {
          bestArea = area;
          best = [];
          for (let k = 0; k < 4; k++) best.push({ x: approx.data32S[k * 2] / scale, y: approx.data32S[k * 2 + 1] / scale });
        }
        approx.delete();
      }
      cnt.delete();
    }
  } finally {
    src.delete(); gray.delete(); edges.delete(); contours.delete(); hierarchy.delete(); kernel.delete();
  }
  return best ? orderPoints(best) : null;
}

/** Recorta e "desentorta" a área do documento. */
export function warpDocument(sourceCanvas, quad) {
  const cv = window.cv;
  const [tl, tr, br, bl] = quad;
  let w = Math.round(Math.max(dist(tl, tr), dist(bl, br)));
  let h = Math.round(Math.max(dist(tl, bl), dist(tr, br)));
  const MAX = 2400;
  const k = Math.min(1, MAX / Math.max(w, h));
  w = Math.round(w * k); h = Math.round(h * k);

  const out = document.createElement('canvas');
  out.width = w; out.height = h;

  if (!cv || !cv.Mat) {
    // Sem OpenCV: recorte retangular simples pela caixa envolvente
    const xs = quad.map((p) => p.x), ys = quad.map((p) => p.y);
    const x0 = Math.min(...xs), y0 = Math.min(...ys);
    out.getContext('2d').drawImage(sourceCanvas, x0, y0, Math.max(...xs) - x0, Math.max(...ys) - y0, 0, 0, w, h);
    return out;
  }

  const src = cv.imread(sourceCanvas);
  const dst = new cv.Mat();
  const from = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
  const to = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, w, 0, w, h, 0, h]);
  const M = cv.getPerspectiveTransform(from, to);
  try {
    cv.warpPerspective(src, dst, M, new cv.Size(w, h), cv.INTER_CUBIC, cv.BORDER_REPLICATE);
    cv.imshow(out, dst);
  } finally {
    src.delete(); dst.delete(); from.delete(); to.delete(); M.delete();
  }
  return out;
}

export const FILTERS = [
  { id: 'magic', nome: 'Mágico' },
  { id: 'original', nome: 'Original' },
  { id: 'gray', nome: 'Cinza' },
  { id: 'bw', nome: 'P&B' },
  { id: 'vivid', nome: 'Vívido' },
];

/** Aplica um filtro de melhoria. Retorna um novo canvas. */
export function applyFilter(canvas, filterId) {
  const cv = window.cv;
  const out = document.createElement('canvas');
  out.width = canvas.width; out.height = canvas.height;
  if (filterId === 'original' || !cv || !cv.Mat) {
    out.getContext('2d').drawImage(canvas, 0, 0);
    if (filterId !== 'original') cssFallback(out, filterId);
    return out;
  }

  const src = cv.imread(canvas);
  const rgb = new cv.Mat();
  const tmp = new cv.Mat();
  const bg = new cv.Mat();
  const res = new cv.Mat();
  const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(9, 9));
  try {
    cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);

    // "Mágico": remove sombra/iluminação dividindo pela estimativa do fundo do papel
    const shadowFree = () => {
      cv.dilate(rgb, bg, kernel);
      cv.medianBlur(bg, bg, 21);
      cv.divide(rgb, bg, tmp, 255);
      return tmp;
    };

    switch (filterId) {
      case 'magic': {
        shadowFree().convertTo(res, -1, 1.15, -18);
        break;
      }
      case 'gray': {
        cv.cvtColor(shadowFree(), res, cv.COLOR_RGB2GRAY);
        cv.normalize(res, res, 0, 255, cv.NORM_MINMAX);
        break;
      }
      case 'bw': {
        const g = new cv.Mat();
        cv.cvtColor(shadowFree(), g, cv.COLOR_RGB2GRAY);
        cv.adaptiveThreshold(g, res, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 31, 12);
        g.delete();
        break;
      }
      case 'vivid': {
        rgb.convertTo(res, -1, 1.35, -25);
        break;
      }
      default:
        rgb.copyTo(res);
    }
    cv.imshow(out, res);
  } finally {
    src.delete(); rgb.delete(); tmp.delete(); bg.delete(); res.delete(); kernel.delete();
  }
  return out;
}

function cssFallback(canvas, id) {
  const map = { magic: 'contrast(1.4) brightness(1.1) saturate(1.1)', gray: 'grayscale(1) contrast(1.3)', bw: 'grayscale(1) contrast(3)', vivid: 'contrast(1.35) saturate(1.3)' };
  const copy = document.createElement('canvas');
  copy.width = canvas.width; copy.height = canvas.height;
  copy.getContext('2d').drawImage(canvas, 0, 0);
  const ctx = canvas.getContext('2d');
  ctx.filter = map[id] || 'none';
  ctx.drawImage(copy, 0, 0);
  ctx.filter = 'none';
}

export function rotateCanvas(canvas, clockwise = true) {
  const out = document.createElement('canvas');
  out.width = canvas.height; out.height = canvas.width;
  const ctx = out.getContext('2d');
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate((clockwise ? 1 : -1) * Math.PI / 2);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  return out;
}

export function scaledCanvas(source, maxSide) {
  const sw = source.videoWidth || source.naturalWidth || source.width;
  const sh = source.videoHeight || source.naturalHeight || source.height;
  const k = Math.min(1, maxSide / Math.max(sw, sh));
  const c = document.createElement('canvas');
  c.width = Math.round(sw * k); c.height = Math.round(sh * k);
  c.getContext('2d').drawImage(source, 0, 0, c.width, c.height);
  return c;
}

export const canvasToBlob = (canvas, type = 'image/jpeg', q = 0.85) =>
  new Promise((r) => canvas.toBlob(r, type, q));

export async function fileToCanvas(file, maxSide = 3000) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const c = scaledCanvas(bmp, maxSide);
  bmp.close?.();
  return c;
}
