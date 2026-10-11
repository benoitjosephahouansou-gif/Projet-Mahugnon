import React from 'react';
import { prisma } from '@/lib/prisma';
import { formatFCFA, waLink } from '@/lib/utils';
import { Users, PhoneCall, MessageCircle, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  let customers: any[] = [];
  try {
    customers = await prisma.customer.findMany({
      orderBy: { totalSpentXOF: 'desc' },
      take: 100,
    });
  } catch (e) {
    console.error('Erreur chargement clients:', e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Répertoire Clients & CRM
        </h1>
        <p className="text-xs text-slate-500">
          Suivi des acheteurs par numéro WhatsApp, fréquence de commande et volume d'achat au Bénin.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">WhatsApp</th>
                <th className="py-3.5 px-4">Ville / Quartier</th>
                <th className="py-3.5 px-4">Commandes</th>
                <th className="py-3.5 px-4">Total Acheté (FCFA)</th>
                <th className="py-3.5 px-4 text-right">Contacter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Aucun client enregistré.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
                          {c.fullName.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {c.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {c.phone}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {c.city ? `${c.city} (${c.district || ''})` : 'Non renseigné'}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {c.totalOrders} commandes
                    </td>

                    <td className="py-3.5 px-4 font-black text-blue-900 dark:text-blue-300">
                      {formatFCFA(c.totalSpentXOF)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={waLink(c.phone, `Bonjour ${c.fullName}, merci pour votre fidélité sur MAHUGNON !`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                        </a>
                        <a
                          href={`tel:${c.phone}`}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                          title="Appeler"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
