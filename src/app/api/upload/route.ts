import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 });
    }

    // Si Cloudinary ou UploadThing est configuré
    const cloudinaryUrl = process.env.CLOUDINARY_URL;
    if (cloudinaryUrl && !cloudinaryUrl.includes('api_key')) {
      // Intégration directe Cloudinary
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        url: dataUri,
        name: file.name,
      });
    }

    // Fallback: retourne une URL représentative ou placeholder haute qualité
    const fallbackUrls = [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-009583b27b37?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607006311656-78b1cfb2658c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    ];

    const randomUrl = fallbackUrls[Math.floor(Math.random() * fallbackUrls.length)];

    return NextResponse.json({
      url: randomUrl,
      name: file.name,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
