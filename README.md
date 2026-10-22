# NotaScan — Scanner Fiscal Inteligente (Web)

## Aplicativo online

- **GitHub Pages:** [https://eullon1234-creator.github.io/notascan-projeto/](https://eullon1234-creator.github.io/notascan-projeto/)
- **Repositório:** [github.com/eullon1234-creator/notascan-projeto](https://github.com/eullon1234-creator/notascan-projeto)

App Web inspirado na arquitetura e pipeline do **CamScanner** (estudado na engenharia reversa do APK), adaptado para escaneamento e organização de **NFC-e** (cupons fiscais com QR Code) e **NF-e** (DANFE em folha A4 com chave de acesso de 44 dígitos).

## 🚀 Como Executar

O servidor de desenvolvimento já está rodando em HTTPS:
- **No computador:** [https://localhost:5173/](https://localhost:5173/)
- **No celular (na mesma rede Wi-Fi):** `https://192.168.1.88:5173/` *(o HTTPS com certificado autoassinado é fundamental para liberar a câmera `getUserMedia` no smartphone)*

Para iniciar manualmente:
```bash
cd notascan
npm install
npm run dev
```

---

## 🛠 Como Cada Etapa do CamScanner foi Traduzida para a Web

| Módulo CamScanner Original | Módulo Equivalente no NotaScan | Tecnologia & Funcionamento |
|---|---|---|
| **Câmera & Visualizador** (`CameraX`) | `src/main.js` (`getUserMedia`) | Acesso à câmera traseira em alta resolução, foco contínuo e controle de lanterna/torch. |
| **Detecção de Bordas** (`libpagescanner.so`, `libopencv.so`) | `src/scanner.js` (`detectDocument`) | OpenCV.js com Canny, morfologia de fechamento e aproximação poligonal de 4 vértices (`approxPolyDP`). |
| **Ajuste de Perspectiva** (`libscannercs.so`) | `src/scanner.js` (`warpDocument`) | Recorte quadrilátero com transformação projetiva `cv.getPerspectiveTransform` + interpolação bicúbica. Cantos ajustáveis manualmente por toque ou mouse. |
| **Filtro Mágico de Imagem** (`libmagicenhancer.so`) | `src/scanner.js` (`applyFilter`) | Remoção de sombras e iluminação desigual do papel por divisão da imagem pela estimativa de fundo dilatado com filtro da mediana (estilo CamScanner). Opções: **Mágico**, **P&B**, **Cinza**, **Vívido** e **Original**. |
| **Leitura de Códigos** (`libQREngine.so`, ML Kit) | `src/reader.js` (`detectCodes`) | API nativa `BarcodeDetector` + polyfill WebAssembly (`barcode-detector`/`zxing-wasm`). Decodifica QR Code da NFC-e e Código de Barras Code-128 do DANFE. |
| **OCR de Texto** (`libOCREngine.so`) | `src/reader.js` (`runOCR`) | Tesseract.js em português treinado, rodando em Web Worker local no navegador. |
| **Regras Fiscais Brasileiras** | `src/nfe.js` | Validação de Chave de Acesso (44 dígitos, módulo 11 com suporte ao CNPJ alfanumérico), parser de URLs Sefaz v1/v2/v3 e heurísticas para capturar emitente, CNPJ, data e valor total. |
| **Armazenamento Seguro e Privado** (`libwcdb.so`, SQLCipher) | `src/db.js` (IndexedDB) | 100% offline e local no aparelho do usuário. Detecção de notas duplicadas por índice de chave de acesso. |
| **Geração de PDF** (`libpdfengine.so`) | `src/exporter.js` (`exportPDF`) | Criação de PDF multi-página via jsPDF com folha de rosto, totais consolidados e imagens originais arquivadas em alta qualidade. |
| **Exportação CSV** | `src/exporter.js` (`exportCSV`) | Planilha com separador `;` e codificação UTF-8 com BOM para abrir direto no Excel sem desconfigurar acentos ou decimais. |

---

## 🔒 Privacidade & Segurança
Nenhuma foto, nota ou dado fiscal é enviado para servidores de terceiros. Todo o processamento de imagem, visão computacional e armazenamento acontece localmente na memória e no navegador do próprio dispositivo.
