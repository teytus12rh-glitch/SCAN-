import React from 'react';
import {
  X,
  Scan,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FolderLock,
  Layers,
  Sparkles,
  Heart,
  Share2,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 p-6 border-b border-emerald-900/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/40 hover:bg-slate-950/70 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Scan className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-1">
                <Sparkles className="w-3 h-3" /> CamScanner Nativo Android
              </div>
              <h2 className="text-2xl font-bold tracking-tight">DocScan Pro</h2>
              <p className="text-xs text-slate-300">Versão 1.0.0 • 100% Offline</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Author Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 to-teal-950/50 border border-emerald-800/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
                Engenharia de Software & Design
              </span>
              <span className="text-lg font-bold text-white">
                Desenvolvido por Leandro Corrêa
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
              <Heart className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>

          {/* Pillars */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Diferenciais da Arquitetura
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">100% Offline & Privado</strong>
                  <span className="text-slate-400">Sem nuvem, sem telemetria, zero vazamento de dados.</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Zero Marca D'água</strong>
                  <span className="text-slate-400">PDFs e fotos limpos e prontos para documentos oficiais.</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Google ML Kit Oficial</strong>
                  <span className="text-slate-400">Detecção de 4 cantos, rotação e remoção de sombras.</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-start gap-2.5">
                <FolderLock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">MediaStore & FileProvider</strong>
                  <span className="text-slate-400">Salva em Downloads e compartilha no WhatsApp nativo.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack List */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
            <span className="font-semibold text-slate-300 block">
              Especificações Técnicas Oficiais:
            </span>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>Linguagem:</strong> Kotlin 2.0.21 com Coroutines & Flow</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>Interface:</strong> Jetpack Compose + Material Design 3 (Material You)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>Core Scanner:</strong> <code className="text-emerald-300">com.google.android.gms:play-services-mlkit-document-scanner</code></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>Compatibilidade:</strong> Android 7.0 (API 24) até Android 15+ (API 35)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-white text-sm transition-all cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
