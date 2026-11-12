import React, { useState, useEffect, useRef } from 'react';
import {
  ScannedDoc,
  filterDocuments,
  generateDefaultDocTitle,
  sanitizeDocTitle,
  formatBytes,
  formatDocDate,
} from '../utils/documentLogic';
import {
  ScannerFilter,
  applyFilterToCanvas,
  createSampleDocumentCanvas,
  generatePdfBlobFromImages,
} from '../utils/imageProcessing';
import {
  Scan,
  Search,
  Plus,
  Trash2,
  Edit2,
  Share2,
  Download,
  Smartphone,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Sparkles,
  FileText,
  Check,
  X,
  Sliders,
  Maximize2,
  RefreshCw,
  FolderOpen,
  Eye,
  Info,
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScannerSimulatorProps {
  onOpenAbout: () => void;
}

export const ScannerSimulator: React.FC<ScannerSimulatorProps> = ({
  onOpenAbout,
}) => {
  // Document state
  const [documents, setDocuments] = useState<ScannedDoc[]>(() => {
    // Initialize with 3 realistic documents
    const doc1Img = createSampleDocumentCanvas('contract');
    const doc2Img = createSampleDocumentCanvas('invoice');
    const doc3Img = createSampleDocumentCanvas('certificate');

    const now = Date.now();
    return [
      {
        id: 'doc-1',
        title: 'Contrato de Prestação de Serviços',
        createdAt: now - 1000 * 60 * 60 * 3, // 3 hours ago
        pageCount: 1,
        pages: [doc1Img],
        fileSizeBytes: 245 * 1024,
        filterMode: 'magic',
      },
      {
        id: 'doc-2',
        title: 'Comprovante Fiscal de Serviço',
        createdAt: now - 1000 * 60 * 60 * 24, // 1 day ago
        pageCount: 1,
        pages: [doc2Img],
        fileSizeBytes: 180 * 1024,
        filterMode: 'bw',
      },
      {
        id: 'doc-3',
        title: 'Certificado de Excelência Leandro Corrêa',
        createdAt: now - 1000 * 60 * 60 * 48, // 2 days ago
        pageCount: 1,
        pages: [doc3Img],
        fileSizeBytes: 310 * 1024,
        filterMode: 'original',
      },
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDoc, setSelectedDoc] = useState<ScannedDoc | null>(null);
  const [viewingPageIndex, setViewingPageIndex] = useState(0);

  // Scanner modal states
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerStep, setScannerStep] = useState<'capture' | 'filter' | 'review'>('capture');
  const [currentPages, setCurrentPages] = useState<string[]>([]);
  const [activeCapturedImage, setActiveCapturedImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ScannerFilter>('magic');
  const [docTitleInput, setDocTitleInput] = useState('');

  // Camera stream state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Rename modal state
  const [renamingDoc, setRenamingDoc] = useState<ScannedDoc | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredDocs = filterDocuments(documents, searchQuery);

  // Camera lifecycle
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera not available or permission denied:', err);
      showToast('Câmera indisponível. Selecione uma amostra ou envie uma foto.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 1130;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    processRawCapture(dataUrl);
  };

  const handleSampleSelect = (type: 'contract' | 'invoice' | 'certificate') => {
    stopCamera();
    const dataUrl = createSampleDocumentCanvas(type);
    processRawCapture(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      stopCamera();
      processRawCapture(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const processRawCapture = (rawImage: string) => {
    setActiveCapturedImage(rawImage);
    setActiveFilter('magic');
    setScannerStep('filter');
  };

  const applyCurrentFilter = async (): Promise<string> => {
    if (!activeCapturedImage) return '';
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(activeCapturedImage);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const filteredCanvas = applyFilterToCanvas(canvas, activeFilter);
        resolve(filteredCanvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = activeCapturedImage;
    });
  };

  const handleConfirmPage = async (addMore: boolean) => {
    const processedPage = await applyCurrentFilter();
    const updatedPages = [...currentPages, processedPage];
    setCurrentPages(updatedPages);

    if (addMore) {
      setActiveCapturedImage(null);
      setScannerStep('capture');
      showToast(`Página ${updatedPages.length} adicionada! Escaneie a próxima.`);
    } else {
      // Finish document
      const title = docTitleInput.trim() || generateDefaultDocTitle(documents.length);
      const newDoc: ScannedDoc = {
        id: `doc-${Date.now()}`,
        title: sanitizeDocTitle(title),
        createdAt: Date.now(),
        pageCount: updatedPages.length,
        pages: updatedPages,
        fileSizeBytes: updatedPages.length * 210 * 1024,
        filterMode: activeFilter,
      };

      setDocuments([newDoc, ...documents]);
      setIsScannerOpen(false);
      resetScanner();
      setSelectedDoc(newDoc);
      setViewingPageIndex(0);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
      showToast(`Documento salvo com sucesso! (${updatedPages.length} páginas)`);
    }
  };

  const resetScanner = () => {
    stopCamera();
    setCurrentPages([]);
    setActiveCapturedImage(null);
    setScannerStep('capture');
    setActiveFilter('magic');
    setDocTitleInput('');
  };

  const handleOpenScanner = () => {
    resetScanner();
    setDocTitleInput(generateDefaultDocTitle(documents.length));
    setIsScannerOpen(true);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }
    showToast('Documento excluído com sucesso.');
  };

  const handleSaveRename = () => {
    if (!renamingDoc || !newTitle.trim()) return;
    const sanitized = sanitizeDocTitle(newTitle);
    setDocuments(
      documents.map((d) => (d.id === renamingDoc.id ? { ...d, title: sanitized } : d))
    );
    if (selectedDoc?.id === renamingDoc.id) {
      setSelectedDoc({ ...selectedDoc, title: sanitized });
    }
    setRenamingDoc(null);
    showToast('Nome atualizado!');
  };

  const handleDownloadPdf = async (doc: ScannedDoc) => {
    try {
      showToast('Gerando PDF multipáginas limpo (sem marca d\'água)...');
      const blob = await generatePdfBlobFromImages(doc.pages, doc.title);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sanitizeDocTitle(doc.title)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('PDF baixado para o seu dispositivo!');
    } catch (err) {
      console.error(err);
      showToast('Erro ao compilar PDF.');
    }
  };

  const handleDownloadImages = (doc: ScannedDoc) => {
    doc.pages.forEach((pageUrl, idx) => {
      const a = document.createElement('a');
      a.href = pageUrl;
      a.download = `${sanitizeDocTitle(doc.title)}_pag_${idx + 1}.jpg`;
      a.click();
    });
    showToast(`${doc.pages.length} imagem(ns) baixada(s)!`);
  };

  const handleShare = async (doc: ScannedDoc) => {
    if (navigator.share) {
      try {
        const blob = await generatePdfBlobFromImages(doc.pages, doc.title);
        const file = new File([blob], `${sanitizeDocTitle(doc.title)}.pdf`, {
          type: 'application/pdf',
        });
        await navigator.share({
          title: doc.title,
          text: `${doc.title} — Digitalizado com DocScan Pro`,
          files: [file],
        });
      } catch (err) {
        // Fallback to downloading
        handleDownloadPdf(doc);
      }
    } else {
      handleDownloadPdf(doc);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-white min-h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 text-xs sm:text-sm">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Area */}
      {selectedDoc ? (
        /* ================= TELA DE VISUALIZAÇÃO DO DOCUMENTO ================= */
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
                title="Voltar para a lista"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white truncate max-w-md">
                    {selectedDoc.title}
                  </h2>
                  <button
                    onClick={() => {
                      setRenamingDoc(selectedDoc);
                      setNewTitle(selectedDoc.title);
                    }}
                    className="p-1 text-slate-400 hover:text-emerald-400 transition-all cursor-pointer"
                    title="Renomear"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  {formatDocDate(selectedDoc.createdAt)} • Página {viewingPageIndex + 1} de{' '}
                  {selectedDoc.pages.length} • {formatBytes(selectedDoc.fileSizeBytes)}
                </p>
              </div>
            </div>

            {/* Viewer Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadPdf(selectedDoc)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs sm:text-sm rounded-xl text-white shadow-md active:scale-95 transition-all cursor-pointer"
                title="Exportar em PDF sem marca d'água"
              >
                <Download className="w-4 h-4" />
                <span>Salvar PDF</span>
              </button>

              <button
                onClick={() => handleDownloadImages(selectedDoc)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 font-medium text-xs sm:text-sm rounded-xl text-slate-200 transition-all cursor-pointer"
                title="Salvar imagens JPEG"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">JPGs</span>
              </button>

              <button
                onClick={() => handleShare(selectedDoc)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 font-medium text-xs sm:text-sm rounded-xl text-slate-200 transition-all cursor-pointer"
                title="Compartilhar"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>

              <button
                onClick={() => handleDeleteDocument(selectedDoc.id)}
                className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/50 text-red-300 transition-all cursor-pointer"
                title="Excluir Documento"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Viewer Stage */}
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[550px] shadow-2xl">
            {/* Document Page Display */}
            <div className="relative max-w-xl w-full flex items-center justify-center">
              <img
                src={selectedDoc.pages[viewingPageIndex]}
                alt={`Página ${viewingPageIndex + 1}`}
                className="w-full max-h-[650px] object-contain rounded-lg shadow-2xl ring-1 ring-slate-800 bg-white"
              />

              {/* Zero watermark guarantee banner */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                100% Offline • Sem Marcas D'água
              </div>
            </div>

            {/* Pagination Controls if multipage */}
            {selectedDoc.pages.length > 1 && (
              <div className="flex items-center gap-4 mt-6">
                <button
                  disabled={viewingPageIndex === 0}
                  onClick={() => setViewingPageIndex((p) => Math.max(0, p - 1))}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5">
                  {selectedDoc.pages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setViewingPageIndex(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        viewingPageIndex === idx
                          ? 'w-6 bg-emerald-500'
                          : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={viewingPageIndex === selectedDoc.pages.length - 1}
                  onClick={() =>
                    setViewingPageIndex((p) =>
                      Math.min(selectedDoc.pages.length - 1, p + 1)
                    )
                  }
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= TELA INICIAL: MEUS DOCUMENTOS ================= */
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">Meus Documentos</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  {documents.length}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Armazenamento local seguro • Pronto para exportação em PDF e JPEG
              </p>
            </div>

            {/* Quick APK Download Banner Button */}
            <a
              href="/DocScanPro-v1.0.0.apk"
              download="DocScanPro-v1.0.0.apk"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Baixar APK nativo compilado (19 MB)"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>APK Android Pronto (19 MB)</span>
            </a>

            <div className="flex items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar pelo nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Exibição em Grade"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Exibição em Lista"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Content List / Grid */}
          {filteredDocs.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center flex flex-col items-center justify-center min-h-[380px] bg-slate-950/40">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                <Scan className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {searchQuery ? 'Nenhum documento encontrado' : 'Nenhum documento escaneado ainda'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6">
                {searchQuery
                  ? 'Tente pesquisar com outro termo ou limpe a barra de busca.'
                  : 'Toque no botão abaixo para capturar seu primeiro documento com a câmera ou testar com nossas amostras.'}
              </p>
              <button
                onClick={handleOpenScanner}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Escanear Documento</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View (2 or 3 cols) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-600/50 transition-all duration-200 overflow-hidden shadow-lg hover:shadow-emerald-950/30 flex flex-col justify-between"
                >
                  {/* Thumbnail Container */}
                  <div
                    onClick={() => {
                      setSelectedDoc(doc);
                      setViewingPageIndex(0);
                    }}
                    className="relative h-56 bg-slate-950 cursor-pointer overflow-hidden flex items-center justify-center"
                  >
                    <img
                      src={doc.pages[0]}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Page count pill */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-sm text-[11px] font-semibold text-slate-200 border border-slate-700/60 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-emerald-400" />
                      <span>{doc.pageCount} {doc.pageCount === 1 ? 'pág' : 'págs'}</span>
                    </div>

                    {/* Quick overlay button */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                        <Eye className="w-3.5 h-3.5" /> Abrir Documento
                      </span>
                    </div>
                  </div>

                  {/* Document Info & Actions */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h4
                        onClick={() => {
                          setSelectedDoc(doc);
                          setViewingPageIndex(0);
                        }}
                        className="font-bold text-sm text-white hover:text-emerald-400 cursor-pointer truncate"
                        title={doc.title}
                      >
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatDocDate(doc.createdAt)} • {formatBytes(doc.fileSizeBytes)}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDownloadPdf(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all cursor-pointer"
                          title="Salvar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShare(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all cursor-pointer"
                          title="Compartilhar"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setRenamingDoc(doc);
                            setNewTitle(doc.title);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-all cursor-pointer"
                          title="Renomear"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-600/50 transition-all flex items-center justify-between gap-4"
                >
                  <div
                    onClick={() => {
                      setSelectedDoc(doc);
                      setViewingPageIndex(0);
                    }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  >
                    <div className="w-12 h-14 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                      <img
                        src={doc.pages[0]}
                        alt={doc.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate hover:text-emerald-400">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {formatDocDate(doc.createdAt)} • {doc.pageCount} {doc.pageCount === 1 ? 'página' : 'páginas'} • {formatBytes(doc.fileSizeBytes)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownloadPdf(doc)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                      title="Salvar PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare(doc)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                      title="Compartilhar"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button (FAB) "Escanear Documento" */}
      {!selectedDoc && (
        <div className="fixed bottom-8 right-8 z-30">
          <button
            onClick={handleOpenScanner}
            className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-xl shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-950/20 flex items-center justify-center">
              <Scan className="w-4 h-4 text-slate-950" />
            </div>
            <span className="text-sm tracking-wide">Escanear Documento</span>
          </button>
        </div>
      )}

      {/* Discreet Footer with mandatory credit */}
      <footer className="mt-8 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>DocScan Pro • 100% Offline • Sem Marcas D'água</span>
        </div>
        <div>
          Desenvolvido com carinho por{' '}
          <strong className="text-white font-semibold">Leandro Corrêa</strong>
        </div>
      </footer>

      {/* ================= MODAL DO SCANNER (SIMULADOR DO ML KIT) ================= */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Scan className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {scannerStep === 'capture'
                      ? 'Visor Inteligente ML Kit'
                      : 'Filtros e Ajustes do Documento'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {currentPages.length > 0
                      ? `${currentPages.length} página(s) já capturada(s)`
                      : 'Detecção automática de bordas e desamassamento'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  stopCamera();
                  setIsScannerOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {scannerStep === 'capture' ? (
                /* STEP 1: CAPTURE */
                <div className="space-y-4">
                  {/* Viewfinder Area */}
                  <div className="relative rounded-2xl bg-black overflow-hidden h-72 sm:h-80 border-2 border-emerald-500/40 flex items-center justify-center">
                    {isCameraActive ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                          Escolha abaixo como capturar: ative sua <strong>Webcam</strong>, escolha uma <strong>Amostra Oficial</strong> ou envie uma foto do disco.
                        </p>
                      </div>
                    )}

                    {/* Laser Scanner Line Over Video */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] opacity-75 pointer-events-none" />

                    {/* 4 Corner Pins overlay */}
                    <div className="absolute inset-6 border border-emerald-500/30 rounded-lg pointer-events-none">
                      <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                    </div>

                    <div className="absolute bottom-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-[10px] text-emerald-300 font-semibold border border-emerald-500/30">
                      Bordas detectadas automaticamente pelo ML Kit
                    </div>
                  </div>

                  {/* Capture Controls */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {isCameraActive ? (
                        <button
                          onClick={captureFromCamera}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Tirar Foto Agora</span>
                        </button>
                      ) : (
                        <button
                          onClick={startCamera}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Ativar Webcam</span>
                        </button>
                      )}

                      {/* File upload */}
                      <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Carregar Imagem</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Pre-made samples for rapid test without needing real camera */}
                    <div className="pt-3 border-t border-slate-800 text-center">
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                        Ou clique em uma amostra de documento:
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          onClick={() => handleSampleSelect('contract')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700/60 cursor-pointer"
                        >
                          📄 Contrato de Serviços
                        </button>
                        <button
                          onClick={() => handleSampleSelect('invoice')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700/60 cursor-pointer"
                        >
                          🧾 Comprovante DANFE
                        </button>
                        <button
                          onClick={() => handleSampleSelect('certificate')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700/60 cursor-pointer"
                        >
                          🏆 Certificado Leandro Corrêa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* STEP 2: FILTERS & PREVIEW */
                <div className="space-y-4">
                  {/* Document Title Input */}
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Título do Documento:
                    </label>
                    <input
                      type="text"
                      value={docTitleInput}
                      onChange={(e) => setDocTitleInput(e.target.value)}
                      placeholder="Ex: Contrato_Locacao_2026"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>

                  {/* Filtered Preview Frame */}
                  <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center h-72 overflow-hidden">
                    {activeCapturedImage && (
                      <img
                        src={activeCapturedImage}
                        alt="Preview capturado"
                        className={`max-h-full object-contain rounded shadow-lg transition-all ${
                          activeFilter === 'bw'
                            ? 'contrast-200 grayscale'
                            : activeFilter === 'grayscale'
                            ? 'grayscale'
                            : activeFilter === 'magic'
                            ? 'contrast-125 brightness-105'
                            : ''
                        }`}
                      />
                    )}

                    <div className="absolute top-4 right-4 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] text-emerald-400 font-bold border border-emerald-500/30">
                      ML Kit Filter: {activeFilter.toUpperCase()}
                    </div>
                  </div>

                  {/* Filter Select Buttons */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-400 block">
                      Selecione o Filtro de Limpeza:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'original', name: 'Original', desc: 'Cores naturais' },
                        { id: 'magic', name: 'Realce Mágico', desc: 'Remove sombras' },
                        { id: 'grayscale', name: 'Escala Cinza', desc: 'Monocromático' },
                        { id: 'bw', name: 'P&B Nítido', desc: 'Alto contraste' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setActiveFilter(f.id as ScannerFilter)}
                          className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                            activeFilter === f.id
                              ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <strong className="block text-xs font-bold">
                            {f.name}
                          </strong>
                          <span className="text-[10px] opacity-75">{f.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              {scannerStep === 'capture' ? (
                <button
                  onClick={() => setIsScannerOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
              ) : (
                <button
                  onClick={() => setScannerStep('capture')}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Voltar
                </button>
              )}

              {scannerStep === 'filter' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleConfirmPage(true)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar Página</span>
                  </button>

                  <button
                    onClick={() => handleConfirmPage(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Concluir Documento</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rename Dialog */}
      {renamingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl text-white">
            <h3 className="font-bold text-base">Renomear Documento</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRenamingDoc(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRename}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-md"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
