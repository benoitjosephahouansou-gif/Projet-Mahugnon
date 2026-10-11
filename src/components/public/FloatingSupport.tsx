'use client';

import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingSupport: React.FC = () => {
  const crispId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

  useEffect(() => {
    if (crispId && !crispId.includes('xxxx') && typeof window !== 'undefined') {
      (window as any).$crisp = [];
      (window as any).CRISP_WEBSITE_ID = crispId;
      const d = document;
      const s = d.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = true;
      d.getElementsByTagName('head')[0].appendChild(s);
    }
  }, [crispId]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      {/* Bouton WhatsApp Flottant */}
      <a
        href="https://wa.me/22997000000?text=Bonjour%20MAHUGNON%2C%20j%27ai%20une%20question%20sur%20un%20produit."
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-white dark:border-slate-800"
        title="Discuter directement sur WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold hidden sm:inline group-hover:inline">
          Besoin d'aide ? WhatsApp
        </span>
      </a>
    </div>
  );
};
