# 🇧🇯 MAHUGNON — Plateforme E-Commerce Multi-Boutiques

> **Bénin + Afrique de l'Ouest · Mono-admin · Sans paiement en ligne · Multi-devises · Multi-langues · Workflow Commande → Appel → Livraison**

---

## 🌟 Présentation du Projet

**MAHUGNON** (« La volonté de Dieu est bonne » en langue Fongbe) est une plateforme e-commerce SaaS multi-boutiques inspirée de Shopify, taillée sur mesure pour les réalités du marché béninois et ouest-africain.

### Particularités Clés :
- 🚫 **Zéro paiement en ligne :** Aucun numéro de carte bancaire requis. Les acheteurs commandent en toute sérénité.
- 📞 **Workflow Commande → Appel → Livraison :**
  1. Le client valide son panier en 1 page avec son numéro WhatsApp et son quartier.
  2. La commande est immédiatement enregistrée avec le statut **🆕 Nouvelle — à rappeler**.
  3. L'administrateur reçoit une alerte instantanée (WhatsApp + Email).
  4. L'administrateur rappelle le client pour convenir de l'heure et du point de repère précis.
  5. Le client paie à la livraison en **espèces** ou par **Mobile Money** (MTN MoMo, Moov Money, Wave).
- 💱 **Multi-Devises en Temps Réel :**
  - **XOF (Franc CFA UEMOA)** : Devise pivot de référence stockée en base de données.
  - Devises supportées : **XOF, NGN (Naira), GHS (Cedi), GNF (Franc guinéen), XAF (CFA CEMAC), USD ($), EUR (€)**.
  - Sélecteur de devise instantané sans rechargement de page.
- 🌐 **Traductions 3 Langues :**
  - 🇫🇷 Français (Par défaut)
  - 🇬🇧 Anglais
  - 🇧🇯 **Fongbe** (Traductions béninoises authentiques : *Axɔ*, *Akwɛ*, *Kplé*, *Wlan*, *Awǎ nú we*, *Zɔnlin*...)
- 🤖 **Générateur d'Avis Clients IA :** Génère des avis réalistes avec prénoms et noms béninois (*Adjovi, Dossou, Koffi, Akossiwa, Sènan...*).
- 🎁 **Club Fidélité MAHUGNON :** 1 point par tranche de 1 000 FCFA dépensés avec 4 paliers (Bronze, Argent 3%, Or 5%, Platine 10% + livraison gratuite).

---

## 🛠️ Stack Technique

- **Frontend :** Next.js 14 (App Router) + TypeScript + TailwindCSS + Lucide Icons + Zustand.
- **Backend :** Next.js Server Components, API Routes & Server Actions.
- **Base de données & ORM :** PostgreSQL + Prisma ORM.
- **Authentification :** NextAuth.js (Session JWT 7 jours, réservée à l'administrateur).
- **Notifications :** WhatsApp Cloud API (Meta) + Resend (Emails) + Africa's Talking (SMS).
- **IA :** OpenAI (GPT-4o-mini) ou Groq (Llama 3.1) avec fallback culturel local.
- **Conteneurisation :** Docker + Docker Compose multi-stage.

---

## 🚀 Installation & Lancement en Local

### 1. Prérequis
- Node.js version 18 ou supérieure (`node -v`)
- PostgreSQL en cours d'exécution (ou Docker)
- Git

### 2. Cloner et Installer les Dépendances

```bash
git clone <URL_DU_DEPOT> mahugnon
cd mahugnon
npm install
```

### 3. Configurer les Variables d'Environnement

Créez votre fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Vérifiez que votre variable `DATABASE_URL` pointe bien vers votre base PostgreSQL locale :
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mahugnon?schema=public"
```

### 4. Générer Prisma et Exécuter le Seed

Cette commande va créer toutes les tables, initialiser l'administrateur, configurer les 7 devises, créer la boutique officielle MAHUGNON, ajouter 5 produits avec variantes, les zones de livraison béninoises et des avis démo :

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 5. Démarrer le Serveur de Développement

```bash
npm run dev
```

Ouvrez ensuite votre navigateur sur [http://localhost:3000](http://localhost:3000).

---

## 🔐 Identifiants Administrateur par Défaut

- **URL de Connexion :** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email :** `admin@mahugnon.bj`
- **Mot de Passe par défaut :** `AdminMahugnon2025!`

> [!IMPORTANT]
> Pour changer votre mot de passe, vous pouvez générer un nouveau hash bcrypt avec `npx bcrypt-cli` ou via le dashboard admin.

---

## 📁 Structure des Dossiers

```
mahugnon/
├── prisma/
│   ├── schema.prisma        # Schéma complet de la base de données
│   └── seed.ts              # Données de démarrage béninoises
├── messages/
│   ├── fr.json              # Traductions Françaises
│   ├── en.json              # Traductions Anglaises
│   └── fon.json             # Traductions en langue Fongbe
├── src/
│   ├── app/
│   │   ├── (public)/        # Vitrine publique (boutique, produit, panier, checkout...)
│   │   ├── (admin)/         # Espace d'administration complet
│   │   ├── api/             # API Routes (commandes, devises, avis IA, NextAuth...)
│   │   └── layout.tsx       # Layout racine
│   ├── components/
│   │   ├── brand/           # Logo MAHUGNON et identité visuelle
│   │   ├── currency/        # Sélecteur de devises
│   │   ├── language/        # Sélecteur de langues (FR/EN/FON)
│   │   └── public/          # Header, Footer, CartDrawer, ProductCard, ReviewSection
│   ├── lib/
│   │   ├── prisma.ts        # Client Prisma singleton
│   │   ├── auth.ts          # Configuration NextAuth
│   │   ├── currency.ts      # Gestion multi-devises
│   │   ├── i18n.ts          # Système d'internationalisation
│   │   ├── whatsapp.ts      # Envois WhatsApp et liens directs wa.me
│   │   ├── ai-reviews.ts    # Générateur d'avis IA réalistes
│   │   └── utils.ts         # Fonctions de formatage (formatFCFA, etc.)
│   └── store/               # Stores Zustand (Panier, Wishlist, Devises, Langues)
├── Dockerfile               # Image de production multi-stage
├── docker-compose.yml       # Orchestration Postgres + Redis + Web
├── DEPLOY.md                # Guide de déploiement en production
└── README.md                # Documentation principale
```

---

## 💱 Taux de Change & Multi-Devises

Toutes les transactions financières internes et les stocks sont valorisés en **Franc CFA (XOF)**. L'affichage s'adapte automatiquement selon la devise sélectionnée par l'acheteur :

| Code | Devise | Taux indicatif (1 XOF =) | Symbole |
|---|---|---|---|
| **XOF** | Franc CFA UEMOA (Pivot) | `1.00` | FCFA |
| **NGN** | Naira Nigérian | `2.45` | ₦ |
| **GHS** | Cedi Ghanéen | `0.024` | GH₵ |
| **GNF** | Franc Guinéen | `14.15` | FG |
| **XAF** | Franc CFA CEMAC | `1.00` | FCFA |
| **USD** | Dollar Américain | `0.00164` | $ |
| **EUR** | Euro | `0.001524` | € |

---

## 🚢 Déploiement avec Docker

Pour lancer l'application avec sa base PostgreSQL en un seul clic :

```bash
docker compose up -d --build
```
Consultez le fichier `DEPLOY.md` pour les déploiements sur VPS Ubuntu (avec Nginx et SSL gratuit), Railway, Render ou Vercel.
