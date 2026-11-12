/**
 * Image processing and sample document generator for the Web Scanner Simulator
 * Simulates the Google ML Kit Document Scanner filters:
 * - Original (Full Color)
 * - Realce Mágico (Magic Color - cleans background, sharpens text)
 * - Escala de Cinza (Grayscale)
 * - P&B / Documento Nítido (Black & White high contrast)
 *
 * Developed by Leandro Corrêa
 */

export type ScannerFilter = 'original' | 'magic' | 'grayscale' | 'bw';

export function applyFilterToCanvas(
  sourceCanvas: HTMLCanvasElement,
  filter: ScannerFilter
): HTMLCanvasElement {
  const output = document.createElement('canvas');
  output.width = sourceCanvas.width;
  output.height = sourceCanvas.height;
  const ctx = output.getContext('2d');
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, 0, 0);

  if (filter === 'original') {
    return output;
  }

  const imgData = ctx.getImageData(0, 0, output.width, output.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    if (filter === 'grayscale') {
      data[i] = luma;
      data[i + 1] = luma;
      data[i + 2] = luma;
    } else if (filter === 'magic') {
      // Magic Color: brighten whites (background cleanup) and increase contrast for text
      let enhanced = luma;
      if (luma > 160) {
        enhanced = Math.min(255, luma * 1.25);
      } else {
        enhanced = Math.max(0, luma * 0.85);
      }
      // Apply slight saturation boost while brightening background
      const factor = (enhanced - luma) * 0.4;
      data[i] = Math.min(255, Math.max(0, r + factor));
      data[i + 1] = Math.min(255, Math.max(0, g + factor));
      data[i + 2] = Math.min(255, Math.max(0, b + factor));
    } else if (filter === 'bw') {
      // High contrast B&W threshold
      const val = luma > 140 ? 255 : 0;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return output;
}

/**
 * Creates high-fidelity realistic Brazilian document samples for the simulator
 */
export function createSampleDocumentCanvas(type: 'contract' | 'invoice' | 'certificate'): string {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1130; // A4 aspect ratio ~ 1:1.414
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background - parchment/clean paper texture
  ctx.fillStyle = '#FAF9F6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle border / margin
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  if (type === 'contract') {
    // Header
    ctx.fillStyle = '#0F766E';
    ctx.fillRect(50, 50, canvas.width - 100, 8);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', canvas.width / 2, 100);

    ctx.font = 'normal 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.fillText('INSTRUMENTO PARTICULAR DE CONSULTORIA E DESENVOLVIMENTO', canvas.width / 2, 125);

    // Document Body
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CLÁUSULA PRIMEIRA - DAS PARTES CONTRATANTES', 60, 180);

    ctx.font = 'normal 13px "Plus Jakarta Sans", sans-serif';
    const textLines = [
      'Pelo presente instrumento particular, de um lado Leandro Corrêa, doravante denominado',
      'CONTRATADO, e do outro lado o CLIENTE titular desta licença, resolvem firmar o presente',
      'termo de prestação de serviços com base nos termos e condições seguintes:',
      '',
      'CLÁUSULA SEGUNDA - DO OBJETO E ESCOPO DO PROJETO',
      'O presente contrato tem por objeto o desenvolvimento e fornecimento de software nativo',
      'Android para digitalização inteligente de documentos, 100% offline, sem anúncios e sem marcas',
      'd\'água, utilizando o motor Google ML Kit Document Scanner com interface Jetpack Compose.',
      '',
      'CLÁUSULA TERCEIRA - DA PRIVACIDADE E PROTEÇÃO DE DADOS (LGPD)',
      'Todos os arquivos escaneados são armazenados estritamente no armazenamento local do dispositivo',
      'do usuário final (context.filesDir), garantindo privacidade total sem telemetria externa.',
      '',
      'CLÁUSULA QUARTA - DO PRAZO E ENTREGA TÉCNICA',
      'A entrega compreende os códigos-fonte completos em Kotlin, arquivos de build Gradle, manifesto,',
      'configurações de FileProvider e guia passo a passo para geração do APK instalável.'
    ];

    let y = 210;
    for (const line of textLines) {
      if (line.startsWith('CLÁUSULA')) {
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0F766E';
        y += 10;
      } else {
        ctx.font = 'normal 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#374151';
      }
      ctx.fillText(line, 60, y);
      y += 24;
    }

    // Signatures
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 950);
    ctx.lineTo(340, 950);
    ctx.moveTo(460, 950);
    ctx.lineTo(720, 950);
    ctx.stroke();

    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#111827';
    ctx.fillText('LEANDRO CORRÊA', 210, 975);
    ctx.font = 'normal 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Engenheiro de Software Sênior', 210, 995);

    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#111827';
    ctx.fillText('CONTRATANTE', 590, 975);
    ctx.font = 'normal 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Representante Legal', 590, 995);

    // Official Stamp
    ctx.save();
    ctx.translate(650, 850);
    ctx.rotate(-0.15);
    ctx.strokeStyle = '#0F766E';
    ctx.lineWidth = 3;
    ctx.strokeRect(-80, -25, 160, 50);
    ctx.fillStyle = '#0F766E';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('REGISTRADO', 0, -5);
    ctx.font = 'normal 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DOCSCAN NATIVO', 0, 12);
    ctx.restore();

  } else if (type === 'invoice') {
    // Invoice / Recibo
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(50, 50, canvas.width - 100, 12);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('COMPROVANTE FISCAL DE SERVIÇO', 60, 110);

    ctx.font = 'normal 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('DOCUMENTO AUXILIAR DE NOTA FISCAL ELETRÔNICA (DANFE)', 60, 135);

    // Details box
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(60, 160, canvas.width - 120, 100);
    ctx.strokeStyle = '#D1D5DB';
    ctx.strokeRect(60, 160, canvas.width - 120, 100);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('EMISSOR: LEANDRO CORRÊA DESENVOLVIMENTO', 80, 190);
    ctx.font = 'normal 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.fillText('CNPJ: 45.890.123/0001-99 • INSCRIÇÃO MUNICIPAL: 987.654-2', 80, 215);
    ctx.fillText('DATA DA EMISSÃO: 12/11/2026 14:30 • CHAVE: 3526 1145 8901 2300 0199 5500 1000 0458', 80, 240);

    // Items table
    let y = 310;
    ctx.fillStyle = '#E5E7EB';
    ctx.fillRect(60, y, canvas.width - 120, 32);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DESCRIÇÃO DO SERVIÇO', 80, y + 21);
    ctx.fillText('QTD', 500, y + 21);
    ctx.fillText('VALOR (R$)', 620, y + 21);

    y += 45;
    ctx.font = 'normal 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Licença Vitalícia DocScan Pro (Android Nativo ML Kit)', 80, y);
    ctx.fillText('1 un', 505, y);
    ctx.fillText('299,00', 635, y);

    y += 35;
    ctx.fillText('Suporte Técnico & Código-Fonte Kotlin Compose', 80, y);
    ctx.fillText('1 un', 505, y);
    ctx.fillText('150,00', 635, y);

    y += 50;
    ctx.strokeStyle = '#9CA3AF';
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(canvas.width - 60, y);
    ctx.stroke();

    y += 30;
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#111827';
    ctx.fillText('VALOR TOTAL PAGO:', 420, y);
    ctx.fillStyle = '#0F766E';
    ctx.fillText('R$ 449,00', 620, y);

    // Barcode mock
    y += 80;
    ctx.fillStyle = '#111827';
    for (let i = 0; i < 40; i++) {
      const w = (i % 3 === 0 ? 4 : 2);
      ctx.fillRect(80 + i * 16, y, w, 60);
    }
    ctx.font = 'normal 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('35261.14589 01230.001995 50010.000458 1 95480000044900', canvas.width / 2, y + 80);

  } else {
    // Certificate
    ctx.fillStyle = '#065F46';
    ctx.fillRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(48, 48, canvas.width - 96, canvas.height - 96);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CERTIFICADO DE EXCELÊNCIA', canvas.width / 2, 180);

    ctx.font = 'normal 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('CONFERIDO COM DISTINÇÃO E MÉRITO TÉCNICO A', canvas.width / 2, 230);

    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#111827';
    ctx.fillText('Leandro Corrêa', canvas.width / 2, 310);

    ctx.font = 'normal 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#374151';
    ctx.fillText('Pelo projeto arquitetural e engenharia de software do', canvas.width / 2, 380);
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F766E';
    ctx.fillText('DocScan Pro — CamScanner Android Nativo', canvas.width / 2, 420);

    ctx.font = 'normal 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.fillText('Comprovando maestria em Kotlin, Jetpack Compose, ML Kit Document Scanner', canvas.width / 2, 470);
    ctx.fillText('e armazenamento seguro 100% offline sem anúncios ou marcas d\'água.', canvas.width / 2, 500);

    // Seal
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 700, 60, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('OFICIAL', canvas.width / 2, 695);
    ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('★ 2026 ★', canvas.width / 2, 715);
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Generates client-side standalone PDF Blob without external dependencies or watermarks
 * Creates a valid multi-page PDF 1.4 from image canvases
 */
export async function generatePdfBlobFromImages(imageUrls: string[], title: string): Promise<Blob> {
  // We can construct a valid binary PDF with embedded JPEG images
  // Each page will contain a standard A4 MediaBox [0 0 595.28 841.89]
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  const pdfObjects: string[] = [];
  const pageObjectIds: number[] = [];

  // Helper to convert base64/url to Uint8Array JPEG bytes and get dimensions
  const imagesData: { bytes: Uint8Array; width: number; height: number }[] = [];
  for (const url of imageUrls) {
    const res = await fetch(url);
    const blob = await res.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Get image dimensions via an Image element
    const dims = await new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth || 800, height: img.naturalHeight || 1130 });
      img.onerror = () => resolve({ width: 800, height: 1130 });
      img.src = url;
    });

    imagesData.push({ bytes, width: dims.width, height: dims.height });
  }

  // Object 1: Catalog
  // Object 2: Pages
  // Then pairs of (XObject Image, Page Object, Contents Stream)

  let nextObjId = 1;
  const catalogId = nextObjId++;
  const pagesId = nextObjId++;

  const pageEntries: { pageId: number; imageId: number; contentsId: number }[] = [];

  for (let i = 0; i < imagesData.length; i++) {
    const imageId = nextObjId++;
    const contentsId = nextObjId++;
    const pageId = nextObjId++;
    pageEntries.push({ pageId, imageId, contentsId });
  }

  // Encode PDF text and binary parts
  const chunks: BlobPart[] = [];
  const offsets: number[] = [];
  let currentOffset = 0;

  function writeString(str: string) {
    const encoded = new TextEncoder().encode(str);
    chunks.push(encoded);
    currentOffset += encoded.length;
  }

  function writeBytes(bytes: Uint8Array) {
    const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    chunks.push(copy);
    currentOffset += bytes.length;
  }

  // Header
  writeString('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

  // Object 1: Catalog
  offsets[catalogId] = currentOffset;
  writeString(`${catalogId} 0 obj\n<< /Type /Catalog /Pages ${pagesId} 0 R >>\nendobj\n`);

  // Object 2: Pages
  offsets[pagesId] = currentOffset;
  const kidsStr = pageEntries.map((p) => `${p.pageId} 0 R`).join(' ');
  writeString(`${pagesId} 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${pageEntries.length} >>\nendobj\n`);

  // Page Objects
  for (let i = 0; i < pageEntries.length; i++) {
    const entry = pageEntries[i];
    const imgInfo = imagesData[i];

    // Image XObject
    offsets[entry.imageId] = currentOffset;
    const imgHeader = `${entry.imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgInfo.width} /Height ${imgInfo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgInfo.bytes.length} >>\nstream\n`;
    writeString(imgHeader);
    writeBytes(imgInfo.bytes);
    writeString('\nendstream\nendobj\n');

    // Contents Stream
    const streamContent = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`;
    const streamLen = new TextEncoder().encode(streamContent).length;
    offsets[entry.contentsId] = currentOffset;
    writeString(`${entry.contentsId} 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamContent}endstream\nendobj\n`);

    // Page object
    offsets[entry.pageId] = currentOffset;
    writeString(
      `${entry.pageId} 0 obj\n<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${entry.contentsId} 0 R /Resources << /XObject << /Im0 ${entry.imageId} 0 R >> >> >>\nendobj\n`
    );
  }

  // Cross-reference table (xref)
  const startXref = currentOffset;
  writeString(`xref\n0 ${nextObjId}\n0000000000 65535 f \n`);
  for (let id = 1; id < nextObjId; id++) {
    const off = (offsets[id] || 0).toString().padStart(10, '0');
    writeString(`${off} 00000 n \n`);
  }

  // Trailer
  writeString(`trailer\n<< /Size ${nextObjId} /Root ${catalogId} 0 R /Info << /Title (${title}) /Creator (DocScan Pro - Leandro Correa) >> >>\nstartxref\n${startXref}\n%%EOF\n`);

  return new Blob(chunks, { type: 'application/pdf' });
}
