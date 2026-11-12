import React, { useState } from 'react';
import {
  ANDROID_FILES,
  AndroidProjectFile,
} from '../androidProject/androidFiles';
import {
  Code2,
  Copy,
  Check,
  Download,
  FileCode,
  FolderTree,
  Search,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../utils/zipExporter';

export const AndroidCodeHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidProjectFile>(
    ANDROID_FILES[0]
  );
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isZipping, setIsZipping] = useState(false);

  const filteredFiles = ANDROID_FILES.filter((file) => {
    const matchesSearch =
      file.path.toLowerCase().includes(search.toLowerCase()) ||
      file.name.toLowerCase().includes(search.toLowerCase()) ||
      file.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.path.split('/').pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      await downloadAndroidProjectZip();
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-white">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-900/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Arquitetura Android Studio Completa
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Código-Fonte Nativo Pronto para Gerar o APK
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Todos os arquivos organizados com seus caminhos exatos para você colar em um projeto{' '}
              <strong className="text-white">Empty Activity (Compose)</strong> ou baixar o projeto completo zipado com 1 clique.
            </p>
          </div>

          <button
            onClick={handleDownloadAllZip}
            disabled={isZipping}
            className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Baixar Projeto Completo (.zip)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: File Explorer + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Explorer (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <FolderTree className="w-4 h-4 text-emerald-400" />
              <span>Arquivos do Projeto</span>
            </div>
            <span className="text-xs text-slate-400">
              {filteredFiles.length} de {ANDROID_FILES.length}
            </span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por nome ou caminho..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['all', 'kotlin', 'gradle', 'manifest', 'res', 'docs'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg uppercase tracking-wider text-[10px] font-semibold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>

          {/* File List */}
          <div className="space-y-1 max-h-[550px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-950/80 border border-emerald-600/60 text-white'
                      : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isSelected ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate">
                        {file.name}
                      </span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {file.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                      {file.path}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {selectedFile.path}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                title="Copiar código para a área de transferência"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadSingle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                title="Baixar arquivo individual"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar</span>
              </button>
            </div>
          </div>

          {/* Code Area with line numbers */}
          <div className="relative font-mono text-xs bg-slate-950 overflow-x-auto max-h-[600px] p-4">
            <pre className="text-slate-200 leading-relaxed">
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="flex hover:bg-slate-900/60 px-1 -mx-1 rounded">
                  <span className="w-10 select-none text-slate-600 text-right pr-4 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="whitespace-pre">
                    {/* Basic highlighting for comments and annotations */}
                    {line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') ? (
                      <span className="text-emerald-400/80 italic">{line}</span>
                    ) : line.trim().startsWith('@') ? (
                      <span className="text-amber-400">{line}</span>
                    ) : line.includes('fun ') || line.includes('class ') || line.includes('data class') ? (
                      <span className="text-cyan-300 font-semibold">{line}</span>
                    ) : (
                      line
                    )}
                  </span>
                </div>
              ))}
            </pre>
          </div>

          {/* Footer banner */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>DocScan Pro • Código completo e sem omissões</span>
            <span>Desenvolvido por <strong>Leandro Corrêa</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
