/**
 * Pure document management logic for DocScan Pro
 * Developed by Leandro Corrêa
 */

export interface ScannedDoc {
  id: string;
  title: string;
  createdAt: number;
  pageCount: number;
  pages: string[]; // base64 or object URLs
  pdfUrl?: string;
  fileSizeBytes: number;
  filterMode?: 'original' | 'magic' | 'grayscale' | 'bw';
}

/**
 * Filter documents by search query matching title or date
 */
export function filterDocuments(documents: ScannedDoc[], query: string): ScannedDoc[] {
  if (!query || !query.trim()) {
    return documents;
  }
  const clean = query.trim().toLowerCase();
  return documents.filter((doc) => {
    const titleMatch = doc.title.toLowerCase().includes(clean);
    const dateFormatted = new Date(doc.createdAt).toLocaleDateString('pt-BR');
    return titleMatch || dateFormatted.includes(clean);
  });
}

/**
 * Generates an auto-incremented or timestamped document title
 */
export function generateDefaultDocTitle(existingCount = 0, date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = date.getFullYear();
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `Digitalização_${d}-${m}-${y}_${h}h${min}`;
}

/**
 * Sanitizes user-entered title for file safety
 */
export function sanitizeDocTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return 'Documento_Sem_Titulo';
  // Remove invalid file path characters: / \ : * ? " < > |
  return trimmed.replace(/[\\/:*?"<>|]/g, '_').slice(0, 80);
}

/**
 * Formats bytes to readable KB/MB
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
  return `${val} ${units[i]}`;
}

/**
 * Formats timestamp to pt-BR friendly string
 */
export function formatDocDate(timestamp: number): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}
