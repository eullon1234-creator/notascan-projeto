(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();const b=(t,e="")=>`<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${e}>${t}</svg>`,v={logo:'<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2ee6a6"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs><rect x="4" y="4" width="40" height="40" rx="12" fill="url(#lg)"/><path d="M16 14h12l6 6v14a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2z" fill="#06261d" opacity=".9"/><path d="M18 24h12M18 28h12M18 32h7" stroke="#2ee6a6" stroke-width="2.2" stroke-linecap="round"/><path d="M10 12V9a1 1 0 0 1 1-1h3M38 12V9a1 1 0 0 0-1-1h-3M10 36v3a1 1 0 0 0 1 1h3M38 36v3a1 1 0 0 1-1 1h-3" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',camera:b('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>'),scan:b('<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>'),image:b('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>'),keyboard:b('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M8 17h8M10 13h4"/>'),x:b('<path d="M18 6 6 18M6 6l12 12"/>'),back:b('<path d="m15 18-6-6 6-6"/>'),chevR:b('<path d="m9 18 6-6-6-6"/>'),rotR:b('<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>'),expand:b('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'),check:b('<path d="M20 6 9 17l-5-5"/>'),alert:b('<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'),download:b('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'),install:b('<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 19h14"/>'),upload:b('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>'),file:b('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>'),sheet:b('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>'),trash:b('<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>'),edit:b('<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>'),ext:b('<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),copy:b('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),search:b('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),bolt:b('<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'),auto:b('<circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>'),building:b('<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>'),sparkle:b('<path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z"/>'),trend:b('<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>')},ht={11:"RO",12:"AC",13:"AM",14:"RR",15:"PA",16:"AP",17:"TO",21:"MA",22:"PI",23:"CE",24:"RN",25:"PB",26:"PE",27:"AL",28:"SE",29:"BA",31:"MG",32:"ES",33:"RJ",35:"SP",41:"PR",42:"SC",43:"RS",50:"MS",51:"MT",52:"GO",53:"DF"},I={55:"NF-e",65:"NFC-e",57:"CT-e",59:"CF-e SAT",67:"CT-e OS"},bt={1:"Normal",2:"Contingência FS-IA",4:"Contingência EPEC",5:"Contingência FS-DA",6:"Contingência SVC-AN",7:"Contingência SVC-RS",9:"Contingência off-line NFC-e"},yt=/\d{6}[0-9A-Z]{12}\d{26}/,wt=t=>t.charCodeAt(0)-48;function xt(t){let e=2,a=0;for(let n=t.length-1;n>=0;n--)a+=wt(t[n])*e,e=e===9?2:e+1;const o=a%11;return o<2?0:11-o}function C(t=""){return String(t).toUpperCase().replace(/[^0-9A-Z]/g,"")}function R(t){const e=C(t);if(e.length!==44||!yt.test(e))return!1;const a=Number(e.slice(0,2));if(!ht[a])return!1;const o=Number(e.slice(4,6));if(o<1||o>12)return!1;const n=e.slice(20,22);return I[n]?xt(e.slice(0,43))===Number(e[43]):!1}function J(t){return C(t).replace(/(.{4})/g,"$1 ").trim()}function k(t=""){const e=C(t);return e.length===14?e.replace(/^(.{2})(.{3})(.{3})(.{4})(.{2})$/,"$1.$2.$3/$4-$5"):e.length===11?e.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/,"$1.$2.$3-$4"):t}function mt(t){const e=C(t);if(!R(e))return null;const a=Number(e.slice(0,2)),o=Number(e.slice(2,4)),n=Number(e.slice(4,6)),r=e.slice(20,22);return{chave:e,cUF:a,uf:ht[a]||String(a),ano:2e3+o,mes:n,anoMes:`${2e3+o}-${String(n).padStart(2,"0")}`,cnpj:e.slice(6,20),modelo:r,modeloNome:I[r]||`Modelo ${r}`,serie:String(Number(e.slice(22,25))),numero:String(Number(e.slice(25,34))),tpEmis:e[34],tpEmisNome:bt[e[34]]||e[34],cNF:e.slice(35,43),dv:e[43]}}function Z(t=""){const e=String(t).toUpperCase(),a=e.split(/[^0-9A-Z]/).filter(n=>n.length===44);for(const n of a)if(R(n))return n;const o=e.match(/(?:[0-9A-Z]{4}[\s.\-]{0,3}){10}[0-9A-Z]{4}/g)||[];for(const n of o){const r=C(n);if(R(r))return r}for(const n of e.split(/[\r\n|?&=;]/)){const r=C(n.replace(/O/g,"0"));if(r.length===44&&R(r))return r}return null}const G=t=>{if(t==null)return null;const e=String(t).trim(),a=e.includes(",")?Number(e.replace(/\./g,"").replace(",",".")):Number(e);return Number.isFinite(a)?a:null};function Et(t=""){const e={raw:t,url:null,chave:null,valor:null,dia:null,dataEmissao:null,versao:null};/^https?:\/\//i.test(t.trim())&&(e.url=t.trim());let a;try{a=new URL(t.trim()).searchParams}catch{a=new URLSearchParams(t.split("?")[1]||"")}const o=a.get("p");if(o){const n=o.split("|"),r=C(n[0]);e.chave=R(r)||r.length===44?r:null,e.versao=n[1],(e.chave?e.chave[34]:null)==="9"&&n.length>=6&&(e.dia=Number(n[3])||null,e.valor=G(n[4]))}else if(a.get("chNFe")){e.chave=R(a.get("chNFe"))?C(a.get("chNFe")):null,e.versao="1",e.valor=G(a.get("vNF"));const n=a.get("dhEmi");if(n)try{const c=n.match(/../g).map(i=>String.fromCharCode(parseInt(i,16))).join("").slice(0,10);/^\d{4}-\d{2}-\d{2}$/.test(c)&&(e.dataEmissao=c)}catch{}}return e.chave||(e.chave=Z(t)),e}function Mt(t){return t.qrUrl?t.qrUrl:t.modelo==="55"?"https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=resumo&tipoConteudo=7PhJ+gAVw2g=":null}const St=/(?:R\$\s*)?(\d{1,3}(?:[.\s]\d{3})*,\d{2}|\d+,\d{2})/g,$t=[/VALOR\s+TOTAL\s+DA\s+NOTA/i,/V(?:ALOR|L)?\.?\s*TOTAL\s*(?:R\$)?/i,/VALOR\s+A\s+PAGAR/i,/TOTAL\s+A\s+PAGAR/i,/TOTAL\s*R\$/i,/\bTOTAL\b/i];function ot(t){return[...t.matchAll(St)].map(e=>G(e[1].replace(/\s/g,"."))).filter(e=>e!=null)}function Ct(t=""){const e=t.split(/\n/).map(s=>s.trim()).filter(Boolean),a={chave:Z(t),cnpj:null,dataEmissao:null,valor:null,emitente:null},o=t.match(/\b(\d{2}[.\s]?\d{3}[.\s]?\d{3}\s?\/?\s?\d{4}\s?-?\s?\d{2})\b/);if(o){const s=o[1].replace(/\D/g,"");s.length===14&&(a.cnpj=s)}const n=/\b(\d{2})[\/\-.](\d{2})[\/\-.](\d{4})\b/;let r=e.find(s=>/EMISS/i.test(s)&&n.test(s));if(!r){const s=e.findIndex(l=>/EMISS/i.test(l));s>=0&&(r=e.slice(s,s+3).find(l=>n.test(l)))}if(r=r||e.find(s=>n.test(s)),r){const[,s,l,h]=r.match(n);+l>=1&&+l<=12&&+s>=1&&+s<=31&&(a.dataEmissao=`${h}-${l}-${s}`)}t:for(const s of $t)for(let l=0;l<e.length;l++)if(!(!s.test(e[l])||/SUBTOTAL|TRIBUT|ICMS|IMPOSTO|DESCONTO/i.test(e[l])))for(let h=l;h<Math.min(l+3,e.length);h++){const m=ot(e[h]);if(m.length){a.valor=m[m.length-1];break t}}if(a.valor==null){const s=e.flatMap(ot);s.length&&(a.valor=Math.max(...s))}const c=e.findIndex(s=>/CNPJ/i.test(s)),d=e.slice(0,c>0?c:6).find(s=>{const l=s.replace(/[^A-Za-zÀ-ú]/g,"").length;return l>=5&&l/s.length>.6&&!/DANFE|DOCUMENTO|NOTA FISCAL|CONSUMIDOR|ELETR[OÔ]NICA|AUXILIAR/i.test(s)});return d&&(a.emitente=d.replace(/\s{2,}/g," ").slice(0,80)),a}const T=[{id:"mercado",nome:"Mercado",cor:"#34d399",re:/MERCAD|SUPERM|ATACAD|HORTI|PADARIA|PANIFIC|ASSAI|CARREFOUR|ATACAD[AÃ]O|EXTRA|P[AÃ]O DE A[CÇ]/i},{id:"restaurante",nome:"Restaurante",cor:"#fbbf24",re:/RESTAUR|LANCH|BURGER|PIZZ|BAR\b|CAFE|CAFÉ|IFOOD|MC ?DONALD|SUSHI|CHURRAS/i},{id:"combustivel",nome:"Combustível",cor:"#f87171",re:/POSTO|COMBUST|PETRO|SHELL|IPIRANGA|AUTO ?POSTO|GASOL/i},{id:"farmacia",nome:"Farmácia",cor:"#60a5fa",re:/FARM|DROGA|RAIA|PAGUE MENOS|PACHECO/i},{id:"casa",nome:"Casa & Obra",cor:"#a78bfa",re:/CONSTRU|MATERIA|LEROY|TELHA|ELETRO|MAGAZINE|CASAS BAHIA/i},{id:"servicos",nome:"Serviços",cor:"#22d3ee",re:/SERVI[CÇ]|TELECOM|ENERGIA|SANEAMENTO|INTERNET/i},{id:"outros",nome:"Outros",cor:"#94a3b8",re:null}];function At(t=""){const e=T.find(a=>a.re&&a.re.test(t));return e?e.id:"outros"}const D=t=>T.find(e=>e.id===t)||T[T.length-1],Rt=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}),$=t=>Rt.format(Number(t)||0);function P(t){if(!t)return"—";const[e,a,o]=t.split("-");return`${o}/${a}/${e}`}const Lt=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];function Tt(t,e=!1){const[a,o]=t.split("-").map(Number);if(e){const n=new Intl.DateTimeFormat("pt-BR",{month:"long"}).format(new Date(a,o-1,1));return`${n[0].toUpperCase()}${n.slice(1)} ${a}`}return`${Lt[o-1]}/${String(a).slice(2)}`}const Nt="https://docs.opencv.org/4.10.0/opencv.js";let F=null;function pt(){return F||(F=new Promise((t,e)=>{if(window.cv&&window.cv.Mat)return t(window.cv);const a=document.createElement("script");a.src=Nt,a.async=!0,a.onerror=()=>{F=null,e(new Error("Falha ao carregar o OpenCV.js"))},a.onload=()=>{const o=window.cv;o instanceof Promise?o.then(n=>{window.cv=n,t(n)}):o.Mat?t(o):o.onRuntimeInitialized=()=>t(o)},document.head.appendChild(a)}),F)}const Ot=()=>!!(window.cv&&window.cv.Mat),j=(t,e)=>Math.hypot(t.x-e.x,t.y-e.y);function Pt(t){const e=[...t].sort((o,n)=>o.x+o.y-(n.x+n.y)),a=[...t].sort((o,n)=>o.y-o.x-(n.y-n.x));return[e[0],a[0],e[3],a[3]]}function V(t,e,a=.06){const o=t*a,n=e*a;return[{x:o,y:n},{x:t-o,y:n},{x:t-o,y:e-n},{x:o,y:e-n}]}function rt(t,e=document.createElement("canvas")){const a=window.cv;if(!a||!a.Mat)return null;const o=t.videoWidth||t.width,n=t.videoHeight||t.height;if(!o||!n)return null;const r=480/Math.max(o,n);e.width=Math.round(o*r),e.height=Math.round(n*r),e.getContext("2d",{willReadFrequently:!0}).drawImage(t,0,0,e.width,e.height);const i=a.imread(e),d=new a.Mat,s=new a.Mat,l=new a.MatVector,h=new a.Mat,m=a.getStructuringElement(a.MORPH_RECT,new a.Size(5,5));let p=null;try{a.cvtColor(i,d,a.COLOR_RGBA2GRAY),a.GaussianBlur(d,d,new a.Size(5,5),0),a.morphologyEx(d,d,a.MORPH_CLOSE,m,new a.Point(-1,-1),2),a.Canny(d,s,30,120),a.dilate(s,s,m),a.findContours(s,l,h,a.RETR_LIST,a.CHAIN_APPROX_SIMPLE);const y=e.width*e.height*.12;let f=0;for(let w=0;w<l.size();w++){const E=l.get(w),M=a.contourArea(E);if(M>y&&M>f){const q=a.arcLength(E,!0),S=new a.Mat;if(a.approxPolyDP(E,S,.02*q,!0),S.rows===4&&a.isContourConvex(S)){f=M,p=[];for(let A=0;A<4;A++)p.push({x:S.data32S[A*2]/r,y:S.data32S[A*2+1]/r})}S.delete()}E.delete()}}finally{i.delete(),d.delete(),s.delete(),l.delete(),h.delete(),m.delete()}return p?Pt(p):null}function Ft(t,e){const a=window.cv,[o,n,r,c]=e;let i=Math.round(Math.max(j(o,n),j(c,r))),d=Math.round(Math.max(j(o,c),j(n,r)));const l=Math.min(1,2400/Math.max(i,d));i=Math.round(i*l),d=Math.round(d*l);const h=document.createElement("canvas");if(h.width=i,h.height=d,!a||!a.Mat){const E=e.map(A=>A.x),M=e.map(A=>A.y),q=Math.min(...E),S=Math.min(...M);return h.getContext("2d").drawImage(t,q,S,Math.max(...E)-q,Math.max(...M)-S,0,0,i,d),h}const m=a.imread(t),p=new a.Mat,y=a.matFromArray(4,1,a.CV_32FC2,[o.x,o.y,n.x,n.y,r.x,r.y,c.x,c.y]),f=a.matFromArray(4,1,a.CV_32FC2,[0,0,i,0,i,d,0,d]),w=a.getPerspectiveTransform(y,f);try{a.warpPerspective(m,p,w,new a.Size(i,d),a.INTER_CUBIC,a.BORDER_REPLICATE),a.imshow(h,p)}finally{m.delete(),p.delete(),y.delete(),f.delete(),w.delete()}return h}const it=[{id:"magic",nome:"Mágico"},{id:"original",nome:"Original"},{id:"gray",nome:"Cinza"},{id:"bw",nome:"P&B"},{id:"vivid",nome:"Vívido"}];function st(t,e){const a=window.cv,o=document.createElement("canvas");if(o.width=t.width,o.height=t.height,e==="original"||!a||!a.Mat)return o.getContext("2d").drawImage(t,0,0),e!=="original"&&It(o,e),o;const n=a.imread(t),r=new a.Mat,c=new a.Mat,i=new a.Mat,d=new a.Mat,s=a.getStructuringElement(a.MORPH_RECT,new a.Size(9,9));try{a.cvtColor(n,r,a.COLOR_RGBA2RGB);const l=()=>(a.dilate(r,i,s),a.medianBlur(i,i,21),a.divide(r,i,c,255),c);switch(e){case"magic":{l().convertTo(d,-1,1.15,-18);break}case"gray":{a.cvtColor(l(),d,a.COLOR_RGB2GRAY),a.normalize(d,d,0,255,a.NORM_MINMAX);break}case"bw":{const h=new a.Mat;a.cvtColor(l(),h,a.COLOR_RGB2GRAY),a.adaptiveThreshold(h,d,255,a.ADAPTIVE_THRESH_GAUSSIAN_C,a.THRESH_BINARY,31,12),h.delete();break}case"vivid":{r.convertTo(d,-1,1.35,-25);break}default:r.copyTo(d)}a.imshow(o,d)}finally{n.delete(),r.delete(),c.delete(),i.delete(),d.delete(),s.delete()}return o}function It(t,e){const a={magic:"contrast(1.4) brightness(1.1) saturate(1.1)",gray:"grayscale(1) contrast(1.3)",bw:"grayscale(1) contrast(3)",vivid:"contrast(1.35) saturate(1.3)"},o=document.createElement("canvas");o.width=t.width,o.height=t.height,o.getContext("2d").drawImage(t,0,0);const n=t.getContext("2d");n.filter=a[e]||"none",n.drawImage(o,0,0),n.filter="none"}function kt(t,e=!0){const a=document.createElement("canvas");a.width=t.height,a.height=t.width;const o=a.getContext("2d");return o.translate(a.width/2,a.height/2),o.rotate((e?1:-1)*Math.PI/2),o.drawImage(t,-t.width/2,-t.height/2),a}function Dt(t,e){const a=t.videoWidth||t.naturalWidth||t.width,o=t.videoHeight||t.naturalHeight||t.height,n=Math.min(1,e/Math.max(a,o)),r=document.createElement("canvas");return r.width=Math.round(a*n),r.height=Math.round(o*n),r.getContext("2d").drawImage(t,0,0,r.width,r.height),r}const ct=(t,e="image/jpeg",a=.85)=>new Promise(o=>t.toBlob(o,e,a));async function qt(t,e=3e3){const a=await createImageBitmap(t,{imageOrientation:"from-image"}),o=Dt(a,e);return a.close?.(),o}const jt="modulepreload",Bt=function(t){return"/notascan-projeto/"+t},lt={},K=function(e,a,o){let n=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),i=c?.nonce||c?.getAttribute("nonce");n=Promise.allSettled(a.map(d=>{if(d=Bt(d),d in lt)return;lt[d]=!0;const s=d.endsWith(".css"),l=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${l}`))return;const h=document.createElement("link");if(h.rel=s?"stylesheet":jt,s||(h.as="script"),h.crossOrigin="",h.href=d,i&&h.setAttribute("nonce",i),document.head.appendChild(h),s)return new Promise((m,p)=>{h.addEventListener("load",m),h.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(c){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=c,window.dispatchEvent(i),!i.defaultPrevented)throw c}return n.then(c=>{for(const i of c||[])i.status==="rejected"&&r(i.reason);return e().catch(r)})},dt=["qr_code","code_128","itf","pdf417","data_matrix"];let B=null;async function Ht(){return B||(B=(async()=>{if("BarcodeDetector"in window)try{const e=await window.BarcodeDetector.getSupportedFormats();if(e.includes("qr_code")&&e.includes("code_128"))return new window.BarcodeDetector({formats:dt.filter(a=>e.includes(a))})}catch{}const{BarcodeDetector:t}=await K(async()=>{const{BarcodeDetector:e}=await import("./pure-BTZ2h3Xb.js");return{BarcodeDetector:e}},[]);return new t({formats:dt})})(),B)}async function vt(t){try{return await(await Ht()).detect(t)}catch(e){return console.warn("Falha na leitura de códigos",e),[]}}function gt(t){const e={chave:null,qrUrl:null,valor:null,dataEmissao:null,dia:null,codes:[]};for(const a of t){const o=a.rawValue||"";if(e.codes.push({format:a.format,raw:o}),a.format==="qr_code"&&/p=|chNFe=|nfce|fazenda|sefaz/i.test(o)){const n=Et(o);e.qrUrl=e.qrUrl||n.url,e.chave=e.chave||n.chave,e.valor=e.valor??n.valor,e.dataEmissao=e.dataEmissao||n.dataEmissao,e.dia=e.dia||n.dia}else{const n=C(o);R(n)?e.chave=e.chave||n:e.chave=e.chave||Z(o)}}return e}let H=null;async function W(t){return H||(H=(async()=>{const{createWorker:e}=await K(async()=>{const{createWorker:a}=await import("./index-BZH6TDpT.js").then(o=>o.i);return{createWorker:a}},[]);return e("por",1,{logger:a=>W.onProgress?.(a)})})().catch(e=>{throw H=null,e})),W.onProgress=t,H}async function Ut(t,e){const a=await W(e),{data:o}=await a.recognize(t);return o.text||""}const _t="notascan",Q="notas";let U=null;function zt(){return U||(U=new Promise((t,e)=>{const a=indexedDB.open(_t,1);a.onupgradeneeded=()=>{const n=a.result.createObjectStore(Q,{keyPath:"id"});n.createIndex("chave","chave",{unique:!1}),n.createIndex("dataEmissao","dataEmissao",{unique:!1})},a.onsuccess=()=>t(a.result),a.onerror=()=>e(a.error)}),U)}async function _(t,e){const a=await zt();return new Promise((o,n)=>{const r=a.transaction(Q,t),c=r.objectStore(Q);let i;Promise.resolve(e(c)).then(d=>{i=d}),r.oncomplete=()=>o(i),r.onerror=()=>n(r.error),r.onabort=()=>n(r.error)})}const z=t=>new Promise((e,a)=>{t.onsuccess=()=>e(t.result),t.onerror=()=>a(t.error)}),Vt=()=>_("readonly",t=>z(t.getAll())).then(t=>t.sort((e,a)=>(a.dataEmissao||"").localeCompare(e.dataEmissao||"")||a.criadoEm-e.criadoEm)),Gt=t=>_("readwrite",e=>z(e.put(t))),Wt=t=>_("readwrite",e=>z(e.delete(t)));async function Qt(t){return t?_("readonly",e=>z(e.index("chave").get(t))):null}async function Yt(){try{navigator.storage?.persist&&await navigator.storage.persist()}catch{}}function Xt(t,e){const a=document.createElement("a");a.href=URL.createObjectURL(t),a.download=e,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(a.href),4e3)}const Y=()=>new Date().toISOString().slice(0,10);function Jt(t){const e=["Data emissão","Emitente","CNPJ","Modelo","UF","Série","Número","Valor","Categoria","Chave de acesso","Observação"],a=r=>{const c=r==null?"":String(r);return/[;"\n]/.test(c)?`"${c.replace(/"/g,'""')}"`:c},o=t.map(r=>[P(r.dataEmissao),r.emitente,k(r.cnpj||""),I[r.modelo]||r.modelo||"",r.uf,r.serie,r.numero,(Number(r.valor)||0).toFixed(2).replace(".",","),D(r.categoria).nome,r.chave?`'${r.chave}`:"",r.observacao].map(a).join(";")),n="\uFEFF"+[e.join(";"),...o].join(`\r
`);Xt(new Blob([n],{type:"text/csv;charset=utf-8"}),`notas-${Y()}.csv`)}const Zt=t=>new Promise(e=>{const a=new FileReader;a.onload=()=>e(a.result),a.readAsDataURL(t)}),Kt=t=>new Promise(e=>{const a=new Image;a.onload=()=>e({w:a.naturalWidth,h:a.naturalHeight}),a.src=t});async function te(t,{filename:e,onProgress:a}={}){const{jsPDF:o}=await K(async()=>{const{jsPDF:s}=await import("./jspdf.es.min-ftlJ49hp.js").then(l=>l.j);return{jsPDF:s}},[]),n=new o({unit:"mm",format:"a4"}),r=210,c=297,i=12,d=t.reduce((s,l)=>s+(Number(l.valor)||0),0);if(t.length>1){n.setFillColor(11,15,25),n.rect(0,0,r,48,"F"),n.setTextColor(255),n.setFont("helvetica","bold"),n.setFontSize(22),n.text("NotaScan — Relatório de notas",i,22),n.setFont("helvetica","normal"),n.setFontSize(11),n.text(`${t.length} notas  •  Total ${$(d)}  •  Gerado em ${P(Y())}`,i,34),n.setTextColor(30),n.setFontSize(9);let s=60;n.setFont("helvetica","bold"),n.text("Data",i,s),n.text("Emitente",i+24,s),n.text("Modelo",i+118,s),n.text("Valor",r-i,s,{align:"right"}),n.setFont("helvetica","normal"),s+=6;for(const l of t)s>c-i&&(n.addPage(),s=i+6),n.text(P(l.dataEmissao),i,s),n.text(String(l.emitente||"—").slice(0,52),i+24,s),n.text(I[l.modelo]||"—",i+118,s),n.text($(l.valor),r-i,s,{align:"right"}),s+=5.5}for(let s=0;s<t.length;s++){const l=t[s];a?.(s+1,t.length),(s>0||t.length>1)&&n.addPage(),n.setTextColor(20),n.setFont("helvetica","bold"),n.setFontSize(14),n.text(String(l.emitente||"Emitente não informado").slice(0,60),i,i+6),n.setFont("helvetica","normal"),n.setFontSize(9.5),n.setTextColor(70),[`${I[l.modelo]||"Documento"}${l.numero?` nº ${l.numero}`:""}${l.serie?` série ${l.serie}`:""}${l.uf?` • ${l.uf}`:""}`,`CNPJ ${l.cnpj?k(l.cnpj):"—"}   •   Emissão ${P(l.dataEmissao)}   •   ${D(l.categoria).nome}`,l.chave?`Chave ${J(l.chave)}`:"Chave de acesso não identificada"].forEach((p,y)=>n.text(p,i,i+13+y*5)),n.setFont("helvetica","bold"),n.setFontSize(16),n.setTextColor(16,150,110),n.text($(l.valor),r-i,i+6,{align:"right"});const m=i+32;if(l.imagem){const p=await Zt(l.imagem),{w:y,h:f}=await Kt(p),w=r-2*i,E=c-m-i,M=Math.min(w/y,E/f);n.addImage(p,"JPEG",i+(w-y*M)/2,m,y*M,f*M,void 0,"FAST")}}n.save(e||`notas-${Y()}.pdf`)}const g={tab:"notas",notas:[],filtroMes:"todos",filtroCat:"todas",busca:"",capturedCanvas:null,cropQuad:null,activeFilter:"magic",processedCanvas:null},ee=document.getElementById("app"),u=document.getElementById("dlg"),ae=document.getElementById("toasts");let O=null;const ft=()=>window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0;window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),O=t});window.addEventListener("appinstalled",()=>{O=null,document.getElementById("btn-install-app")?.setAttribute("hidden",""),x("NotaScan instalado com sucesso!","success")});"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/notascan-projeto/sw.js").catch(t=>console.warn("Não foi possível ativar o modo instalável",t))});"closedBy"in HTMLDialogElement.prototype||u.addEventListener("click",t=>{if(t.target!==u)return;const e=u.getBoundingClientRect();e.top<=t.clientY&&t.clientY<=e.top+e.height&&e.left<=t.clientX&&t.clientX<=e.left+e.width||u.close()});function x(t,e="info",a=3500){const o=document.createElement("div");o.className=`toast ${e}`;const n=e==="success"?v.check:e==="error"?v.alert:v.sparkle;o.innerHTML=`${n} <span>${t}</span>`,ae.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateY(10px)",setTimeout(()=>o.remove(),250)},a)}async function ne(){await Yt(),pt().catch(()=>console.log("OpenCV será carregado sob demanda")),await tt(),L()}async function tt(){g.notas=await Vt()}function L(){ee.innerHTML=`
    <header class="app-header">
      <div class="brand">
        <div class="brand-icon">${v.logo}</div>
        <div class="brand-text">
          <h1>NotaScan</h1>
          <p>Scanner Fiscal Inteligente</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary btn-install" id="btn-install-app" ${ft()?"hidden":""}>
          ${v.install} <span>Instalar app</span>
        </button>
        <button class="btn btn-secondary" id="btn-import-file" title="Importar foto ou documento">
          ${v.upload} <span>Importar</span>
        </button>
        <button class="btn btn-secondary" id="btn-export-menu" title="Exportar dados">
          ${v.download} <span>Exportar</span>
        </button>
      </div>
    </header>

    ${oe()}

    <div class="section-header">
      <h2 class="section-title">Minhas Notas Fiscais</h2>
      <div class="search-box">
        ${v.search}
        <input type="text" id="input-search" placeholder="Buscar emitente, chave..." value="${N(g.busca)}">
      </div>
    </div>

    ${re()}
    ${ie()}

    <nav class="bottom-bar" aria-label="Navegação principal">
      <button class="bottom-tab ${g.tab==="notas"?"active":""}" id="tab-notas">
        ${v.file} <span>Notas</span>
      </button>
      <button class="btn-scan-hero" id="btn-open-camera">
        ${v.camera} <span>Escanear</span>
      </button>
      <button class="bottom-tab ${g.tab==="dashboard"?"active":""}" id="tab-dash">
        ${v.trend} <span>Resumo</span>
      </button>
    </nav>
  `,se()}function oe(){const t=et(),e=t.reduce((c,i)=>c+(Number(i.valor)||0),0),a=t.length>0?e/t.length:0,o={};t.forEach(c=>{o[c.categoria]=(o[c.categoria]||0)+1});const n=Object.entries(o).sort((c,i)=>i[1]-c[1])[0]?.[0]||"outros",r=D(n);return`
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">
          <span>Total Escaneado</span>
          ${v.sheet}
        </div>
        <div class="stat-value">${$(e)}</div>
        <div class="stat-sub">${t.length} nota${t.length===1?"":"s"} no filtro</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          <span>Ticket Médio</span>
          ${v.sparkle}
        </div>
        <div class="stat-value">${$(a)}</div>
        <div class="stat-sub">Média por documento</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">
          <span>Categoria Principal</span>
          ${v.building}
        </div>
        <div class="stat-value" style="font-size: 1.35rem; color: ${r.cor}">
          ${r.nome}
        </div>
        <div class="stat-sub">Mais recorrente</div>
      </div>
    </div>
  `}function re(){const t=Array.from(new Set(g.notas.map(o=>o.anoMes).filter(Boolean))).sort().reverse();let e=`<button class="chip ${g.filtroMes==="todos"?"active":""}" data-mes="todos">Todos os meses</button>`;t.forEach(o=>{e+=`<button class="chip ${g.filtroMes===o?"active":""}" data-mes="${o}">${Tt(o)}</button>`});let a=`<button class="chip ${g.filtroCat==="todas"?"active":""}" data-cat="todas">Todas categorias</button>`;return T.forEach(o=>{a+=`<button class="chip ${g.filtroCat===o.id?"active":""}" data-cat="${o.id}" style="${g.filtroCat===o.id?`border-color: ${o.cor}; color: ${o.cor}`:""}">${o.nome}</button>`}),`
    <div class="filter-chips">${e}</div>
    <div class="filter-chips" style="margin-top: -8px;">${a}</div>
  `}function ie(){const t=et();return t.length===0?`
      <div class="empty-state">
        <div class="empty-icon">${v.scan}</div>
        <h3>Nenhuma nota fiscal encontrada</h3>
        <p>Aponte a câmera para um cupom fiscal (NFC-e) ou DANFE (NF-e) para escanear com corte automático e OCR.</p>
        <button class="btn btn-primary" id="btn-empty-scan">${v.camera} Escanear Agora</button>
      </div>
    `:`
    <div class="notas-grid">
      ${t.map(e=>{const a=D(e.categoria),o=e.thumbBlob?URL.createObjectURL(e.thumbBlob):null;return`
          <div class="nota-card" data-id="${e.id}">
            <div class="nota-thumb">
              ${o?`<img src="${o}" alt="Miniatura da nota" loading="lazy">`:v.file}
            </div>
            <div class="nota-info">
              <div>
                <div class="nota-top">
                  <h4 class="nota-emitente" title="${N(e.emitente||"Sem nome")}">${N(e.emitente||"Emitente não identificado")}</h4>
                  <span class="nota-badge" style="background: ${a.cor}22; color: ${a.cor}">${e.modelo==="65"?"NFC-e":e.modelo==="55"?"NF-e":"DOC"}</span>
                </div>
                <div class="nota-meta">
                  <span>${P(e.dataEmissao)}</span>
                  ${e.cnpj?` • ${k(e.cnpj)}`:""}
                </div>
              </div>
              <div class="nota-bottom">
                <span class="nota-valor">${$(e.valor)}</span>
                <span class="nota-tag">
                  <span class="nota-tag-dot" style="background: ${a.cor}"></span>
                  ${a.nome}
                </span>
              </div>
            </div>
          </div>
        `}).join("")}
    </div>
  `}function et(){return g.notas.filter(t=>{if(g.filtroMes!=="todos"&&t.anoMes!==g.filtroMes||g.filtroCat!=="todas"&&t.categoria!==g.filtroCat)return!1;if(g.busca){const e=g.busca.toLowerCase(),a=(t.emitente||"").toLowerCase().includes(e),o=(t.chave||"").includes(e.replace(/\s/g,"")),n=(t.cnpj||"").includes(e.replace(/\D/g,""));if(!a&&!o&&!n)return!1}return!0})}function se(){document.getElementById("btn-install-app")?.addEventListener("click",ce),document.getElementById("tab-notas")?.addEventListener("click",()=>{g.tab="notas",L()}),document.getElementById("tab-dash")?.addEventListener("click",()=>{pe()}),document.getElementById("btn-open-camera")?.addEventListener("click",ut),document.getElementById("btn-empty-scan")?.addEventListener("click",ut),document.getElementById("btn-import-file")?.addEventListener("click",X),document.getElementById("btn-export-menu")?.addEventListener("click",me),document.querySelectorAll("[data-mes]").forEach(e=>{e.addEventListener("click",()=>{g.filtroMes=e.getAttribute("data-mes"),L()})}),document.querySelectorAll("[data-cat]").forEach(e=>{e.addEventListener("click",()=>{g.filtroCat=e.getAttribute("data-cat"),L()})});const t=document.getElementById("input-search");t?.addEventListener("input",e=>{g.busca=e.target.value,clearTimeout(t._t),t._t=setTimeout(()=>L(),220)}),document.querySelectorAll(".nota-card").forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-id"),o=g.notas.find(n=>n.id===a);o&&ue(o)})})}async function ce(){if(ft()){x("O NotaScan já está instalado neste aparelho.","info");return}if(O){O.prompt();const{outcome:a}=await O.userChoice;a==="accepted"?x("Instalação iniciada!","success"):x("Instalação cancelada. Você pode tentar novamente pelo menu do navegador.","info"),O=null;return}const e=/iphone|ipad|ipod/i.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1?"<p>No Safari, toque em <strong>Compartilhar</strong> e depois em <strong>Adicionar à Tela de Início</strong>.</p>":"<p>Abra o menu do navegador e escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>. Se a opção não aparecer, abra esta página no Safari (iPhone) ou Chrome (Android) usando o endereço HTTPS publicado do app.</p>";u.innerHTML=`
    <div class="dlg-header">
      <h2 id="dlg-title">Instalar NotaScan</h2>
      <button class="btn btn-icon btn-secondary" id="btn-close-dlg" aria-label="Fechar">${v.x}</button>
    </div>
    <div class="dlg-body install-help">
      <div class="install-help-icon">${v.install}</div>
      ${e}
      <p class="install-help-note">Depois de instalado, o NotaScan abre como um app e mantém suas notas neste aparelho.</p>
    </div>
    <div class="dlg-footer"><button class="btn btn-primary" id="btn-close-install">Entendi</button></div>
  `,u.showModal(),u.querySelector("#btn-close-dlg").onclick=()=>u.close(),u.querySelector("#btn-close-install").onclick=()=>u.close()}async function ut(){const t=document.createElement("div");t.className="scanner-overlay",t.id="scanner-view",t.innerHTML=`
    <div class="scanner-header">
      <button class="btn btn-icon btn-secondary" id="btn-close-scanner" aria-label="Fechar câmera">${v.x}</button>
      <span class="scanner-title">Posicione a Nota Fiscal</span>
      <button class="btn btn-icon btn-secondary" id="btn-toggle-torch" style="display: none;" aria-label="Lanterna">${v.bolt}</button>
    </div>
    <div class="scanner-viewport">
      <video id="scanner-video" playsinline autoplay muted></video>
      <canvas class="overlay-canvas" id="scanner-canvas"></canvas>
      <div class="scan-laser"></div>
    </div>
    <div class="scanner-controls">
      <button class="btn btn-icon btn-secondary" id="btn-pick-image" title="Carregar da galeria">${v.image}</button>
      <button class="shutter-btn" id="btn-shutter" aria-label="Tirar foto">
        <div class="shutter-btn-inner"></div>
      </button>
      <button class="btn btn-icon btn-secondary" id="btn-manual-key" title="Digitar chave manualmente">${v.keyboard}</button>
    </div>
  `,document.body.appendChild(t);const e=t.querySelector("#scanner-video"),a=t.querySelector("#scanner-canvas"),o=t.querySelector("#btn-close-scanner"),n=t.querySelector("#btn-shutter"),r=t.querySelector("#btn-toggle-torch"),c=t.querySelector("#btn-pick-image"),i=t.querySelector("#btn-manual-key");let d=null,s=null,l=null,h=!1;const m=()=>{s&&cancelAnimationFrame(s),d&&d.getTracks().forEach(p=>p.stop()),t.remove()};o.addEventListener("click",m),c.addEventListener("click",()=>{m(),X()}),i.addEventListener("click",()=>{m(),he()});try{d=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1920},height:{ideal:1080}},audio:!1}),e.srcObject=d,await e.play(),l=d.getVideoTracks()[0],(l.getCapabilities?l.getCapabilities():{}).torch&&(r.style.display="inline-flex",r.addEventListener("click",async()=>{h=!h,await l.applyConstraints({advanced:[{torch:h}]}),r.style.color=h?"#fbbf24":"#fff"}));let y=0;const f=a.getContext("2d"),w=async()=>{if(!e.videoWidth){s=requestAnimationFrame(w);return}a.width=e.videoWidth,a.height=e.videoHeight,f.clearRect(0,0,a.width,a.height),y++,y%30===0&&vt(e).then(E=>{if(E.length>0){const M=gt(E);(M.chave||M.qrUrl)&&x("Código de barras / QR identificado!","success")}}).catch(()=>{}),s=requestAnimationFrame(w)};s=requestAnimationFrame(w)}catch(p){x("Não foi possível acessar a câmera: "+p.message,"error"),m(),X();return}n.addEventListener("click",async()=>{const p=document.createElement("canvas");p.width=e.videoWidth,p.height=e.videoHeight,p.getContext("2d").drawImage(e,0,0),m(),at(p)})}function X(){const t=document.createElement("input");t.type="file",t.accept="image/*,application/pdf",t.onchange=async e=>{const a=e.target.files[0];if(a)try{x("Carregando imagem...","info",1500);const o=await qt(a);at(o)}catch(o){x("Erro ao abrir imagem: "+o.message,"error")}},t.click()}function at(t){g.capturedCanvas=t;const e=document.createElement("div");e.className="scanner-overlay",e.id="crop-view",e.innerHTML=`
    <div class="scanner-header">
      <button class="btn btn-icon btn-secondary" id="btn-cancel-crop">${v.back}</button>
      <span class="scanner-title">Ajuste as Bordas</span>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-icon btn-secondary" id="btn-rotate" title="Girar 90°">${v.rotR}</button>
        <button class="btn btn-primary" id="btn-apply-crop">
          <span>Avançar</span> ${v.chevR}
        </button>
      </div>
    </div>
    <div class="crop-canvas-wrapper" id="crop-wrapper">
      <canvas id="crop-canvas"></canvas>
    </div>
    <div class="crop-toolbar">
      <button class="btn btn-secondary" id="btn-full-doc">${v.expand} Imagem Completa</button>
      <button class="btn btn-secondary" id="btn-auto-detect">${v.auto} Auto Detectar</button>
    </div>
  `,document.body.appendChild(e);const a=e.querySelector("#crop-canvas"),o=e.querySelector("#crop-wrapper"),n=a.getContext("2d");let r=null;if(Ot())try{r=rt(t)}catch{}g.cropQuad=r||V(t.width,t.height,.05);let c=null;function i(){const m=o.getBoundingClientRect(),p=Math.min((m.width-32)/t.width,(m.height-32)/t.height);a.width=Math.round(t.width*p),a.height=Math.round(t.height*p),n.drawImage(t,0,0,a.width,a.height);const y=g.cropQuad.map(f=>({x:f.x*p,y:f.y*p}));n.fillStyle="rgba(16, 185, 129, 0.15)",n.strokeStyle="#34d399",n.lineWidth=3,n.beginPath(),n.moveTo(y[0].x,y[0].y),y.forEach(f=>n.lineTo(f.x,f.y)),n.closePath(),n.fill(),n.stroke(),y.forEach((f,w)=>{n.fillStyle="#ffffff",n.strokeStyle="#059669",n.lineWidth=4,n.beginPath(),n.arc(f.x,f.y,14,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="#059669",n.beginPath(),n.arc(f.x,f.y,5,0,Math.PI*2),n.fill()})}function d(m){const p=a.getBoundingClientRect(),y=m.touches?m.touches[0].clientX:m.clientX,f=m.touches?m.touches[0].clientY:m.clientY,w=a.width/t.width;return{x:(y-p.left)/w,y:(f-p.top)/w}}const s=m=>{const p=d(m);let y=50;c=null,g.cropQuad.forEach((f,w)=>{const E=Math.hypot(f.x-p.x,f.y-p.y);E<y&&(y=E,c=w)})},l=m=>{if(c===null)return;m.preventDefault();const p=d(m);g.cropQuad[c]={x:Math.max(0,Math.min(t.width,p.x)),y:Math.max(0,Math.min(t.height,p.y))},i()},h=()=>{c=null};a.addEventListener("mousedown",s),window.addEventListener("mousemove",l),window.addEventListener("mouseup",h),a.addEventListener("touchstart",s,{passive:!1}),window.addEventListener("touchmove",l,{passive:!1}),window.addEventListener("touchend",h),i(),window.addEventListener("resize",i),e.querySelector("#btn-cancel-crop").onclick=()=>e.remove(),e.querySelector("#btn-rotate").onclick=()=>{t=kt(t,!0),g.capturedCanvas=t,g.cropQuad=V(t.width,t.height,.05),i()},e.querySelector("#btn-full-doc").onclick=()=>{g.cropQuad=V(t.width,t.height,0),i()},e.querySelector("#btn-auto-detect").onclick=async()=>{x("Detectando bordas...","info",1e3),await pt();const m=rt(t);m?(g.cropQuad=m,i()):x("Bordas automáticas não encontradas, use os cantos manuais","info")},e.querySelector("#btn-apply-crop").onclick=async()=>{x("Processando recorte...","info",1e3);const m=Ft(t,g.cropQuad);e.remove(),le(m)}}function le(t){g.processedCanvas=t;const e=document.createElement("div");e.className="scanner-overlay",e.id="filter-view",e.innerHTML=`
    <div class="scanner-header">
      <button class="btn btn-icon btn-secondary" id="btn-back-crop">${v.back}</button>
      <span class="scanner-title">Melhoria & OCR</span>
      <button class="btn btn-primary" id="btn-start-ocr">
        ${v.sparkle} <span>Reconhecer</span>
      </button>
    </div>
    <div class="crop-canvas-wrapper" id="filter-wrapper">
      <canvas id="filter-canvas"></canvas>
    </div>
    <div class="filter-bar" id="filter-chips-bar">
      ${it.map(r=>`
        <button class="filter-thumb-btn ${g.activeFilter===r.id?"active":""}" data-filter="${r.id}">
          <div class="filter-thumb-preview" id="thumb-${r.id}"></div>
          <span>${r.nome}</span>
        </button>
      `).join("")}
    </div>
  `,document.body.appendChild(e);const a=e.querySelector("#filter-canvas"),o=e.querySelector("#filter-wrapper");function n(){const r=st(t,g.activeFilter);g.processedCanvas=r;const c=o.getBoundingClientRect(),i=Math.min((c.width-32)/r.width,(c.height-32)/r.height);a.width=Math.round(r.width*i),a.height=Math.round(r.height*i),a.getContext("2d").drawImage(r,0,0,a.width,a.height)}it.forEach(r=>{const c=e.querySelector(`#thumb-${r.id}`);if(c){const i=document.createElement("canvas");i.width=60,i.height=60,i.getContext("2d").drawImage(t,0,0,60,60);const d=st(i,r.id);c.appendChild(d)}}),n(),e.querySelectorAll("[data-filter]").forEach(r=>{r.onclick=()=>{e.querySelectorAll("[data-filter]").forEach(c=>c.classList.remove("active")),r.classList.add("active"),g.activeFilter=r.getAttribute("data-filter"),n()}}),e.querySelector("#btn-back-crop").onclick=()=>{e.remove(),at(g.capturedCanvas)},e.querySelector("#btn-start-ocr").onclick=async()=>{await de(g.processedCanvas,e)}}async function de(t,e){u.innerHTML=`
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
  `,u.showModal();const a=u.querySelector("#ocr-status-text"),o=u.querySelector("#ocr-progress");try{const n=await vt(t),r=gt(n);o.style.width="45%",a.innerText="Executando OCR em português...";const c=await Ut(t,p=>{if(p.status==="recognizing text"&&p.progress){const y=Math.round(45+p.progress*50);o.style.width=`${y}%`,a.innerText=`Lendo texto da nota (${Math.round(p.progress*100)}%)...`}});o.style.width="100%",a.innerText="Consolidando informações...";const i=Ct(c),d=r.chave||i.chave,s=mt(d),l={id:"nota_"+Date.now()+"_"+Math.random().toString(36).slice(2,6),criadoEm:Date.now(),chave:d||null,modelo:s?.modelo||(r.qrUrl?"65":d?"55":"65"),serie:s?.serie||"",numero:s?.numero||"",uf:s?.uf||"",anoMes:s?.anoMes||i.dataEmissao?.slice(0,7)||new Date().toISOString().slice(0,7),cnpj:s?.cnpj||r.cnpj||i.cnpj||"",emitente:i.emitente||(r.qrUrl?"NFC-e Emitida":"DANFE"),dataEmissao:r.dataEmissao||i.dataEmissao||new Date().toISOString().slice(0,10),valor:r.valor??i.valor??0,categoria:At(i.emitente||""),qrUrl:r.qrUrl||null,textoOCR:c,observacao:""},h=document.createElement("canvas"),m=360/Math.max(t.width,t.height);h.width=Math.round(t.width*m),h.height=Math.round(t.height*m),h.getContext("2d").drawImage(t,0,0,h.width,h.height),l.thumbBlob=await ct(h,"image/jpeg",.8),l.imagem=await ct(t,"image/jpeg",.85),u.close(),e&&e.remove(),nt(l,!0)}catch(n){u.close(),x("Falha na extração de dados: "+n.message,"error")}}async function nt(t,e=!1){let a=!1;if(t.chave){const c=await Qt(t.chave);c&&c.id!==t.id&&(a=!0)}u.innerHTML=`
    <div class="dlg-header">
      <h2 id="dlg-title">${e?"Confirmar Nota Fiscal":"Editar Nota Fiscal"}</h2>
      <button class="btn btn-icon btn-secondary" id="btn-close-dlg">${v.x}</button>
    </div>
    <div class="dlg-body">
      ${a?`
        <div style="background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.4); border-radius: var(--radius-md); padding: 12px; margin-bottom: 16px; font-size: 0.85rem; color: #fca5a5;">
          ${v.alert} <strong>Atenção:</strong> Já existe uma nota salva com esta mesma chave de acesso!
        </div>
      `:""}

      <div class="form-group">
        <label for="edit-emitente">Emitente / Estabelecimento</label>
        <input type="text" id="edit-emitente" value="${N(t.emitente||"")}" placeholder="Nome do mercado, loja...">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="edit-valor">Valor Total (R$)</label>
          <input type="number" step="0.01" id="edit-valor" value="${t.valor||0}">
        </div>
        <div class="form-group">
          <label for="edit-data">Data de Emissão</label>
          <input type="date" id="edit-data" value="${t.dataEmissao||""}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="edit-categoria">Categoria</label>
          <select id="edit-categoria">
            ${T.map(c=>`<option value="${c.id}" ${t.categoria===c.id?"selected":""}>${c.nome}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label for="edit-cnpj">CNPJ</label>
          <input type="text" id="edit-cnpj" value="${k(t.cnpj||"")}" placeholder="00.000.000/0000-00">
        </div>
      </div>

      <div class="form-group">
        <label for="edit-chave">Chave de Acesso (44 dígitos)</label>
        <input type="text" id="edit-chave" value="${J(t.chave||"")}" placeholder="Ex: 3524 0912 3456 ...">
        <small id="chave-status" style="display: block; margin-top: 4px; font-size: 0.75rem; color: var(--text-muted);"></small>
      </div>

      <div class="form-group">
        <label for="edit-obs">Observações</label>
        <textarea id="edit-obs" rows="2" placeholder="Detalhes, reembolsável, etc.">${N(t.observacao||"")}</textarea>
      </div>
    </div>
    <div class="dlg-footer">
      <button class="btn btn-secondary" id="btn-cancel-edit">Cancelar</button>
      <button class="btn btn-primary" id="btn-save-nota">
        ${v.check} <span>Salvar Nota</span>
      </button>
    </div>
  `,u.showModal();const o=u.querySelector("#edit-chave"),n=u.querySelector("#chave-status"),r=()=>{const c=o.value.replace(/\D/g,"");if(!c){n.innerText="";return}R(c)?n.innerHTML='<span style="color: #34d399;">✓ Chave válida (DV correto)</span>':n.innerHTML=`<span style="color: #f87171;">Chave incompleta ou com dígito verificador inválido (${c.length}/44)</span>`};o.addEventListener("input",r),r(),u.querySelector("#btn-close-dlg").onclick=()=>u.close(),u.querySelector("#btn-cancel-edit").onclick=()=>u.close(),u.querySelector("#btn-save-nota").onclick=async()=>{t.emitente=u.querySelector("#edit-emitente").value.trim(),t.valor=Number(u.querySelector("#edit-valor").value)||0,t.dataEmissao=u.querySelector("#edit-data").value,t.anoMes=t.dataEmissao?t.dataEmissao.slice(0,7):new Date().toISOString().slice(0,7),t.categoria=u.querySelector("#edit-categoria").value,t.cnpj=u.querySelector("#edit-cnpj").value.replace(/\D/g,""),t.observacao=u.querySelector("#edit-obs").value.trim();const c=o.value.replace(/\s/g,"");if(c){t.chave=c;const i=mt(c);i&&(t.modelo=i.modelo,t.serie=i.serie,t.numero=i.numero,t.uf=i.uf)}await Gt(t),u.close(),x("Nota salva com sucesso!","success"),await tt(),L()}}function ue(t){const e=D(t.categoria),a=t.imagem?URL.createObjectURL(t.imagem):null,o=Mt(t);u.innerHTML=`
    <div class="dlg-header">
      <h2 id="dlg-title">${N(t.emitente||"Detalhes da Nota")}</h2>
      <button class="btn btn-icon btn-secondary" id="btn-close-dlg">${v.x}</button>
    </div>
    <div class="dlg-body">
      ${a?`
        <div style="max-height: 260px; border-radius: var(--radius-md); overflow: hidden; margin-bottom: 18px; border: 1px solid var(--border-subtle); display: flex; justify-content: center; background: #020617;">
          <img src="${a}" alt="Documento escaneado" style="max-height: 260px; width: auto; object-fit: contain;">
        </div>
      `:""}

      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px;">
        <span style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--accent-emerald);">
          ${$(t.valor)}
        </span>
        <span class="nota-badge" style="background: ${e.cor}22; color: ${e.cor}; font-size: 0.8rem; padding: 4px 10px;">
          ${e.nome}
        </span>
      </div>

      <div style="font-size: 0.85rem; line-height: 1.8; color: var(--text-muted); background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <div><strong>Data de Emissão:</strong> ${P(t.dataEmissao)}</div>
        ${t.cnpj?`<div><strong>CNPJ:</strong> ${k(t.cnpj)}</div>`:""}
        ${t.modelo?`<div><strong>Modelo:</strong> ${t.modelo==="65"?"NFC-e (Consumidor)":t.modelo==="55"?"NF-e (DANFE)":t.modelo}</div>`:""}
        ${t.numero?`<div><strong>Número / Série:</strong> ${t.numero} (série ${t.serie||"1"})</div>`:""}
        ${t.uf?`<div><strong>UF:</strong> ${t.uf}</div>`:""}
        ${t.observacao?`<div><strong>Observações:</strong> ${N(t.observacao)}</div>`:""}
      </div>

      ${t.chave?`
        <div style="margin-top: 14px; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Chave de Acesso</span>
            <button class="btn btn-secondary" id="btn-copy-chave" style="padding: 4px 10px; font-size: 0.75rem;">
              ${v.copy} Copiar
            </button>
          </div>
          <div style="font-family: monospace; font-size: 0.8rem; word-break: break-all; color: #fff;">
            ${J(t.chave)}
          </div>
        </div>
      `:""}
    </div>
    <div class="dlg-footer" style="justify-content: space-between;">
      <button class="btn btn-danger" id="btn-delete-nota">
        ${v.trash} Excluir
      </button>
      <div style="display: flex; gap: 8px;">
        ${o?`
          <a class="btn btn-secondary" href="${o}" target="_blank" rel="noopener noreferrer">
            ${v.ext} Portal Sefaz
          </a>
        `:""}
        <button class="btn btn-primary" id="btn-edit-nota">
          ${v.edit} Editar
        </button>
      </div>
    </div>
  `,u.showModal(),u.querySelector("#btn-close-dlg").onclick=()=>u.close(),u.querySelector("#btn-copy-chave")?.addEventListener("click",()=>{navigator.clipboard.writeText(t.chave).then(()=>x("Chave copiada!","success"))}),u.querySelector("#btn-edit-nota").onclick=()=>{u.close(),nt(t,!1)},u.querySelector("#btn-delete-nota").onclick=async()=>{confirm("Tem certeza que deseja excluir esta nota?")&&(await Wt(t.id),u.close(),x("Nota excluída","info"),await tt(),L())}}function he(){const t={id:"nota_"+Date.now(),criadoEm:Date.now(),chave:"",emitente:"",valor:0,dataEmissao:new Date().toISOString().slice(0,10),categoria:"outros",cnpj:"",observacao:""};nt(t,!0)}function me(){const t=et();u.innerHTML=`
    <div class="dlg-header">
      <h2 id="dlg-title">Exportar Notas</h2>
      <button class="btn btn-icon btn-secondary" id="btn-close-dlg">${v.x}</button>
    </div>
    <div class="dlg-body">
      <p style="margin-bottom: 16px; color: var(--text-muted); font-size: 0.9rem;">
        Exportando <strong>${t.length}</strong> nota${t.length===1?"":"s"} de acordo com os filtros atuais.
      </p>

      <div style="display: grid; gap: 12px;">
        <button class="btn btn-secondary" id="btn-export-csv" style="justify-content: flex-start; padding: 14px;">
          ${v.sheet}
          <div style="text-align: left; margin-left: 8px;">
            <div style="font-weight: 600;">Planilha CSV (Excel)</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Formatado para Excel em português (separador ";" e vírgula decimal)</div>
          </div>
        </button>

        <button class="btn btn-secondary" id="btn-export-pdf" style="justify-content: flex-start; padding: 14px;">
          ${v.file}
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
  `,u.showModal(),u.querySelector("#btn-close-dlg").onclick=()=>u.close(),u.querySelector("#btn-cancel-exp").onclick=()=>u.close(),u.querySelector("#btn-export-csv").onclick=()=>{Jt(t),u.close(),x("Planilha CSV gerada!","success")},u.querySelector("#btn-export-pdf").onclick=async()=>{x("Gerando documento PDF com comprovantes...","info",2500),u.close(),await te(t),x("PDF gerado com sucesso!","success")}}function pe(){const t=g.notas,e=t.reduce((n,r)=>n+(Number(r.valor)||0),0),a={};T.forEach(n=>{a[n.id]={nome:n.nome,cor:n.cor,total:0,count:0}}),t.forEach(n=>{const r=n.categoria||"outros";a[r]||(a[r]={nome:r,cor:"#94a3b8",total:0,count:0}),a[r].total+=Number(n.valor)||0,a[r].count+=1});const o=Object.values(a).filter(n=>n.count>0).sort((n,r)=>r.total-n.total);u.innerHTML=`
    <div class="dlg-header">
      <h2 id="dlg-title">Resumo Financeiro</h2>
      <button class="btn btn-icon btn-secondary" id="btn-close-dlg">${v.x}</button>
    </div>
    <div class="dlg-body">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Gasto Total Registrado</span>
        <div style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; color: #fff;">
          ${$(e)}
        </div>
        <div style="font-size: 0.82rem; color: var(--accent-emerald);">${t.length} documentos arquivados</div>
      </div>

      <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px;">Gastos por Categoria</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${o.map(n=>{const r=e>0?Math.round(n.total/e*100):0;return`
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                <span style="font-weight: 600;">${n.nome} (${n.count})</span>
                <span style="font-weight: 700; color: #fff;">${$(n.total)} <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: normal;">(${r}%)</span></span>
              </div>
              <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.08); border-radius: 999px; overflow: hidden;">
                <div style="width: ${r}%; height: 100%; background: ${n.cor}; border-radius: 999px;"></div>
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
    <div class="dlg-footer">
      <button class="btn btn-secondary" id="btn-close-dash">Fechar</button>
    </div>
  `,u.showModal(),u.querySelector("#btn-close-dlg").onclick=()=>u.close(),u.querySelector("#btn-close-dash").onclick=()=>u.close()}function N(t=""){return String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}ne();export{K as _};
