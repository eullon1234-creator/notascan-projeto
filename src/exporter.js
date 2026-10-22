// Exportação: CSV (pronto para Excel em pt-BR) e PDF (equivalente ao libpdfengine do app original).
import { fmtBRL, fmtData, formatChave, formatCNPJ, categoriaById, MODELOS } from './nfe.js';

function download(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

const stamp = () => new Date().toISOString().slice(0, 10);

export function exportCSV(notas) {
  const cols = ['Data emissão', 'Emitente', 'CNPJ', 'Modelo', 'UF', 'Série', 'Número', 'Valor', 'Categoria', 'Chave de acesso', 'Observação'];
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = notas.map((n) => [
    fmtData(n.dataEmissao), n.emitente, formatCNPJ(n.cnpj || ''), MODELOS[n.modelo] || n.modelo || '', n.uf, n.serie, n.numero,
    (Number(n.valor) || 0).toFixed(2).replace('.', ','), categoriaById(n.categoria).nome,
    n.chave ? `'${n.chave}` : '', n.observacao,
  ].map(esc).join(';'));
  const csv = '\uFEFF' + [cols.join(';'), ...rows].join('\r\n');
  download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `notas-${stamp()}.csv`);
}

const blobToDataURL = (blob) => new Promise((res) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.readAsDataURL(blob);
});

const imgSize = (url) => new Promise((res) => {
  const i = new Image();
  i.onload = () => res({ w: i.naturalWidth, h: i.naturalHeight });
  i.src = url;
});

export async function exportPDF(notas, { filename, onProgress } = {}) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, H = 297, M = 12;
  const total = notas.reduce((s, n) => s + (Number(n.valor) || 0), 0);

  // Capa/resumo quando houver várias notas
  if (notas.length > 1) {
    doc.setFillColor(11, 15, 25); doc.rect(0, 0, W, 48, 'F');
    doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(22);
    doc.text('NotaScan — Relatório de notas', M, 22);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
    doc.text(`${notas.length} notas  •  Total ${fmtBRL(total)}  •  Gerado em ${fmtData(stamp())}`, M, 34);
    doc.setTextColor(30); doc.setFontSize(9);
    let y = 60;
    doc.setFont('helvetica', 'bold');
    doc.text('Data', M, y); doc.text('Emitente', M + 24, y); doc.text('Modelo', M + 118, y); doc.text('Valor', W - M, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    y += 6;
    for (const n of notas) {
      if (y > H - M) { doc.addPage(); y = M + 6; }
      doc.text(fmtData(n.dataEmissao), M, y);
      doc.text(String(n.emitente || '—').slice(0, 52), M + 24, y);
      doc.text(MODELOS[n.modelo] || '—', M + 118, y);
      doc.text(fmtBRL(n.valor), W - M, y, { align: 'right' });
      y += 5.5;
    }
  }

  for (let i = 0; i < notas.length; i++) {
    const n = notas[i];
    onProgress?.(i + 1, notas.length);
    if (i > 0 || notas.length > 1) doc.addPage();
    doc.setTextColor(20); doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
    doc.text(String(n.emitente || 'Emitente não informado').slice(0, 60), M, M + 6);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(70);
    const meta = [
      `${MODELOS[n.modelo] || 'Documento'}${n.numero ? ` nº ${n.numero}` : ''}${n.serie ? ` série ${n.serie}` : ''}${n.uf ? ` • ${n.uf}` : ''}`,
      `CNPJ ${n.cnpj ? formatCNPJ(n.cnpj) : '—'}   •   Emissão ${fmtData(n.dataEmissao)}   •   ${categoriaById(n.categoria).nome}`,
      n.chave ? `Chave ${formatChave(n.chave)}` : 'Chave de acesso não identificada',
    ];
    meta.forEach((t, k) => doc.text(t, M, M + 13 + k * 5));
    doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(16, 150, 110);
    doc.text(fmtBRL(n.valor), W - M, M + 6, { align: 'right' });

    const top = M + 32;
    if (n.imagem) {
      const url = await blobToDataURL(n.imagem);
      const { w, h } = await imgSize(url);
      const maxW = W - 2 * M, maxH = H - top - M;
      const k = Math.min(maxW / w, maxH / h);
      doc.addImage(url, 'JPEG', M + (maxW - w * k) / 2, top, w * k, h * k, undefined, 'FAST');
    }
  }
  doc.save(filename || `notas-${stamp()}.pdf`);
}
