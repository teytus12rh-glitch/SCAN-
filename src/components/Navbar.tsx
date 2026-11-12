import React, { useState } from 'react';
import {
  Scan,
  Code2,
  FileText,
  Download,
  Info,
  Smartphone,
  Sparkles,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../utils/zipExporter';
import confetti from 'canvas-confetti';

interface NavbarProps {
  activeTab: 'simulator' | 'code' | 'guide' | 'about';
  setActiveTab: (tab: 'simulator' | 'code' | 'guide' | 'about') => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAbout,
}) => {
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      await downloadAndroidProjectZip();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.1 },
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top credit bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 px-4 py-1.5 text-xs border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-semibold tracking-wide">
              DocScan Pro
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">
              Desenvolvido por <strong className="text-white font-medium">Leandro Corrêa</strong>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Offline
            </span>
            <span>•</span>
            <span className="text-emerald-300">Sem Marcas D'água</span>
            <span>•</span>
            <span className="text-slate-400">Android Studio Ready</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
            <Scan className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                DocScan Pro
              </h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CamScanner Nativo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kotlin • Jetpack Compose • Google ML Kit
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <nav className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-sm">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Simulador</span> Scanner
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Código Android</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'guide'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Guia APK</span>
          </button>

          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            title="Sobre o projeto e créditos"
          >
            <Info className="w-4 h-4" />
            <span className="hidden md:inline">Sobre</span>
          </button>
        </nav>

        {/* Action buttons: Download APK & ZIP */}
        <div className="flex items-center gap-2">
          <a
            href="/DocScanPro-v1.0.0.apk"
            download="DocScanPro-v1.0.0.apk"
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer ring-2 ring-emerald-400/50"
            title="Baixar APK instalável (19 MB)"
          >
            <Smartphone className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Baixar APK (19 MB)</span>
          </a>

          <button
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            title="Baixar código-fonte completo em ZIP"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span className="text-emerald-400">ZIP OK!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-400" />
                <span>Código (.zip)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
