'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, ExternalLink, X, Save } from 'lucide-react';

export const PagesManagerClient: React.FC<{ initialPages: any[] }> = ({ initialPages }) => {
  const [pages, setPages] = useState<any[]>(initialPages);
  const [showEditor, setShowEditor] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPage = {
      id: `page-${Date.now()}`,
      title,
      slug: finalSlug,
      content,
      isPublished: true,
      shop: { slug: 'mahugnon-officiel' },
    };

    setPages([newPage, ...pages]);
    setShowEditor(false);
    setTitle('');
    setSlug('');
    setContent('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowEditor(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une nouvelle page</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <div
            key={page.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {page.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                /page/{page.slug}
              </p>
              <div
                className="text-xs text-slate-500 line-clamp-3 pt-2"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <Link
                href={`/boutique/${page.shop?.slug || 'mahugnon-officiel'}/page/${page.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                <span>Voir en ligne</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Éditeur de Page CMS */}
      {showEditor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Rédiger une page CMS
              </h3>
              <button onClick={() => setShowEditor(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la page *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Politique de retour et remboursement"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="politique-de-retour"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contenu HTML / Texte *
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>Écrivez les conditions et modalités ici...</p>"
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
