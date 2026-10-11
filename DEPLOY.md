# 🚀 Guide de Déploiement — MAHUGNON

Plateforme e-commerce multi-boutiques optimisée pour le Bénin et l'Afrique de l'Ouest.

---

## Sommaire
1. [Déploiement sur VPS Ubuntu (Docker + Nginx + SSL Let's Encrypt)](#1-déploiement-sur-vps-ubuntu)
2. [Déploiement sur Railway](#2-déploiement-sur-railway)
3. [Déploiement sur Render](#3-déploiement-sur-render)
4. [Déploiement sur Vercel + Supabase/Neon](#4-déploiement-sur-vercel--supabaseneon)
5. [Variables d'Environnement Obligatoires](#5-variables-denvironnement-obligatoires)

---

## 1. Déploiement sur VPS Ubuntu

### Étape 1 : Préparation du serveur Ubuntu (22.04 / 24.04 LTS)

Connectez-vous en SSH à votre VPS :
```bash
ssh root@votre-ip-serveur
```

Mettez à jour les paquets système :
```bash
apt update && apt upgrade -y
apt install -y git curl ufw nginx certbot python3-certbot-nginx
```

Configurez le pare-feu UFW :
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

### Étape 2 : Installation de Docker & Docker Compose

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose-plugin
```

### Étape 3 : Cloner le projet MAHUGNON

```bash
cd /var/www
git clone <URL_DE_VOTRE_DEPOT> mahugnon
cd mahugnon
cp .env.example .env
nano .env # Renseignez vos identifiants réels
```

### Étape 4 : Lancement avec Docker Compose

```bash
docker compose up -d --build
```

Exécutez les migrations Prisma et le seed dans le conteneur :
```bash
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed
```

### Étape 5 : Configuration Nginx Reverse Proxy

Créez le fichier de configuration Nginx :
```bash
nano /etc/nginx/sites-available/mahugnon.conf
```

Collez la configuration suivante (remplacez `votredomaine.bj` par votre nom de domaine) :
```nginx
server {
    server_name votredomaine.bj www.votredomaine.bj;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 20M;
}
```

Activez le site et redémarrez Nginx :
```bash
ln -s /etc/nginx/sites-available/mahugnon.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Étape 6 : Activation du certificat SSL HTTPS Gratuit (Certbot)

```bash
certbot --nginx -d votredomaine.bj -d www.votredomaine.bj
```

Votre plateforme MAHUGNON est maintenant accessible en HTTPS sécurisé !

---

## 2. Déploiement sur Railway

1. Rendez-vous sur [railway.app](https://railway.app) et connectez votre compte GitHub.
2. Cliquez sur **New Project** > **Provision PostgreSQL**.
3. Cliquez sur **New Service** > **GitHub Repo** et sélectionnez le dépôt MAHUGNON.
4. Dans l'onglet **Variables** du service Next.js :
   - Ajoutez la variable `DATABASE_URL` liée à votre base Postgres Railway (`${{Postgres.DATABASE_URL}}`).
   - Ajoutez `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (votre URL Railway), `ADMIN_EMAIL`, etc.
5. Dans **Settings** > **Build Command** :
   ```bash
   npx prisma generate && npx prisma db push && npm run build
   ```
6. Dans **Start Command** :
   ```bash
   npm start
   ```

---

## 3. Déploiement sur Render

1. Créez une nouvelle base **PostgreSQL** sur Render. Copiez son `Internal Database URL`.
2. Créez un **Web Service** connecté à votre dépôt GitHub.
3. Définissez :
   - **Environment** : `Node`
   - **Build Command** : `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command** : `npm start`
4. Ajoutez les variables d'environnement dans la section **Environment**.

---

## 4. Déploiement sur Vercel + Supabase/Neon

1. Créez une base de données PostgreSQL gratuite sur [Neon.tech](https://neon.tech) ou [Supabase](https://supabase.com).
2. Récupérez la chaîne de connexion `DATABASE_URL` (format `postgresql://...`).
3. Importez le projet sur [Vercel](https://vercel.com).
4. Ajoutez toutes les variables du fichier `.env.example`.
5. Lancez le déploiement. Vercel gère automatiquement le build et le caching Edge.

---

## 5. Variables d'Environnement Obligatoires

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chaîne de connexion PostgreSQL |
| `NEXTAUTH_SECRET` | Clé secrète de signature des sessions JWT |
| `NEXTAUTH_URL` | URL racine du site (ex: `https://mahugnon.bj`) |
| `ADMIN_EMAIL` | Email de l'administrateur unique |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt du mot de passe admin |
| `ADMIN_WHATSAPP_NUMBER` | Numéro WhatsApp recevant les alertes de commandes |
| `DEFAULT_CURRENCY` | `XOF` (Franc CFA UEMOA pivot) |
