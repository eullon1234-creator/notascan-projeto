// Armazenamento local em IndexedDB (equivalente ao banco WCDB do app original). Nada sai do aparelho.
const DB_NAME = 'notascan';
const STORE = 'notas';
let dbp = null;

function open() {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      const st = db.createObjectStore(STORE, { keyPath: 'id' });
      st.createIndex('chave', 'chave', { unique: false });
      st.createIndex('dataEmissao', 'dataEmissao', { unique: false });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbp;
}

async function tx(mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const st = t.objectStore(STORE);
    let result;
    Promise.resolve(fn(st)).then((r) => { result = r; });
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

const reqP = (req) => new Promise((res, rej) => { req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); });

export const listNotas = () => tx('readonly', (st) => reqP(st.getAll())).then((all) =>
  all.sort((a, b) => (b.dataEmissao || '').localeCompare(a.dataEmissao || '') || b.criadoEm - a.criadoEm));

export const getNota = (id) => tx('readonly', (st) => reqP(st.get(id)));

export const saveNota = (nota) => tx('readwrite', (st) => reqP(st.put(nota)));

export const deleteNota = (id) => tx('readwrite', (st) => reqP(st.delete(id)));

export async function findByChave(chave) {
  if (!chave) return null;
  return tx('readonly', (st) => reqP(st.index('chave').get(chave)));
}

export async function requestPersistence() {
  try { if (navigator.storage?.persist) await navigator.storage.persist(); } catch { /* opcional */ }
}
