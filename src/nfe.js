// Regras fiscais: chave de acesso (44 posições), QR Code da NFC-e e heurísticas de OCR.

export const UF_CODES = {
  11: 'RO', 12: 'AC', 13: 'AM', 14: 'RR', 15: 'PA', 16: 'AP', 17: 'TO',
  21: 'MA', 22: 'PI', 23: 'CE', 24: 'RN', 25: 'PB', 26: 'PE', 27: 'AL', 28: 'SE', 29: 'BA',
  31: 'MG', 32: 'ES', 33: 'RJ', 35: 'SP',
  41: 'PR', 42: 'SC', 43: 'RS',
  50: 'MS', 51: 'MT', 52: 'GO', 53: 'DF',
};

export const MODELOS = { '55': 'NF-e', '65': 'NFC-e', '57': 'CT-e', '59': 'CF-e SAT', '67': 'CT-e OS' };

export const TP_EMIS = {
  '1': 'Normal', '2': 'Contingência FS-IA', '4': 'Contingência EPEC', '5': 'Contingência FS-DA',
  '6': 'Contingência SVC-AN', '7': 'Contingência SVC-RS', '9': 'Contingência off-line NFC-e',
};

// Chave: cUF(2) AAMM(4) CNPJ(14, pode ser alfanumérico a partir de 2026) mod(2) serie(3) nNF(9) tpEmis(1) cNF(8) cDV(1)
const CHAVE_RE = /\d{6}[0-9A-Z]{12}\d{26}/;

/** Valor de cada posição para o cálculo do DV (suporta CNPJ alfanumérico: valor = ASCII - 48). */
const charValue = (c) => c.charCodeAt(0) - 48;

