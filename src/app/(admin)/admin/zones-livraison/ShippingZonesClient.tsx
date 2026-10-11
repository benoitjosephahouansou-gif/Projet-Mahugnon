'use client';

import React, { useState } from 'react';
import { formatFCFA } from '@/lib/utils';
import { Truck, Plus, X, Trash2 } from 'lucide-react';

export const ShippingZonesClient: React.FC<{ initialZones: any[] }> = ({ initialZones }) => {
  const [zones, setZones] = useState<any[]>(initialZones);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('Cotonou');
  const [district, setDistrict] = useState('');
  const [feeXOF, setFeeXOF] = useState('1500');
  const [freeThreshold, setFreeThreshold] = useState('30000');
  const [isNegotiable, setIsNegotiable] = useState(false);

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    const newZone = {
      id: `zone-${Date.now()}`,
      name: name || `${city} - ${district || 'Général'}`,
      city,
      district: district || null,
      feeXOF: Number(feeXOF),
      freeShippingThresholdXOF: freeThreshold ? Number(freeThreshold) : null,
      isNegotiable,
      active: true,
    };

    setZones([...zones, newZone]);
    setShowAddModal(false);
    setName('');
    setDistrict('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une zone</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Zone / Destination</th>
                <th className="py-3.5 px-4">Ville</th>
                <th className="py-3.5 px-4">Quartier</th>
                <th className="py-3.5 px-4">Tarif Fixe (FCFA)</th>
                <th className="py-3.5 px-4">Gratuité dès</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {zones.map((zone) => (
                <tr
                  key={zone.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {zone.name}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    {zone.city}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {zone.district || 'Tous quartiers'}
                  </td>

                  <td className="py-3.5 px-4 font-black text-blue-900 dark:text-blue-300">
                    {formatFCFA(zone.feeXOF)}
                  </td>

                  <td className="py-3.5 px-4 text-emerald-600 font-bold">
                    {zone.freeShippingThresholdXOF
                      ? formatFCFA(zone.freeShippingThresholdXOF)
                      : 'Non applicable'}
                  </td>

                  <td className="py-3.5 px-4">
                    {zone.isNegotiable ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        À négocier par appel
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        Tarif Standard Fixe
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setZones(zones.filter((z) => z.id !== zone.id))}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout Zone */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Ajouter une zone de livraison
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateZone} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cotonou, Parakou, Lomé..."
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quartier (ou laisser vide pour toute la ville)
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Akpakpa, Haie Vive..."
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Frais de livraison (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  value={feeXOF}
                  onChange={(e) => setFeeXOF(e.target.value)}
                  placeholder="1500"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Seuil de gratuité (FCFA)
                </label>
                <input
                  type="number"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(e.target.value)}
                  placeholder="30000"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="negotiable" className="text-xs text-slate-600 dark:text-slate-400">
                  Tarif négociable par téléphone lors de l'appel
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
