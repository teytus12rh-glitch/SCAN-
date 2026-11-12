/**
 * DocScan Pro — CamScanner Nativo Android & Simulador Web
 * Desenvolvido por Leandro Corrêa
 *
 * Stack Android: Kotlin + Jetpack Compose + Google ML Kit Document Scanner
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ScannerSimulator } from './components/ScannerSimulator';
import { AndroidCodeHub } from './components/AndroidCodeHub';
import { ApkGuide } from './components/ApkGuide';
import { AboutModal } from './components/AboutModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'guide' | 'about'>('simulator');
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'simulator' && (
          <ScannerSimulator onOpenAbout={() => setIsAboutOpen(true)} />
        )}
        {activeTab === 'code' && <AndroidCodeHub />}
        {activeTab === 'guide' && <ApkGuide />}
      </main>

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen || activeTab === 'about'}
        onClose={() => {
          setIsAboutOpen(false);
          if (activeTab === 'about') {
            setActiveTab('simulator');
          }
        }}
      />
    </div>
  );
}
