import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { formatFCFA, waLink } from '@/lib/utils';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Users,
  Award,
  PhoneCall,
  MessageCircle,
  ArrowRight,
  Package,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let ordersCount = 0;
  let newToCallOrders: any[] = [];
  let confirmedCount = 0;
  let deliveredCount = 0;
  let totalSpentSum = 0;
  let customersCount = 0;
  let loyaltyCount = 0;

  try {
    ordersCount = await prisma.order.count();
    confirmedCount = await prisma.order.count({ where: { status: OrderStatus.CONFIRMED } });
    deliveredCount = await prisma.order.count({ where: { status: OrderStatus.DELIVERED_PAID } });

    newToCallOrders = await prisma.order.findMany({
      where: { status: OrderStatus.NEW_TO_CALL },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    const sumRes = await prisma.order.aggregate({
      _sum: { totalXOF: true },
      where: { status: { in: [OrderStatus.DELIVERED_PAID, OrderStatus.CONFIRMED, OrderStatus.IN_DELIVERY] } },
    });
    totalSpentSum = sumRes._sum.totalXOF || 0;

    customersCount = await prisma.customer.count();
    loyaltyCount = await prisma.loyaltyMember.count();
  } catch (e) {
    console.warn('Dashboard DB load error:', e);
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Titre Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            Tableau de Bord MAHUGNON
          </h1>
          <p className="text-xs text-slate-500">
            Vue d'ensemble de vos ventes, appels à passer et expéditions en cours au Bénin.
          </p>
        </div>

        <Link
          href="/admin/commandes"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          <span>Gérer toutes les commandes</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI Chiffre d'Affaires */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Chiffre d'Affaires (FCFA)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {formatFCFA(totalSpentSum)}
          </div>
          <p className="text-[11px] text-emerald-600 font-bold">
            Commandes confirmées & livrées
          </p>
        </div>

        {/* KPI À Rappeler (URGENT - ROUGE/AMBRE) */}
        <div className="bg-gradient-to-br from-red-500 to-amber-600 text-white rounded-3xl p-6 shadow-lg shadow-red-500/20 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-red-100">
            <span className="text-xs font-black uppercase tracking-wider">À Rappeler Immédiatement</span>
            <Clock className="w-5 h-5 animate-spin" />
          </div>
          <div className="text-3xl font-black">
            {newToCallOrders.length}
          </div>
          <p className="text-xs text-red-100 font-semibold">
            Clients attendant votre coup de fil
          </p>
        </div>

        {/* KPI Commandes confirmées */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Commandes</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {ordersCount}
          </div>
          <p className="text-[11px] text-slate-500">
            {confirmedCount} confirmées • {deliveredCount} livrées
          </p>
        </div>

        {/* KPI Clients & Fidélité */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Clients & Fidélité</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {customersCount}
          </div>
          <p className="text-[11px] text-slate-500">
            {loyaltyCount} membres actifs au Club MAHUGNON
          </p>
        </div>
      </div>

      {/* SECTION PRIORITAIRE : Commandes à rappeler d'urgence */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
              Commandes Urgentes — En Attente de Rappel Téléphonique
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {newToCallOrders.length} commande(s)
          </span>
        </div>

        {newToCallOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold">Toutes les commandes ont été rappelées !</p>
            <p className="text-xs text-slate-400">Aucune commande en attente pour le moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {newToCallOrders.map((order) => {
              const wa = waLink(
                order.customerPhone,
                `Bonjour ${order.customerName}, je vous appelle au sujet de votre commande MAHUGNON N° ${order.orderNumber}.`
              );

              return (
                <div
                  key={order.id}
                  className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">
                        {order.orderNumber}
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {order.customerName}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>📍 {order.city} ({order.district})</span>
                      <span>🏠 {order.address}</span>
                      {order.landmark && <span>(Repère: {order.landmark})</span>}
                    </div>

                    {order.notes && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                        Note client : "{order.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions Rapides d'Appel */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="text-right mr-3 hidden sm:block">
                      <div className="font-black text-xs text-slate-900 dark:text-slate-100">
                        {formatFCFA(order.totalXOF)}
                      </div>
                      {order.clientCurrency !== 'XOF' && (
                        <div className="text-[10px] text-slate-400">
                          {order.totalClientCurrency} {order.clientCurrency}
                        </div>
                      )}
                    </div>

                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${order.customerPhone}`}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Appeler</span>
                    </a>

                    <Link
                      href={`/admin/commandes?orderId=${order.id}`}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                      title="Gérer le statut"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
