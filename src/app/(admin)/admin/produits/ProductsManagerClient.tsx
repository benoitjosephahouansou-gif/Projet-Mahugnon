'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatFCFA } from '@/lib/utils';
import {
  Plus,
  Search,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  CheckCircle,
  X,
  AlertCircle,
} from 'lucide-react';

export const ProductsManagerClient: React.FC<{
  initialProducts: any[];
  shops: any[];
  categories: any[];
}> = ({ initialProducts, shops, categories }) => {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProductForAI, setSelectedProductForAI] = useState<any | null>(null);

  // Add Product Form
  const [shopId, setShopId] = useState(shops[0]?.id || '');
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [priceXOF, setPriceXOF] = useState('');
  const [compareAtPriceXOF, setCompareAtPriceXOF] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('20');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPromo, setIsPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Modal Form
  const [aiCount, setAiCount] = useState(5);
  const [aiLang, setAiLang] = useState('FR');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/produits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId,
          categoryId: categoryId || undefined,
          name,
          priceXOF: Number(priceXOF),
          compareAtPriceXOF: compareAtPriceXOF ? Number(compareAtPriceXOF) : undefined,
          sku: sku || undefined,
          stock: Number(stock),
          description,
          isPromo,
          images: imageUrl ? [imageUrl] : [],
        }),
      });

      const data = await res.json();
      if (res.ok && data.product) {
        setProducts([data.product, ...products]);
        setShowAddModal(false);
        setName('');
        setPriceXOF('');
        setCompareAtPriceXOF('');
        setDescription('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForAI) return;

    setIsGeneratingAI(true);
    setAiSuccessMsg('');

    try {
      const res = await fetch('/api/avis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductForAI.id,
          productName: selectedProductForAI.name,
          count: aiCount,
          language: aiLang,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiSuccessMsg(`${data.count || aiCount} avis réalistes générés avec succès !`);
        setTimeout(() => {
          setSelectedProductForAI(null);
          setAiSuccessMsg('');
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Contrôles Haut */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, SKU..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Tableau des Produits */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Boutique</th>
                <th className="py-3.5 px-4">Prix Pivot (FCFA)</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Avis</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((product) => {
                const img = product.images?.[0]?.url;
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                          {img ? (
                            <img src={img} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">IMG</div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {product.name}
                          </span>
                          {product.isPromo && (
                            <span className="inline-block bg-red-100 text-red-600 text-[9px] font-black uppercase px-1.5 py-0.2 rounded">
                              PROMO
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {product.shop?.name || 'MAHUGNON'}
                    </td>

                    <td className="py-3.5 px-4 font-black text-blue-900 dark:text-blue-300">
                      {formatFCFA(product.priceXOF)}
                    </td>

                    <td className="py-3.5 px-4 font-semibold">
                      <span className={product.stock < 5 ? 'text-red-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                        {product.stock} unités
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold text-[11px]">
                        ⭐ {product._count?.reviews || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedProductForAI(product)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-blue-300 font-bold text-[11px] transition-colors"
                        title="Générer des avis clients réalistes par IA"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Avis IA</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout Produit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Ajouter un nouveau produit
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Tissu Wax Grand Teint Cotonou"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Prix Pivot (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    value={priceXOF}
                    onChange={(e) => setPriceXOF(e.target.value)}
                    placeholder="15000"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Prix Barré (FCFA)
                  </label>
                  <input
                    type="number"
                    value={compareAtPriceXOF}
                    onChange={(e) => setCompareAtPriceXOF(e.target.value)}
                    placeholder="20000"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Référence SKU
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="MHG-WAX-002"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL de l'image (Cloudinary ou WebP)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description détaillée du produit..."
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
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
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Génération d'Avis IA */}
      {selectedProductForAI && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  Générer des avis IA réalistes
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductForAI(null)}
                className="text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Pour : <strong>{selectedProductForAI.name}</strong>. Des avis authentiques avec des noms béninois (Adjovi, Dossou, Koffi, Akossiwa...) et mention de paiement à la livraison seront créés.
            </p>

            {aiSuccessMsg ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold text-center">
                {aiSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleGenerateAI} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre d'avis à créer (5 à 50)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Langue des avis
                  </label>
                  <select
                    value={aiLang}
                    onChange={(e) => setAiLang(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    <option value="FR">🇫🇷 Français (Bénin)</option>
                    <option value="EN">🇬🇧 Anglais</option>
                    <option value="FON">🇧🇯 Fongbe</option>
                    <option value="MIX">Mixte (FR + Expressions locales)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProductForAI(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingAI}
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isGeneratingAI ? 'Génération IA...' : 'Lancer la génération'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