export function calcDV(chave43) {
  let peso = 2;
  let soma = 0;
  for (let i = chave43.length - 1; i >= 0; i--) {
    soma += charValue(chave43[i]) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

export function cleanChave(raw = '') {
  return String(raw).toUpperCase().replace(/[^0-9A-Z]/g, '');
}

export function isChaveValida(raw) {
  const c = cleanChave(raw);
  if (c.length !== 44 || !CHAVE_RE.test(c)) return false;
  // Validações fiscais adicionais para evitar falsos positivos
  const cUF = Number(c.slice(0, 2));
  if (!UF_CODES[cUF]) return false;
  const mm = Number(c.slice(4, 6));
  if (mm < 1 || mm > 12) return false;
  const mod = c.slice(20, 22);
  if (!MODELOS[mod]) return false;
  return calcDV(c.slice(0, 43)) === Number(c[43]);
}

export function formatChave(raw) {
  return cleanChave(raw).replace(/(.{4})/g, '$1 ').trim();
}

export function formatCNPJ(raw = '') {
  const c = cleanChave(raw);
  if (c.length === 14) return c.replace(/^(.{2})(.{3})(.{3})(.{4})(.{2})$/, '$1.$2.$3/$4-$5');
  if (c.length === 11) return c.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  return raw;
}

/** Decodifica uma chave de acesso válida em seus campos. */
export function parseChave(raw) {
  const c = cleanChave(raw);
  if (!isChaveValida(c)) return null;
  const cUF = Number(c.slice(0, 2));
  const aa = Number(c.slice(2, 4));
  const mm = Number(c.slice(4, 6));
  const mod = c.slice(20, 22);
  return {
    chave: c,
    cUF,
    uf: UF_CODES[cUF] || String(cUF),
    ano: 2000 + aa,
    mes: mm,
    anoMes: `${2000 + aa}-${String(mm).padStart(2, '0')}`,
    cnpj: c.slice(6, 20),
    modelo: mod,
    modeloNome: MODELOS[mod] || `Modelo ${mod}`,
    serie: String(Number(c.slice(22, 25))),
    numero: String(Number(c.slice(25, 34))),
    tpEmis: c[34],
    tpEmisNome: TP_EMIS[c[34]] || c[34],
    cNF: c.slice(35, 43),
    dv: c[43],
  };
}

/** Procura uma chave válida dentro de qualquer texto (QR, código de barras, OCR). */
export function findChave(text = '') {
  const up = String(text).toUpperCase();
  // 1) Sequência direta por token isolado
  const tokens = up.split(/[^0-9A-Z]/).filter(t => t.length === 44);
  for (const t of tokens) {
    if (isChaveValida(t)) return t;
  }
  // 2) Blocos de 4 separados por espaço (DANFE / cupom): "3524 0912 ..."
  const grouped = up.match(/(?:[0-9A-Z]{4}[\s.\-]{0,3}){10}[0-9A-Z]{4}/g) || [];
  for (const g of grouped) {
    const c = cleanChave(g);
    if (isChaveValida(c)) return c;
  }
  // 3) Tokens com possíveis letras O trocadas por 0 pelo OCR
  for (const line of up.split(/[\r\n|?&=;]/)) {
    const sanitized = cleanChave(line.replace(/O/g, '0'));
    if (sanitized.length === 44 && isChaveValida(sanitized)) return sanitized;
  }
  return null;
}

const parseMoney = (s) => {
  if (s == null) return null;
  const str = String(s).trim();
  // formato do QR (ponto decimal) ou brasileiro (vírgula decimal)
  const n = str.includes(',') ? Number(str.replace(/\./g, '').replace(',', '.')) : Number(str);
  return Number.isFinite(n) ? n : null;
};

/**
 * Interpreta o conteúdo do QR Code da NFC-e.
 * Suporta v1 (chNFe=...&vNF=...), v2 e v3 (p=chave|versao|tpAmb|...).
 */
export function parseQrNfce(content = '') {
  const out = { raw: content, url: null, chave: null, valor: null, dia: null, dataEmissao: null, versao: null };
  if (/^https?:\/\//i.test(content.trim())) out.url = content.trim();

  let params;
  try {
    params = new URL(content.trim()).searchParams;
  } catch {
    params = new URLSearchParams(content.split('?')[1] || '');
  }

  const p = params.get('p');
  if (p) {
    const parts = p.split('|');
    const ch = cleanChave(parts[0]);
    out.chave = isChaveValida(ch) ? ch : (ch.length === 44 ? ch : null);
    out.versao = parts[1];
    const tpEmis = out.chave ? out.chave[34] : null;
    // Emissão off-line (tpEmis 9): p=chave|versao|tpAmb|dia|vNF|...
    if (tpEmis === '9' && parts.length >= 6) {
      out.dia = Number(parts[3]) || null;
      out.valor = parseMoney(parts[4]);
    }
  } else if (params.get('chNFe')) {
    out.chave = isChaveValida(params.get('chNFe')) ? cleanChave(params.get('chNFe')) : null;
    out.versao = '1';
    out.valor = parseMoney(params.get('vNF'));
    const dh = params.get('dhEmi');
    if (dh) {
      try {
        const iso = dh.match(/../g).map((h) => String.fromCharCode(parseInt(h, 16))).join('');
        const d = iso.slice(0, 10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) out.dataEmissao = d;
      } catch { /* ignora */ }
    }
  }
  if (!out.chave) out.chave = findChave(content);
  return out;
}

/** Link de consulta pública. NFC-e usa a URL do próprio QR; NF-e usa o portal nacional. */
export function consultaUrl(nota) {
  if (nota.qrUrl) return nota.qrUrl;
  if (nota.modelo === '55') return 'https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=resumo&tipoConteudo=7PhJ+gAVw2g=';
  return null;
}

// ---------- Heurísticas para texto de OCR ----------

const MONEY_RE = /(?:R\$\s*)?(\d{1,3}(?:[.\s]\d{3})*,\d{2}|\d+,\d{2})/g;
const TOTAL_KEYS = [
  /VALOR\s+TOTAL\s+DA\s+NOTA/i,
  /V(?:ALOR|L)?\.?\s*TOTAL\s*(?:R\$)?/i,
  /VALOR\s+A\s+PAGAR/i,
  /TOTAL\s+A\s+PAGAR/i,
  /TOTAL\s*R\$/i,
  /\bTOTAL\b/i,
];

function moneysIn(line) {
  return [...line.matchAll(MONEY_RE)].map((m) => parseMoney(m[1].replace(/\s/g, '.'))).filter((n) => n != null);
}

export function extractFromText(text = '') {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const result = { chave: findChave(text), cnpj: null, dataEmissao: null, valor: null, emitente: null };

  // CNPJ (primeiro encontrado costuma ser o do emitente)
  const cnpjM = text.match(/\b(\d{2}[.\s]?\d{3}[.\s]?\d{3}\s?\/?\s?\d{4}\s?-?\s?\d{2})\b/);
  if (cnpjM) {
    const c = cnpjM[1].replace(/\D/g, '');
    if (c.length === 14) result.cnpj = c;
  }

  // Data: priorizar perto de "EMISSÃO"
  const dateRe = /\b(\d{2})[\/\-.](\d{2})[\/\-.](\d{4})\b/;
  let dateLine = lines.find((l) => /EMISS/i.test(l) && dateRe.test(l));
  if (!dateLine) {
    const idx = lines.findIndex((l) => /EMISS/i.test(l));
    if (idx >= 0) dateLine = lines.slice(idx, idx + 3).find((l) => dateRe.test(l));
  }
  dateLine = dateLine || lines.find((l) => dateRe.test(l));
  if (dateLine) {
    const [, d, m, y] = dateLine.match(dateRe);
    if (+m >= 1 && +m <= 12 && +d >= 1 && +d <= 31) result.dataEmissao = `${y}-${m}-${d}`;
  }

  // Valor total: procurar palavras-chave por ordem de confiança
  outer: for (const key of TOTAL_KEYS) {
    for (let i = 0; i < lines.length; i++) {
      if (!key.test(lines[i]) || /SUBTOTAL|TRIBUT|ICMS|IMPOSTO|DESCONTO/i.test(lines[i])) continue;
      for (let j = i; j < Math.min(i + 3, lines.length); j++) {
        const vals = moneysIn(lines[j]);
        if (vals.length) { result.valor = vals[vals.length - 1]; break outer; }
      }
    }
  }
  if (result.valor == null) {
    const all = lines.flatMap(moneysIn);
    if (all.length) result.valor = Math.max(...all);
  }

  // Emitente: primeira linha "com cara de nome" antes do CNPJ
  const cnpjIdx = lines.findIndex((l) => /CNPJ/i.test(l));
  const head = lines.slice(0, cnpjIdx > 0 ? cnpjIdx : 6);
  const nome = head.find((l) => {
    const letters = l.replace(/[^A-Za-zÀ-ú]/g, '').length;
    return letters >= 5 && letters / l.length > 0.6 && !/DANFE|DOCUMENTO|NOTA FISCAL|CONSUMIDOR|ELETR[OÔ]NICA|AUXILIAR/i.test(l);
  });
  if (nome) result.emitente = nome.replace(/\s{2,}/g, ' ').slice(0, 80);

  return result;
}

// ---------- Categorias ----------

export const CATEGORIAS = [
  { id: 'mercado', nome: 'Mercado', cor: '#34d399', re: /MERCAD|SUPERM|ATACAD|HORTI|PADARIA|PANIFIC|ASSAI|CARREFOUR|ATACAD[AÃ]O|EXTRA|P[AÃ]O DE A[CÇ]/i },
  { id: 'restaurante', nome: 'Restaurante', cor: '#fbbf24', re: /RESTAUR|LANCH|BURGER|PIZZ|BAR\b|CAFE|CAFÉ|IFOOD|MC ?DONALD|SUSHI|CHURRAS/i },
  { id: 'combustivel', nome: 'Combustível', cor: '#f87171', re: /POSTO|COMBUST|PETRO|SHELL|IPIRANGA|AUTO ?POSTO|GASOL/i },
  { id: 'farmacia', nome: 'Farmácia', cor: '#60a5fa', re: /FARM|DROGA|RAIA|PAGUE MENOS|PACHECO/i },
  { id: 'casa', nome: 'Casa & Obra', cor: '#a78bfa', re: /CONSTRU|MATERIA|LEROY|TELHA|ELETRO|MAGAZINE|CASAS BAHIA/i },
  { id: 'servicos', nome: 'Serviços', cor: '#22d3ee', re: /SERVI[CÇ]|TELECOM|ENERGIA|SANEAMENTO|INTERNET/i },
  { id: 'outros', nome: 'Outros', cor: '#94a3b8', re: null },
];

export function guessCategoria(nome = '') {
  const cat = CATEGORIAS.find((c) => c.re && c.re.test(nome));
  return cat ? cat.id : 'outros';
}

export const categoriaById = (id) => CATEGORIAS.find((c) => c.id === id) || CATEGORIAS[CATEGORIAS.length - 1];

// ---------- Formatação ----------

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const fmtBRL = (n) => BRL.format(Number(n) || 0);

export function fmtData(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export function fmtAnoMes(anoMes, long = false) {
  const [y, m] = anoMes.split('-').map(Number);
  if (long) {
    const nome = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(y, m - 1, 1));
    return `${nome[0].toUpperCase()}${nome.slice(1)} ${y}`;
  }
  return `${MESES[m - 1]}/${String(y).slice(2)}`;
}
