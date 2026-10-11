import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import * as bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 jours
  },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();

        // 1. Recherche dans la table Admin Prisma
        try {
          const admin = await prisma.admin.findUnique({
            where: { email },
          });

          if (admin) {
            const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);
            if (isValid) {
              return {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
              };
            }
          }
        } catch (error) {
          console.warn('Erreur de requête DB auth, fallback vers .env si configuré', error);
        }

        // 2. Fallback avec les variables d'environnement si la DB n'est pas encore migrée
        const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@mahugnon.bj').toLowerCase();
        const envHash = process.env.ADMIN_PASSWORD_HASH;

        if (email === envAdminEmail) {
          // Si le mot de passe correspond au mot de passe d'initialisation
          if (credentials.password === 'AdminMahugnon2025!') {
            return {
              id: 'admin-env-fallback-id',
              email: envAdminEmail,
              name: 'Administrateur MAHUGNON',
              role: 'ADMIN',
            };
          }
          if (envHash) {
            const isValid = await bcrypt.compare(credentials.password, envHash);
            if (isValid) {
              return {
                id: 'admin-env-fallback-id',
                email: envAdminEmail,
                name: 'Administrateur MAHUGNON',
                role: 'ADMIN',
              };
            }
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'ADMIN';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'mahugnon_super_secret_jwt_key_2025_benin_ecommerce_auth',
};
