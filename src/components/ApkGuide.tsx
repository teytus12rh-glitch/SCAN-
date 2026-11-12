import React, { useState } from 'react';
import {
  FileText,
  PlayCircle,
  Package,
  KeyRound,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Cpu,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../utils/zipExporter';

export const ApkGuide: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(index);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 text-white">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Guia de Compilação Oficial
            </span>
            <h2 className="text-2xl font-bold">
              Como Gerar o APK no Android Studio
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Do zero até o arquivo <code className="text-emerald-300">.apk</code> instalado e funcionando no seu celular.
              Desenvolvido por <strong>Leandro Corrêa</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <a
              href="/DocScanPro-v1.0.0.apk"
              download="DocScanPro-v1.0.0.apk"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Smartphone className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Baixar APK Pronto (19 MB)</span>
            </a>

            <button
              onClick={() => downloadAndroidProjectZip()}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Código (.zip)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Road Map */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="text-lg font-bold text-white">
              Criar o Projeto no Android Studio
            </h3>
          </div>

          <p className="text-sm text-slate-300">
            Abra o Android Studio (Ladybug, Koala, Jellyfish ou Hedgehog) e inicie um novo projeto:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block font-mono">Template:</span>
              <strong className="text-emerald-300 text-sm">Empty Activity (Compose)</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Name:</span>
              <strong className="text-white text-sm">DocScan</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Package name:</span>
              <strong className="text-emerald-300 font-mono text-xs">com.leandrocorrea.docscan</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Minimum SDK:</span>
              <strong className="text-white text-sm">API 24 ("Nougat")</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-mono">Build configuration:</span>
              <strong className="text-white text-sm">Kotlin DSL (build.gradle.kts)</strong>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="text-lg font-bold text-white">
              Sincronizar o Gradle com o ML Kit Document Scanner
            </h3>
          </div>

          <p className="text-sm text-slate-300">
            Após colar o conteúdo de <code className="text-emerald-300">app/build.gradle.kts</code> e <code className="text-emerald-300">gradle/libs.versions.toml</code>, clique no botão superior:
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-sm text-white block">
                  Sync Project with Gradle Files
                </span>
                <span className="text-xs text-slate-400">
                  (Ícone do elefante Gradle com a seta azul no canto superior direito)
                </span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              Gradle 8.7+
            </span>
          </div>
        </div>

        {/* Step 3: Debug APK */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-emerald-300">
                Opção A: Gerar Debug APK (Para Testar Imediatamente)
              </h3>
            </div>
            <span className="text-xs uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              Mais Rápido (1 Clique)
            </span>
          </div>

          <p className="text-sm text-slate-300">
            Ideal para instalar imediatamente no seu smartphone pessoal ou mandar para amigos pelo WhatsApp/Telegram:
          </p>

          <ol className="space-y-3 text-sm text-slate-300 list-decimal list-inside pl-2">
            <li>
              No menu superior do Android Studio, clique em:
              <div className="mt-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 font-semibold flex items-center justify-between">
                <span>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</span>
                <button
                  onClick={() =>
                    handleCopyCode(
                      'Build > Build Bundle(s) / APK(s) > Build APK(s)',
                      3
                    )
                  }
                  className="text-slate-400 hover:text-white"
                >
                  {copiedStep === 3 ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </li>
            <li>Aguarde o Gradle finalizar (leva entre 30 a 90 segundos na primeira vez).</li>
            <li>
              Aparecerá uma notificação no canto inferior direito:
              <em className="text-white block mt-1">
                "APK(s) generated successfully for module 'app' with 1 build variant"
              </em>
            </li>
            <li>
              Clique em <strong>locate</strong> na notificação para abrir a pasta do APK:
              <div className="mt-1 font-mono text-xs text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                app/build/outputs/apk/debug/app-debug.apk
              </div>
            </li>
            <li>
              Transfira o arquivo <code className="text-white">app-debug.apk</code> para o seu celular e toque nele para instalar!
            </li>
          </ol>
        </div>

        {/* Step 4: Release APK */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="text-lg font-bold text-white">
                Opção B: Gerar Release APK Assinado (Para Produção / Loja)
              </h3>
            </div>
            <span className="text-xs uppercase px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold">
              Otimizado & Assinado
            </span>
          </div>

          <p className="text-sm text-slate-300">
            Gera um APK minificado com ProGuard/R8 ativado para desempenho máximo e tamanho reduzido:
          </p>

          <ol className="space-y-3 text-sm text-slate-300 list-decimal list-inside pl-2">
            <li>
              No menu superior: <strong>Build &gt; Generate Signed Bundle / APK...</strong>
            </li>
            <li>
              Selecione <strong>APK</strong> e clique em <strong>Next</strong>.
            </li>
            <li>
              Em <strong>Key store path</strong>, selecione sua chave existente ou clique em <strong>Create new...</strong> para criar uma chave <code className="text-emerald-300">.jks</code>.
            </li>
            <li>Selecione a variante <strong>release</strong>.</li>
            <li>
              Marque as caixas de assinatura: <strong>V1 (Jar Signature)</strong> e <strong>V2 (Full APK Signature)</strong>.
            </li>
            <li>
              Clique em <strong>Create</strong>. O APK final assinado será salvo em:
              <div className="mt-1 font-mono text-xs text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                app/release/app-release.apk
              </div>
            </li>
          </ol>
        </div>

        {/* Under the hood technical insight */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Cpu className="w-4 h-4" />
            <span>Por que o Google ML Kit Document Scanner é a melhor escolha?</span>
          </div>

          <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
            <p>
              1. <strong>Tamanho Mínimo do APK:</strong> O modelo de inteligência artificial da Google para detecção de bordas e desamassamento de papel não fica embutido no APK. Ele é fornecido e atualizado dinamicamente pelo <strong>Google Play Services</strong>.
            </p>
            <p>
              2. <strong>Zero permissão de câmera obrigatória no manifesto:</strong> Como o visor de escaneamento é invocado via Intent do Play Services (<code className="text-slate-300">GmsDocumentScanning.getClient</code>), o app não precisa pedir permissões perigosas ou gerenciar ciclos complexos do CameraX.
            </p>
            <p>
              3. <strong>100% Offline:</strong> Todo o processamento de visão computacional acontece dentro do hardware local do aparelho (NPU/GPU), sem enviar nenhuma imagem para a internet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
