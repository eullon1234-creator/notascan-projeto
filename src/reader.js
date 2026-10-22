// Leitura de QR Code / código de barras (equivalente ao libQREngine + ML Kit) e OCR (libOCREngine → Tesseract).
import { findChave, parseQrNfce, isChaveValida, cleanChave } from './nfe.js';

const FORMATS = ['qr_code', 'code_128', 'itf', 'pdf417', 'data_matrix'];
let detectorPromise = null;

async function getDetector() {
  if (detectorPromise) return detectorPromise;
  detectorPromise = (async () => {
    if ('BarcodeDetector' in window) {
      try {
        const supported = await window.BarcodeDetector.getSupportedFormats();
        if (supported.includes('qr_code') && supported.includes('code_128')) {
          return new window.BarcodeDetector({ formats: FORMATS.filter((f) => supported.includes(f)) });
        }
      } catch { /* usa o ponyfill */ }
    }
    const { BarcodeDetector } = await import('barcode-detector/pure');
    return new BarcodeDetector({ formats: FORMATS });
  })();
  return detectorPromise;
}

export async function detectCodes(source) {
  try {
    const det = await getDetector();
    return await det.detect(source);
  } catch (e) {
    console.warn('Falha na leitura de códigos', e);
    return [];
  }
}

/**
 * Interpreta códigos detectados e devolve dados fiscais.
 * QR NFC-e → URL de consulta + chave (+ valor/data em emissões off-line).
 * Code-128 do DANFE → chave de 44 dígitos.
 */
export function interpretCodes(codes) {
  const out = { chave: null, qrUrl: null, valor: null, dataEmissao: null, dia: null, codes: [] };
  for (const c of codes) {
    const raw = c.rawValue || '';
    out.codes.push({ format: c.format, raw });
    if (c.format === 'qr_code' && /p=|chNFe=|nfce|fazenda|sefaz/i.test(raw)) {
      const q = parseQrNfce(raw);
      out.qrUrl = out.qrUrl || q.url;
      out.chave = out.chave || q.chave;
      out.valor = out.valor ?? q.valor;
      out.dataEmissao = out.dataEmissao || q.dataEmissao;
      out.dia = out.dia || q.dia;
    } else {
      const cl = cleanChave(raw);
      if (isChaveValida(cl)) out.chave = out.chave || cl;
      else out.chave = out.chave || findChave(raw);
    }
  }
  return out;
}

// ---------------- OCR ----------------
let workerPromise = null;

async function getWorker(onProgress) {
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker } = await import('tesseract.js');
      return createWorker('por', 1, {
        logger: (m) => getWorker.onProgress?.(m),
      });
    })().catch((e) => { workerPromise = null; throw e; });
  }
  getWorker.onProgress = onProgress;
  return workerPromise;
}

/** Executa OCR em português. onProgress recebe {status, progress}. */
export async function runOCR(canvas, onProgress) {
  const worker = await getWorker(onProgress);
  const { data } = await worker.recognize(canvas);
  return data.text || '';
}
