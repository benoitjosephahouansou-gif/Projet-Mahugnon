'use client';

import React, { useState } from 'react';
import { formatFCFA, waLink, formatDateFr, formatCurrency } from '@/lib/utils';
import {
  Search,
  Filter,
  PhoneCall,
  MessageCircle,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Printer,
  Download,
  Eye,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  secondaryPhone?: string;
  customerEmail?: string;
  city: string;
  district: string;
  address: string;
  landmark?: string;
  notes?: string;
  internalNotes?: string;
  subtotalXOF: number;
  shippingFeeXOF: number;
  totalXOF: number;
  clientCurrency: string;
  exchangeRate: number;
  totalClientCurrency: number;
  createdAt: string;
  items: any[];
  shop?: { name: string };
}

export const OrdersManagerClient: React.FC<{ initialOrders: OrderItem[] }> = ({
  initialOrders,
}) => {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const statusLabels: Record<string, { label: string; color: string }> = {
    NEW_TO_CALL: { label: '🆕 À rappeler', color: 'bg-red-500 text-white animate-pulse' },
    CALLED_NEGOTIATING: { label: '📞 En négociation', color: 'bg-blue-600 text-white' },
    CONFIRMED: { label: '✅ Confirmée', color: 'bg-emerald-600 text-white' },
    IN_DELIVERY: { label: '🚚 En livraison', color: 'bg-purple-600 text-white' },
    DELIVERED_PAID: { label: '💰 Livrée & payée', color: 'bg-green-700 text-white' },
    CANCELLED: { label: '❌ Annulée', color: 'bg-slate-400 text-white' },
    RETURNED: { label: '↩️ Retournée', color: 'bg-amber-600 text-white' },
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search) ||
      order.city.toLowerCase().includes(search.toLowerCase()) ||
      order.district.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch('/api/commandes/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      'Numero,Date,Client,Telephone,Ville,Quartier,Montant_XOF,Devise_Client,Montant_Client,Statut',
    ];
    const rows = filteredOrders.map(
      (o) =>
        `"${o.orderNumber}","${o.createdAt}","${o.customerName}","${o.customerPhone}","${o.city}","${o.district}",${o.totalXOF},"${o.clientCurrency}",${o.totalClientCurrency},"${o.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `commandes_mahugnon_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Barre de Recherche & Filtres */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par n° commande, client, téléphone, quartier..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
              title="Exporter vers Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exporter CSV</span>
            </button>
          </div>
        </div>

        {/* Pilules de statut */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Toutes ({orders.length})
          </button>
          {Object.entries(statusLabels).map(([key, info]) => {
            const count = orders.filter((o) => o.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  statusFilter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {info.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tableau des Commandes */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Commande</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Lieu</th>
                <th className="py-3.5 px-4">Montant</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions rapides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = statusLabels[order.status] || {
                    label: order.status,
                    color: 'bg-slate-200 text-slate-800',
                  };
                  const wa = waLink(
                    order.customerPhone,
                    `Bonjour ${order.customerName}, je vous appelle au sujet de votre commande MAHUGNON N° ${order.orderNumber}.`
                  );

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-black text-blue-600 dark:text-blue-400">
                        {order.orderNumber}
                        <span className="block font-sans font-normal text-[10px] text-slate-400">
                          {formatDateFr(order.createdAt)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">
                          {order.customerName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {order.customerPhone}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {order.city}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {order.district}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-900 dark:text-slate-100 block">
                          {formatFCFA(order.totalXOF)}
                        </span>
                        {order.clientCurrency !== 'XOF' && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            ~ {formatCurrency(order.totalClientCurrency, order.clientCurrency)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                            title="Discuter sur WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                          </a>

                          <a
                            href={`tel:${order.customerPhone}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                            title="Appeler par téléphone"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Fiche Commande & Facture PDF */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 animate-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-black text-blue-600">
                  {selectedOrder.orderNumber}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  Fiche Commande & Suivi d'Appel
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Changement de Statut Interactif */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 font-bold block">
                  Statut actuel de la commande :
                </span>
                <span className="text-sm font-black text-blue-900 dark:text-blue-200">
                  {statusLabels[selectedOrder.status]?.label || selectedOrder.status}
                </span>
              </div>

              <select
                value={selectedOrder.status}
                onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                disabled={isUpdatingStatus}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-blue-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="NEW_TO_CALL">🆕 Nouvelle — à rappeler</option>
                <option value="CALLED_NEGOTIATING">📞 Appelée — en négociation</option>
                <option value="CONFIRMED">✅ Confirmée</option>
                <option value="IN_DELIVERY">🚚 En cours de livraison</option>
                <option value="DELIVERED_PAID">💰 Livrée — payée</option>
                <option value="CANCELLED">❌ Annulée</option>
                <option value="RETURNED">↩️ Retournée</option>
              </select>
            </div>

            {/* Coordonnées Client & Livraison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Client
                </span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedOrder.customerName}
                </p>
                <p className="text-blue-600 font-semibold">{selectedOrder.customerPhone}</p>
                {selectedOrder.secondaryPhone && (
                  <p className="text-slate-500">Sec: {selectedOrder.secondaryPhone}</p>
                )}
                {selectedOrder.customerEmail && (
                  <p className="text-slate-500">{selectedOrder.customerEmail}</p>
                )}
              </div>

              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Destination Bénin
                </span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedOrder.city} — {selectedOrder.district}
                </p>
                <p className="text-slate-600 dark:text-slate-300">{selectedOrder.address}</p>
                {selectedOrder.landmark && (
                  <p className="text-amber-600 dark:text-amber-400 font-medium">
                    Repère : {selectedOrder.landmark}
                  </p>
                )}
              </div>
            </div>

            {/* Articles de la commande */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Articles commandés ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-40 overflow-y-auto pr-1">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="py-2 flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.quantity}x {item.productName}
                      </span>
                      {item.variantName && (
                        <span className="text-blue-600 text-[11px] ml-1.5">
                          ({item.variantName})
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatFCFA(item.totalPriceXOF)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totaux Double-Devises */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Sous-total XOF :</span>
                <span>{formatFCFA(selectedOrder.subtotalXOF)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Livraison :</span>
                <span>{formatFCFA(selectedOrder.shippingFeeXOF)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-blue-900 dark:text-blue-200 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Facturé :</span>
                <span>{formatFCFA(selectedOrder.totalXOF)}</span>
              </div>
              {selectedOrder.clientCurrency !== 'XOF' && (
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Total Devise Client ({selectedOrder.clientCurrency}) :</span>
                  <span>
                    {formatCurrency(selectedOrder.totalClientCurrency, selectedOrder.clientCurrency)} (Taux : {selectedOrder.exchangeRate})
                  </span>
                </div>
              )}
            </div>

            {/* Boutons d'impression et d'appel */}
            <div className="flex flex-wrap gap-2 justify-end pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Facture</span>
              </button>
              <a
                href={`tel:${selectedOrder.customerPhone}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Appeler le client</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
