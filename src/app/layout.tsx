import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MAHUGNON — E-commerce & Marketplace Bénin & Afrique de l\'Ouest',
  description:
    'Achetez en toute confiance au Bénin. Mode wax, cosmétiques au beurre de karité bio, épices et artisanat. Paiement à la livraison après confirmation téléphonique.',
  keywords: [
    'e-commerce Bénin',
    'Cotonou',
    'Porto-Novo',
    'Parakou',
    'paiement à la livraison',
    'MTN MoMo',
    'Moov Money',
    'Wave',
    'wax béninois',
    'beurre de karité',
  ],
  authors: [{ name: 'MAHUGNON' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
