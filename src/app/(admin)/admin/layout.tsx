'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { MahugnonLogo } from '@/components/brand/MahugnonLogo';
import { CurrencySelector } from '@/components/currency/CurrencySelector';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  ClipboardList,
  Users,
  Star,
  Award,
  Coins,
  Tag,
  Truck,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Pas de sidebar sur la page de login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Boutiques', href: '/admin/boutiques', icon: Store },
    { label: 'Produits', href: '/admin/produits', icon: ShoppingBag },
    { label: 'Commandes', href: '/admin/commandes', icon: ClipboardList, badge: 'À rappeler' },
    { label: 'Clients (CRM)', href: '/admin/clients', icon: Users },
    { label: 'Avis Clients', href: '/admin/avis', icon: Star },
    { label: 'Programme Fidélité', href: '/admin/fidelite', icon: Award },
    { label: 'Devises & Taux', href: '/admin/devises', icon: Coins },
    { label: 'Codes Promo', href: '/admin/promos', icon: Tag },
    { label: 'Zones Livraison', href: '/admin/zones-livraison', icon: Truck },
    { label: 'Pages CMS', href: '/admin/pages', icon: FileText },
    { label: 'Paramètres', href: '/admin/parametres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar Mobile Toggle Button */}
      <div className="md:hidden bg-blue-900 text-white px-4 py-3 flex items-center justify-between border-b border-blue-800">
        <MahugnonLogo size="sm" />
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 rounded-lg text-blue-200 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Bleu MAHUGNON */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col justify-between p-4 border-r border-blue-800/60 shadow-2xl transition-transform duration-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="px-2 pt-2">
            <MahugnonLogo size="md" />
          </div>

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-blue-200 hover:bg-blue-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="pt-4 border-t border-blue-800/60 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-blue-200 hover:text-white hover:bg-blue-800/40 rounded-xl transition-colors"
          >
            <span>Voir la boutique en ligne</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-300 hover:text-red-100 hover:bg-red-950/40 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Zone Contenu Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Administrateur */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
          <div className="text-xs font-bold text-slate-500 hidden sm:block">
            Administrateur Unique • République du Bénin 🇧🇯
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Sélecteur de devise admin : convertit les chiffres du tableau de bord */}
            <CurrencySelector compact />
            <LanguageSelector compact />

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow">
                A
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden md:inline">
                Admin MAHUGNON
              </span>
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
