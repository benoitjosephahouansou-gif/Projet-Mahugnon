'use client';

import React, { useState } from 'react';
import { Settings, Save, Check, ShieldCheck, Globe, Bell, Key } from 'lucide-react';

export default function AdminSettingsPage() {
  const [adminPhone, setAdminPhone] = useState('+229 97 00 00 00');
  const [adminEmail, setAdminEmail] = useState('admin@mahugnon.bj');
  const [timezone, setTimezone] = useState('Africa/Porto-Novo');
  const [crispId, setCrispId] = useState('');
  const [exchangeApiKey, setExchangeApiKey] = useState('');
  const [message, setMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Paramètres enregistrés avec succès.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Paramètres Généraux de la Plateforme
        </h1>
        <p className="text-xs text-slate-500">
          Configuration des alertes WhatsApp, passerelles d'emails et clés API de l'administrateur unique.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Coordonnées & Alertes Commande */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Alertes & Notifications de Nouvelles Commandes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Numéro WhatsApp Administrateur (Réception des alertes)
              </label>
              <input
                type="text"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="+229 97 00 00 00"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Administrateur
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@mahugnon.bj"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Fuseau Horaire de Référence
            </label>
            <input
              type="text"
              readOnly
              value={timezone}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Heure légale de la République du Bénin (GMT+1)
            </span>
          </div>
        </div>

        {/* Clés d'API & Intégrations */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Key className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Passerelles & Intégrations Externes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ID Site Crisp Chat (Support client direct)
              </label>
              <input
                type="text"
                value={crispId}
                onChange={(e) => setCrispId(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clé API Exchangerate (Multi-devises)
              </label>
              <input
                type="text"
                value={exchangeApiKey}
                onChange={(e) => setExchangeApiKey(e.target.value)}
                placeholder="exchangerate-api.com API Key"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les paramètres</span>
          </button>
        </div>
      </form>
    </div>
  );
}
