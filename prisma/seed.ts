import { PrismaClient, Role, VendorStatus, OrderStatus, ProductStatus, LoyaltyTier, LoyaltyTxType, DiscountType, ReviewStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initialisation du seed MAHUGNON avec données réalistes Bénin...');

  // 1. MOTS DE PASSE HASHÉS
  const adminPasswordHash = bcrypt.hashSync('Mahugnon2025!', 10);
  const vendorPasswordHash = bcrypt.hashSync('Vendeur2025!', 10);

  // 2. UTILISATEURS PRINCIPAUX
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@mahugnon.com' },
    update: {
      passwordHash: adminPasswordHash,
      role: Role.SUPER_ADMIN,
      status: VendorStatus.APPROVED,
    },
    create: {
      email: 'admin@mahugnon.com',
      passwordHash: adminPasswordHash,
      name: 'Super Administrateur MAHUGNON',
      phone: '+22997000000',
      role: Role.SUPER_ADMIN,
      status: VendorStatus.APPROVED,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      onboardingDone: true,
    },
  });

  const demoVendor = await prisma.user.upsert({
    where: { email: 'vendeur@mahugnon.com' },
    update: {
      passwordHash: vendorPasswordHash,
      role: Role.VENDOR,
      status: VendorStatus.APPROVED,
    },
    create: {
      email: 'vendeur@mahugnon.com',
      passwordHash: vendorPasswordHash,
      name: 'Adjovi Dossou',
      phone: '+22997000001',
      role: Role.VENDOR,
      status: VendorStatus.APPROVED,
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
      onboardingDone: true,
    },
  });

  // Marchands secondaires pour les autres boutiques
  const vendor2 = await prisma.user.upsert({
    where: { email: 'koffi.dossou@mahugnon.com' },
    update: {},
    create: {
      email: 'koffi.dossou@mahugnon.com',
      passwordHash: vendorPasswordHash,
      name: 'Koffi Dossou',
      phone: '+22997000002',
      role: Role.VENDOR,
      status: VendorStatus.APPROVED,
      onboardingDone: true,
    },
  });

  const vendor3 = await prisma.user.upsert({
    where: { email: 'ayele.bio@mahugnon.com' },
    update: {},
    create: {
      email: 'ayele.bio@mahugnon.com',
      passwordHash: vendorPasswordHash,
      name: 'Ayélé Bio',
      phone: '+22997000003',
      role: Role.VENDOR,
      status: VendorStatus.APPROVED,
      onboardingDone: true,
    },
  });

  const vendorPending = await prisma.user.upsert({
    where: { email: 'candidat@mahugnon.com' },
    update: {},
    create: {
      email: 'candidat@mahugnon.com',
      passwordHash: vendorPasswordHash,
      name: 'Fadil Sènan',
      phone: '+22997000004',
      role: Role.VENDOR,
      status: VendorStatus.PENDING,
      onboardingDone: false,
    },
  });

  console.log('✅ Utilisateurs configurés (Super Admin, Vendeurs & Candidat)');

  // 3. DEVISES
  const currenciesData = [
    { code: 'XOF', name: 'Franc CFA UEMOA', symbol: 'FCFA', rateToXOF: 1.0, isPivot: true, flag: '🇧🇯' },
    { code: 'NGN', name: 'Naira Nigérian', symbol: '₦', rateToXOF: 2.45, isPivot: false, flag: '🇳🇬' },
    { code: 'GHS', name: 'Cedi Ghanéen', symbol: 'GH₵', rateToXOF: 0.024, isPivot: false, flag: '🇬🇭' },
    { code: 'GNF', name: 'Franc Guinéen', symbol: 'FG', rateToXOF: 14.2, isPivot: false, flag: '🇬🇳' },
    { code: 'XAF', name: 'Franc CFA CEMAC', symbol: 'FCFA', rateToXOF: 1.0, isPivot: false, flag: '🇨🇲' },
    { code: 'USD', name: 'Dollar Américain', symbol: '$', rateToXOF: 0.00165, isPivot: false, flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', rateToXOF: 0.00152, isPivot: false, flag: '🇪🇺' },
  ];

  for (const curr of currenciesData) {
    await prisma.currency.upsert({
      where: { code: curr.code },
      update: curr,
      create: curr,
    });
  }
  console.log('✅ 7 Devises initialisées');

  // 4. BOUTIQUES DÉMO (8 BOUTIQUES BÉNINOISES)
  const shopsData = [
    {
      vendorId: demoVendor.id,
      name: 'Wax & Style Cotonou',
      slug: 'wax-style-cotonou',
      description: 'L’élégance africaine au quotidien : créations sur-mesure en tissu Wax hollandais véritable, robes de soirée, chemises homme et accessoires tendance cousus par les meilleurs artisans de Cotonou.',
      logoUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      country: 'Bénin',
      city: 'Cotonou',
      phone: '+22997112233',
      whatsappNumber: '+22997112233',
      category: 'Mode & Habillement',
      plan: 'BUSINESS',
      isDemo: true,
      primaryColor: '#1E40AF',
    },
    {
      vendorId: demoVendor.id,
      name: 'Adjovi Beauty',
      slug: 'adjovi-beauty',
      description: 'Cosmétiques 100% naturels élaborés au Bénin : beurre de karité pur non raffiné, huiles précieuses de baobab et moringa, savons noirs exfoliants et soins capillaires pour sublimer votre beauté naturelle.',
      logoUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80',
      country: 'Bénin',
      city: 'Cotonou',
      phone: '+22997223344',
      whatsappNumber: '+22997223344',
      category: 'Beauté & Cosmétiques',
      plan: 'PRO',
      isDemo: true,
      primaryColor: '#D97706',
    },
    {
      vendorId: vendor2.id,
      name: 'Dossou Électro',
      slug: 'dossou-electro',
      description: 'Votre référence High-Tech à Cotonou et Calavi : smartphones neufs et reconditionnés garantis, powerbanks solaires haute capacité, écouteurs sans fil et accessoires informatiques fiables.',
      logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      country: 'Bénin',
      city: 'Cotonou',
      phone: '+22997334455',
      whatsappNumber: '+22997334455',
      category: 'Électronique & High-Tech',
      plan: 'BUSINESS',
      isDemo: true,
      primaryColor: '#059669',
    },
    {
      vendorId: vendor2.id,
      name: 'Koffi Sneakers',
      slug: 'koffi-sneakers',
      description: 'Le temple de la sneaker urbaine au Bénin. Modèles collector, baskets running tout confort et chaussures de ville soignées pour hommes et femmes qui aiment marquer leur différence.',
      logoUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
      country: 'Bénin',
      city: 'Porto-Novo',
      phone: '+22997445566',
      whatsappNumber: '+22997445566',
      category: 'Chaussures & Sneakers',
      plan: 'PRO',
      isDemo: true,
      primaryColor: '#7C3AED',
    },
    {
      vendorId: vendor3.id,
      name: 'Ayélé Bio',
      slug: 'ayele-bio',
      description: 'Saveurs et bienfaits des terroirs béninois : miels sauvages des collines de Dassa, farines nutritives locales, kinkeliba parfumé, jus naturels pressés sans sucre ajouté et tisanes bien-être.',
      logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
      country: 'Bénin',
      city: 'Abomey-Calavi',
      phone: '+22997556677',
      whatsappNumber: '+22997556677',
      category: 'Épicerie Fine & Bio',
      plan: 'FREE',
      isDemo: true,
      primaryColor: '#16A34A',
    },
    {
      vendorId: vendor3.id,
      name: 'Sènan Cuisine',
      slug: 'senan-cuisine',
      description: 'Les secrets de la cuisine traditionnelle béninoise livrés chez vous : moutarde afitin parfumée, épices pimentées du terroir, huile rouge de palme purifiée et ustensiles traditionnels en terre cuite.',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      country: 'Bénin',
      city: 'Cotonou',
      phone: '+22997667788',
      whatsappNumber: '+22997667788',
      category: 'Alimentation & Cuisine',
      plan: 'PRO',
      isDemo: true,
      primaryColor: '#DC2626',
    },
    {
      vendorId: demoVendor.id,
      name: 'Bio Market Parakou',
      slug: 'bio-market-parakou',
      description: 'Pôle agroalimentaire du Grand Nord béninois. Céréales locales, tubercules séchés, noix de cajou grillées croustillantes et beurre de karité certifié pour la consommation et la cosmétique.',
      logoUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
      country: 'Bénin',
      city: 'Parakou',
      phone: '+22997778899',
      whatsappNumber: '+22997778899',
      category: 'Terroir & Céréales',
      plan: 'PRO',
      isDemo: true,
      primaryColor: '#CA8A04',
    },
    {
      vendorId: vendor2.id,
      name: 'Tech Porto-Novo',
      slug: 'tech-porto-novo',
      description: 'Objets connectés, montres intelligentes avec suivi santé, projecteurs nomades, claviers rétroéclairés et chargeurs rapides USB-C. Garantie réparation et service après-vente dédié à Porto-Novo.',
      logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80',
      country: 'Bénin',
      city: 'Porto-Novo',
      phone: '+22997889900',
      whatsappNumber: '+22997889900',
      category: 'Gadgets & Accessoires',
      plan: 'PRO',
      isDemo: true,
      primaryColor: '#2563EB',
    },
  ];

  const createdShops = [];
  for (const s of shopsData) {
    const shop = await prisma.shop.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
    createdShops.push(shop);
  }
  console.log('✅ 8 Boutiques béninoises initialisées');

  // 5. ZONES DE LIVRAISON (BÉNIN COMPLET)
  const shippingZonesData = [
    { name: 'Cotonou - Akpakpa & Environs', city: 'Cotonou', district: 'Akpakpa', feeXOF: 1000, freeShippingThresholdXOF: 25000 },
    { name: 'Cotonou - Cadjehoun & Haie Vive', city: 'Cotonou', district: 'Cadjehoun', feeXOF: 1000, freeShippingThresholdXOF: 25000 },
    { name: 'Cotonou - Fidjrossè & Aéroport', city: 'Cotonou', district: 'Fidjrossè', feeXOF: 1500, freeShippingThresholdXOF: 30000 },
    { name: 'Cotonou - Gbégamey & Saint-Michel', city: 'Cotonou', district: 'Gbégamey', feeXOF: 1000, freeShippingThresholdXOF: 25000 },
    { name: 'Cotonou - Sainte-Rita & Maro-Militaire', city: 'Cotonou', district: 'Sainte-Rita', feeXOF: 1000, freeShippingThresholdXOF: 25000 },
    { name: 'Cotonou - Agla & Vêdoko', city: 'Cotonou', district: 'Agla', feeXOF: 1500, freeShippingThresholdXOF: 30000 },
    { name: 'Abomey-Calavi - Centre & Université', city: 'Abomey-Calavi', district: 'Campus UAC', feeXOF: 2000, freeShippingThresholdXOF: 35000 },
    { name: 'Abomey-Calavi - Godomey & Tankpè', city: 'Abomey-Calavi', district: 'Godomey', feeXOF: 1800, freeShippingThresholdXOF: 35000 },
    { name: 'Porto-Novo - Centre-Ville & Ouando', city: 'Porto-Novo', district: 'Ouando', feeXOF: 2500, freeShippingThresholdXOF: 40000 },
    { name: 'Ouidah - Centre & Plage', city: 'Ouidah', district: 'Centre', feeXOF: 3000, freeShippingThresholdXOF: 50000 },
    { name: 'Bohicon & Abomey', city: 'Bohicon', district: 'Gare', feeXOF: 3500, freeShippingThresholdXOF: 60000 },
    { name: 'Parakou - Centre-Ville', city: 'Parakou', district: 'Titirou', feeXOF: 4500, freeShippingThresholdXOF: 70000 },
    { name: 'Natitingou & Djougou', city: 'Natitingou', district: 'Centre', feeXOF: 5000, freeShippingThresholdXOF: 80000 },
    { name: 'Kandi & Malanville (Nord)', city: 'Kandi', district: 'Centre', feeXOF: 6000, freeShippingThresholdXOF: 100000 },
    { name: 'Sous-région (Lomé, Togo)', city: 'Lomé', district: 'Centre', feeXOF: 8000, freeShippingThresholdXOF: 120000 },
    { name: 'Sous-région (Lagos, Nigeria)', city: 'Lagos', district: 'Ikeja', feeXOF: 10000, freeShippingThresholdXOF: 150000 },
  ];

  await prisma.shippingZone.deleteMany({});
  for (const z of shippingZonesData) {
    await prisma.shippingZone.create({
      data: {
        ...z,
        active: true,
      },
    });
  }
  console.log('✅ Zones de livraison Bénin & sous-région créées');

  // 6. PRODUITS DÉMO (40+ PRODUITS RÉALISTES)
  const productsSeed = [
    // Boutique 1 : Wax & Style Cotonou
    {
      shopSlug: 'wax-style-cotonou',
      name: 'Robe Évasée Wax Royal Hollandais "Adjovi"',
      slug: 'robe-evasee-wax-royal-adjovi',
      shortCode: 'wAx001',
      description: 'Sublime robe évasée confectionnée à la main dans un authentique tissu Wax hollandais aux motifs floraux dorés et bleus profonds. Coupe cintrée soulignant la silhouette avec élégance, col bateau raffiné et poches invisibles latérales. Idéale pour les réceptions formelles, mariages et sorties prestigieuses sous le soleil béninois. Matière 100% coton peigné respirant ne déteignant pas au lavage.',
      priceXOF: 24500,
      compareAtPriceXOF: 32000,
      stock: 18,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Taille M / Bleu Royal', priceXOF: 24500, stock: 6 },
        { name: 'Taille L / Bleu Royal', priceXOF: 24500, stock: 7 },
        { name: 'Taille XL / Bleu Royal', priceXOF: 24500, stock: 5 },
      ],
    },
    {
      shopSlug: 'wax-style-cotonou',
      name: 'Chemise Homme Agbada Moderne "Dossou"',
      slug: 'chemise-homme-agbada-moderne-dossou',
      shortCode: 'wAx002',
      description: 'L’élégance masculine béninoise réinventée : chemise tunique coupe contemporaine avec broderie discrète ton sur ton au col et aux poignets. Tissu coton lourd de première qualité garantissant une tenue impeccable lors de vos réunions professionnelles ou cérémonies dominicales. Finition coutures renforcées et boutons de nacre travaillés.',
      priceXOF: 18500,
      compareAtPriceXOF: 24000,
      stock: 14,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Taille L / Blanc & Or', priceXOF: 18500, stock: 8 },
        { name: 'Taille XL / Blanc & Or', priceXOF: 18500, stock: 6 },
      ],
    },
    {
      shopSlug: 'wax-style-cotonou',
      name: 'Ensemble Tailleur Jupe Wax "Sènan"',
      slug: 'ensemble-tailleur-jupe-wax-senan',
      shortCode: 'wAx003',
      description: 'Ensemble veste cintrée et jupe crayon en imprimé wax géométrique turquoise et chocolat. Conçu spécialement pour la femme active et ambitieuse, cet ensemble allie professionnalisme et fierté culturelle africaine avec un confort absolu tout au long de la journée.',
      priceXOF: 29000,
      compareAtPriceXOF: 38000,
      stock: 10,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Taille 38 / Turquoise', priceXOF: 29000, stock: 4 },
        { name: 'Taille 40 / Turquoise', priceXOF: 29000, stock: 6 },
      ],
    },
    {
      shopSlug: 'wax-style-cotonou',
      name: 'Sac à Main Cabas Wax & Cuir Artisanal',
      slug: 'sac-cabas-wax-cuir-artisanal',
      shortCode: 'wAx004',
      description: 'Pièce artisanale confectionnée à Cotonou associant cuir véritable tanné végétal et tissu wax protecteur imperméabilisé. Intérieur spacieux avec doublure satinée, compartiment zippé sécurisé pour smartphone et pochette pour vos clés. Robuste et ultra-tendance.',
      priceXOF: 16000,
      compareAtPriceXOF: 22000,
      stock: 12,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'wax-style-cotonou',
      name: 'Turban foulard pré-noué "Ayélé"',
      slug: 'turban-foulard-pre-noue-ayele',
      shortCode: 'wAx005',
      description: 'Gagnez du temps le matin tout en restant impeccable : notre turban pré-noué prêt à poser en 5 secondes grâce à son élastique doux anti-migraine. Tissu wax souple et doublure satin protectrice pour vos cheveux naturels et tresses.',
      priceXOF: 5500,
      compareAtPriceXOF: 7500,
      stock: 30,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // Boutique 2 : Adjovi Beauty
    {
      shopSlug: 'adjovi-beauty',
      name: 'Beurre de Karité Brut de Natitingou (Pot 500g)',
      slug: 'beurre-karite-brut-natitingou-500g',
      shortCode: 'bEa001',
      description: 'Véritable or blanc du Nord Bénin : beurre de karité pur non raffiné, pressé à froid par les groupements féminins de Natitingou. Texture onctueuse naturellement riche en vitamines A, E et F. Nourrit intensément les peaux sèches, apaise les tiraillements, prévient les vergetures et revitalise les cheveux cassants.',
      priceXOF: 4500,
      compareAtPriceXOF: 6000,
      stock: 45,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1608248597359-009279140a6b?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Pot 250g', priceXOF: 2500, stock: 20 },
        { name: 'Pot 500g', priceXOF: 4500, stock: 25 },
      ],
    },
    {
      shopSlug: 'adjovi-beauty',
      name: 'Sérum Éclat Visage Huile de Baobab & Moringa (50ml)',
      slug: 'serum-eclat-huile-baobab-moringa',
      shortCode: 'bEa002',
      description: 'Élixir végétal anti-taches et éclat formulé à base d’huile de graines de baobab bio et d’extrait de moringa récolté au Bénin. Pénètre rapidement sans film gras. Unifie le teint, réduit les taches pigmentaires et protège contre les agressions de la pollution urbaine.',
      priceXOF: 8500,
      compareAtPriceXOF: 11000,
      stock: 22,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'adjovi-beauty',
      name: 'Savon Noir Africain Artisanal à l’Aloé Vera (Lot de 3)',
      slug: 'savon-noir-africain-aloe-vera-lot-3',
      shortCode: 'bEa003',
      description: 'Savon traditionnel clarifiant saponifié à froid avec des cendres de peaux de bananes plantains, de l’huile de coco vierge et du gel frais d’aloé vera cultivé localement. Nettoie en profondeur les impuretés et combat l’acné sans assécher l’épiderme.',
      priceXOF: 3500,
      compareAtPriceXOF: 4500,
      stock: 60,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1607006314144-8cb389657b0e?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'adjovi-beauty',
      name: 'Chantilly de Karité Parfum Vanille & Coco (200ml)',
      slug: 'chantilly-karite-vanille-coco-200ml',
      shortCode: 'bEa004',
      description: 'Une texture aérienne divine qui fond instantanément au contact de la peau. Fouettée avec amour avec de l’huile d’amande douce et parfumée délicatement aux extraits naturels de vanille de Madagascar. Votre peau retrouve douceur de velours et parfum subtil.',
      priceXOF: 5000,
      compareAtPriceXOF: 6500,
      stock: 19,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'adjovi-beauty',
      name: 'Bain d’Huiles Fortifiant Capillaire Pousse Rapide (100ml)',
      slug: 'bain-huiles-fortifiant-capillaire-100ml',
      shortCode: 'bEa005',
      description: 'Synergie de 7 huiles africaines stimulantes dont le ricin noir, le neem et le fenugrec. Stimule la microcirculation du cuir chevelu, stoppe la chute des cheveux, accélère la pousse et fortifie la fibre capillaire dès les premières semaines.',
      priceXOF: 6500,
      compareAtPriceXOF: 8500,
      stock: 28,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // Boutique 3 : Dossou Électro
    {
      shopSlug: 'dossou-electro',
      name: 'Powerbank Solaire Haute Capacité 30 000 mAh avec Torche',
      slug: 'powerbank-solaire-30000mah-torche',
      shortCode: 'eLc001',
      description: 'L’accessoire indispensable pour ne plus jamais manquer de batterie en déplacement ou lors des coupures d’électricité. Capacité réelle de 30 000 mAh permettant de recharger un smartphone 7 à 8 fois. Panneau solaire d’appoint, 4 ports USB avec charge ultra-rapide 22.5W et puissante torche LED de secours intégrée.',
      priceXOF: 18500,
      compareAtPriceXOF: 25000,
      stock: 35,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1609592426867-0c7f12e8bfa5?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Noir Carbone', priceXOF: 18500, stock: 20 },
        { name: 'Bleu Métal', priceXOF: 18500, stock: 15 },
      ],
    },
    {
      shopSlug: 'dossou-electro',
      name: 'Écouteurs Sans Fil Bluetooth 5.3 avec Réduction de Bruit',
      slug: 'ecouteurs-sans-fil-bluetooth-53-reduc-bruit',
      shortCode: 'eLc002',
      description: 'Plongez dans votre musique préférée ou gérez vos appels WhatsApp dans le calme absolu. Écouteurs intra-auriculaires ergonomiques avec son stéréo Hi-Fi immersif, basses profondes et boîtier indicateur LED d’autonomie. Jusqu’à 32 heures d’écoute avec le boîtier.',
      priceXOF: 12000,
      compareAtPriceXOF: 17000,
      stock: 40,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'dossou-electro',
      name: 'Montre Connectée Fitness & Santé AMOLED avec Appels Bluetooth',
      slug: 'montre-connectee-fitness-sante-amoled',
      shortCode: 'eLc003',
      description: 'Surveillez votre rythme cardiaque, votre tension, votre sommeil et répondez directement à vos appels sans sortir votre téléphone. Écran AMOLED ultra-lumineux même sous le soleil de midi, étanchéité IP68 et plus de 100 modes sportifs.',
      priceXOF: 22000,
      compareAtPriceXOF: 30000,
      stock: 15,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Bracelet Silicone Noir', priceXOF: 22000, stock: 8 },
        { name: 'Bracelet Cuir Marron', priceXOF: 23500, stock: 7 },
      ],
    },
    {
      shopSlug: 'dossou-electro',
      name: 'Mini Enceinte Bluetooth Étanche Bass Boost 15W',
      slug: 'mini-enceinte-bluetooth-etanche-15w',
      shortCode: 'eLc004',
      description: 'Diffusez une ambiance festive partout : à la plage de Fidjrossè ou au salon. Son à 360 degrés puissant et clair, résistance aux éclaboussures et autonomie continue de 12 heures.',
      priceXOF: 14000,
      compareAtPriceXOF: 19000,
      stock: 25,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'dossou-electro',
      name: 'Kit Éclairage Ring Light 12 pouces avec Trépied Réglable 2m',
      slug: 'kit-ring-light-12-pouces-trepied-2m',
      shortCode: 'eLc005',
      description: 'Le matériel indispensable pour les créateurs de contenu TikTok, vidéos promotionnelles WhatsApp et séances photos produits. 3 teintes de lumière (chaude, neutre, froide) avec 10 niveaux d’intensité et support universel pour smartphone rotatif 360°.',
      priceXOF: 15000,
      compareAtPriceXOF: 20000,
      stock: 18,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // Boutique 4 : Koffi Sneakers
    {
      shopSlug: 'koffi-sneakers',
      name: 'Baskets Urbaines Air Street "Cotonou Edition"',
      slug: 'baskets-air-street-cotonou-edition',
      shortCode: 'snK001',
      description: 'L’équilibre parfait entre style contemporain et confort maximal pour vos journées actives. Semelle amortissante à bulles d’air réduisant la fatigue, tige en mesh respirant adaptée aux températures tropicales et design exclusif qui attire tous les regards.',
      priceXOF: 28000,
      compareAtPriceXOF: 38000,
      stock: 20,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Pointure 41 / Rouge & Noir', priceXOF: 28000, stock: 5 },
        { name: 'Pointure 42 / Rouge & Noir', priceXOF: 28000, stock: 7 },
        { name: 'Pointure 43 / Rouge & Noir', priceXOF: 28000, stock: 5 },
        { name: 'Pointure 44 / Rouge & Noir', priceXOF: 28000, stock: 3 },
      ],
    },
    {
      shopSlug: 'koffi-sneakers',
      name: 'Sneakers Blanches Minimalistes Classic Leather',
      slug: 'sneakers-blanches-minimalistes-classic-leather',
      shortCode: 'snK002',
      description: 'L’intemporelle basket blanche qui s’accorde avec tout : jean brut, pantalon chino ou tenue traditionnelle décontractée. Cuir synthétique haute densité facile à nettoyer, semelle cousue résistante et semelle intérieure à mémoire de forme.',
      priceXOF: 22000,
      compareAtPriceXOF: 29000,
      stock: 25,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Pointure 41 / Blanc Pur', priceXOF: 22000, stock: 8 },
        { name: 'Pointure 42 / Blanc Pur', priceXOF: 22000, stock: 9 },
        { name: 'Pointure 43 / Blanc Pur', priceXOF: 22000, stock: 8 },
      ],
    },
    {
      shopSlug: 'koffi-sneakers',
      name: 'Chaussures Mocassins en Cuir Véritable pour Homme',
      slug: 'mocassins-cuir-veritable-homme',
      shortCode: 'snK003',
      description: 'Élégance discrète et confort royal : mocassins cousus main en cuir italien souple avec pompons décoratifs. Semelle en gomme antidérapante parfaite pour les cérémonies et réceptions d’affaires.',
      priceXOF: 35000,
      compareAtPriceXOF: 48000,
      stock: 12,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Pointure 42 / Marron Havane', priceXOF: 35000, stock: 6 },
        { name: 'Pointure 43 / Marron Havane', priceXOF: 35000, stock: 6 },
      ],
    },
    {
      shopSlug: 'koffi-sneakers',
      name: 'Sandales Confort Cuir Nubuck Homme',
      slug: 'sandales-confort-cuir-nubuck-homme',
      shortCode: 'snK004',
      description: 'L’allié idéal des journées chaudes : sandales en cuir suédé avec brides ajustables et voûte plantaire orthopédique enveloppante. Résistance et style authentique.',
      priceXOF: 15000,
      compareAtPriceXOF: 20000,
      stock: 16,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'koffi-sneakers',
      name: 'Baskets Running Trail Ultra-Légères',
      slug: 'baskets-running-trail-ultra-legeres',
      shortCode: 'snK005',
      description: 'Conçues pour la performance sportive : adhérence tout-terrain sur pistes et goudron, amorti souple et tissu anti-transpiration.',
      priceXOF: 26000,
      compareAtPriceXOF: 34000,
      stock: 14,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // Boutique 5 : Ayélé Bio
    {
      shopSlug: 'ayele-bio',
      name: 'Miel Pur Sauvage des Collines de Dassa (Bocal 1 Kg)',
      slug: 'miel-pur-sauvage-dassa-1kg',
      shortCode: 'bIo001',
      description: 'Un trésor liquide récolté dans les forêts préservées des collines de Dassa-Zoumè. Miel non chauffé, non pasteurisé, gorgé d’antioxydants naturels et de pollen floral bienfaisant. Saveur boisée et ambrée incomparable.',
      priceXOF: 6000,
      compareAtPriceXOF: 8000,
      stock: 50,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [
        { name: 'Bocal 500g', priceXOF: 3500, stock: 20 },
        { name: 'Bocal 1 Kg', priceXOF: 6000, stock: 30 },
      ],
    },
    {
      shopSlug: 'ayele-bio',
      name: 'Farine Enrichie Bébé & Famille aux Céréales Locales (Sachet 1kg)',
      slug: 'farine-enrichie-cereales-locales-1kg',
      shortCode: 'bIo002',
      description: 'Mélange savamment dosé de maïs jaune, soja torréfié, sorgho rouge et poudre de moringa. Richesse exceptionnelle en fer et protéines pour la croissance harmonieuse des enfants et l’énergie des sportifs.',
      priceXOF: 3000,
      compareAtPriceXOF: 4000,
      stock: 40,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'ayele-bio',
      name: 'Feuilles de Kinkeliba Séchées Bio (Paquet 250g)',
      slug: 'feuilles-kinkeliba-sechees-bio-250g',
      shortCode: 'bIo003',
      description: 'Plante bienfaisante traditionnelle de longue vie d’Afrique de l’Ouest. Tisane digestive et détoxifiante du foie, à déguster chaude ou glacée avec une touche de citron frais et de miel.',
      priceXOF: 2500,
      compareAtPriceXOF: 3500,
      stock: 50,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'ayele-bio',
      name: 'Noix de Cajou Grillées sans Sel du Bénin (Sachet 500g)',
      slug: 'noix-cajou-grillees-sans-sel-benin-500g',
      shortCode: 'bIo004',
      description: 'Le meilleur anacarde du monde récolté et transformé au Bénin. Calibre géant croquant à souhait, sans conservateur ni sel ajouté pour préserver votre santé cardiovasculaire.',
      priceXOF: 4500,
      compareAtPriceXOF: 6000,
      stock: 35,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1536591375315-1b8368212458?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'ayele-bio',
      name: 'Poudre Pure de Moringa Bio (Pot 200g)',
      slug: 'poudre-pure-moringa-bio-200g',
      shortCode: 'bIo005',
      description: 'Le super-aliment africain par excellence : concentré de vitamines, calcium et antioxydants. Saupoudrez une cuillère à café dans vos bouillies, jus ou sauces pour revitaliser votre organisme.',
      priceXOF: 3500,
      compareAtPriceXOF: 4500,
      stock: 45,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // Boutique 6 : Sènan Cuisine
    {
      shopSlug: 'senan-cuisine',
      name: 'Afitin Traditionnel Épicé du Terroir (Lot de 5 Boules)',
      slug: 'afitin-traditionnel-epice-lot-5',
      shortCode: 'cuI001',
      description: 'Le secret des sauces savoureuses béninoises : graines de néré fermentées selon la méthode ancestrale sans additif chimique. Apporte un arôme profond et authentique à vos sauces graines, gboma et crincrin.',
      priceXOF: 2500,
      compareAtPriceXOF: 3500,
      stock: 50,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'senan-cuisine',
      name: 'Huile Rouge de Palme Pure Non Chauffée (Bouteille 1.5L)',
      slug: 'huile-rouge-palme-pure-1-5l',
      shortCode: 'cuI002',
      description: 'Huile de palme artisanale vierge issue des palmeraies de la Vallée de l’Ouémé. Riche en bêtacarotène et vitamine E, indispensable pour sublimer le goût de vos plats de haricots atassi et poissons braisés.',
      priceXOF: 3200,
      compareAtPriceXOF: 4200,
      stock: 30,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'senan-cuisine',
      name: 'Piment Rouge Concassé "Kpédjiléhoué" Extra Fort (Bocal 250g)',
      slug: 'piment-rouge-concasse-extra-fort-250g',
      shortCode: 'cuI003',
      description: 'Pour les amateurs de sensations fortes : piment du terroir séché et concassé avec graines d’anis et gingembre séché. Un parfum explosif pour relever toutes vos viandes et marinades.',
      priceXOF: 2800,
      compareAtPriceXOF: 3500,
      stock: 35,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'senan-cuisine',
      name: 'Mortier et Pilon Artisanal en Bois d’Iroko Massif',
      slug: 'mortier-pilon-bois-iroko-massif',
      shortCode: 'cuI004',
      description: 'L’ustensile noble des cuisines familiales : sculpté d’une seule pièce dans du bois d’iroko imputrescible. Parfait pour piler ail, piments, épices ou préparer le succulent igname pilé (Agoun).',
      priceXOF: 18000,
      compareAtPriceXOF: 24000,
      stock: 10,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'senan-cuisine',
      name: 'Crevettes Séchées Calibre Royal de Grand-Popo (Sachet 300g)',
      slug: 'crevettes-sechees-grand-popo-300g',
      shortCode: 'cuI005',
      description: 'Pêchées dans le lac Ahémé et séchées naturellement au soleil sur des nattes traditionnelles. Parfum marin puissant pour relever vos sauces légumes et soupes.',
      priceXOF: 4500,
      compareAtPriceXOF: 6000,
      stock: 25,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // Boutique 7 : Bio Market Parakou
    {
      shopSlug: 'bio-market-parakou',
      name: 'Fonio Blanc Précuit du Borgou (Sac 2 Kg)',
      slug: 'fonio-blanc-precuit-borgou-2kg',
      shortCode: 'pAr001',
      description: 'La céréale sans gluten ancestrale d’Afrique : digestion ultra-légère et indice glycémique bas, idéal pour les personnes diabétiques. Déjà lavé et précuit, prêt en 5 minutes à la vapeur.',
      priceXOF: 4800,
      compareAtPriceXOF: 6500,
      stock: 40,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'bio-market-parakou',
      name: 'Gari Sohoui Croustillant Première Qualité (Sac 5 Kg)',
      slug: 'gari-sohoui-croustillant-5kg',
      shortCode: 'pAr002',
      description: 'Gari blanc tamisé finement, torréfié à point avec ce petit goût acidulé tant recherché. Parfait pour les dégustations glacées avec arachides ou en pâte consistante (Eba).',
      priceXOF: 4500,
      compareAtPriceXOF: 5500,
      stock: 60,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'bio-market-parakou',
      name: 'Beurre de Karité Qualité Alimentaire Pur (Seau 2 Kg)',
      slug: 'beurre-karite-alimentaire-pur-2kg',
      shortCode: 'pAr003',
      description: 'Karité désodorisé traditionnellement pour la cuisson saine sans cholestérol. Remplace avantageusement les huiles industrielles dans vos pâtisseries et fritures traditionnelles.',
      priceXOF: 11000,
      compareAtPriceXOF: 14000,
      stock: 20,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1608248597359-009279140a6b?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'bio-market-parakou',
      name: 'Ignames Séchées en Tranches pour Amala (Sac 3 Kg)',
      slug: 'ignames-sechees-tranches-amala-3kg',
      shortCode: 'pAr004',
      description: 'Tranches d’igname pure de Savè séchées au soleil. À moudre pour obtenir la farine noire authentique pour préparer la fameuse pâte d’amala avec sauce gombo.',
      priceXOF: 5500,
      compareAtPriceXOF: 7000,
      stock: 25,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'bio-market-parakou',
      name: 'Gingembre Sauvage Séché en Morceaux (Sachet 500g)',
      slug: 'gingembre-sauvage-seche-500g',
      shortCode: 'pAr005',
      description: 'Gingembre puissant cultivé dans le terroir septentrional. Idéal pour réaliser votre jus de dji (Gnamankoudji) maison tonique et digestif.',
      priceXOF: 3000,
      compareAtPriceXOF: 4000,
      stock: 35,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },

    // Boutique 8 : Tech Porto-Novo
    {
      shopSlug: 'tech-porto-novo',
      name: 'Rétroprojecteur Vidéo Nomade HD 1080p avec Wi-Fi & Android',
      slug: 'retroprojecteur-nomade-hd-wifi-android',
      shortCode: 'tEc001',
      description: 'Transformez votre salon ou cour en véritable cinéma en plein air ! Projecteur compact avec système Android intégré : regardez Netflix, YouTube et vos matchs de football directement sur un mur jusqu’à 3 mètres de diagonale. Haut-parleur stéréo et télécommande inclus.',
      priceXOF: 49000,
      compareAtPriceXOF: 68000,
      stock: 12,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'tech-porto-novo',
      name: 'Clavier Sans Fil Rechargeable avec Pavé Tactile Multi-Devices',
      slug: 'clavier-sans-fil-pave-tactile-multi-devices',
      shortCode: 'tEc002',
      description: 'Connectez simultanément votre Smart TV, votre ordinateur portable et votre tablette. Touches silencieuses et pavé tactile fluide réactif.',
      priceXOF: 16500,
      compareAtPriceXOF: 22000,
      stock: 15,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'tech-porto-novo',
      name: 'Chargeur Rapide 65W GaN USB-C 3 Ports pour PC et Smartphones',
      slug: 'chargeur-rapide-65w-gan-usbc-3ports',
      shortCode: 'tEc003',
      description: 'La technologie Nitrure de Gallium (GaN) concentre une puissance phénoménale dans un format de poche. Rechargez votre MacBook ou PC portable et deux téléphones en même temps à vitesse maximale.',
      priceXOF: 14500,
      compareAtPriceXOF: 19000,
      stock: 25,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'tech-porto-novo',
      name: 'Trépied Professionnel pour Smartphone avec Détecteur de Mouvement AI',
      slug: 'trepied-smartphone-suivi-mouvement-ia',
      shortCode: 'tEc004',
      description: 'Support intelligent motorisé 360° qui suit automatiquement votre visage pendant vos vidéos en direct et cours en ligne sans aucune application nécessaire.',
      priceXOF: 21000,
      compareAtPriceXOF: 28000,
      stock: 10,
      status: ProductStatus.ACTIVE,
      isPromo: true,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
    {
      shopSlug: 'tech-porto-novo',
      name: 'Disque Dur Externe Anti-Choc 1 To USB 3.2 Haute Vitesse',
      slug: 'disque-dur-externe-antichoc-1to-usb32',
      shortCode: 'tEc005',
      description: 'Protégez vos photos de famille, vidéos et dossiers d’entreprise contre les chutes et la poussière grâce à sa coque en silicone militaire renforcée. Transferts ultra-rapides.',
      priceXOF: 36000,
      compareAtPriceXOF: 45000,
      stock: 14,
      status: ProductStatus.ACTIVE,
      isPromo: false,
      images: [
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
      ],
      variants: [],
    },
  ];

  const createdProducts = [];
  for (const p of productsSeed) {
    const shop = createdShops.find((s) => s.slug === p.shopSlug);
    if (!shop) continue;

    const product = await prisma.product.create({
      data: {
        shopId: shop.id,
        name: p.name,
        slug: p.slug,
        shortCode: p.shortCode,
        description: p.description,
        priceXOF: p.priceXOF,
        compareAtPriceXOF: p.compareAtPriceXOF,
        stock: p.stock,
        status: p.status,
        isPromo: p.isPromo,
        isDemo: true,
        images: {
          create: p.images.map((url, idx) => ({
            url,
            altText: `${p.name} - Vue ${idx + 1}`,
            order: idx,
          })),
        },
        variants: {
          create: p.variants.map((v) => ({
            name: v.name,
            priceXOF: v.priceXOF,
            stock: v.stock,
          })),
        },
        links: {
          create: [
            {
              slug: p.slug,
              shortCode: p.shortCode,
              utmSource: 'facebook',
              utmMedium: 'cpc',
              utmCampaign: 'promo_lancement',
              clicksCount: Math.floor(Math.random() * 250) + 50,
              ordersCount: Math.floor(Math.random() * 25) + 3,
            },
            {
              slug: `${p.slug}-tiktok`,
              shortCode: `${p.shortCode}t`,
              utmSource: 'tiktok',
              utmMedium: 'bio',
              utmCampaign: 'influenceurs_cotonou',
              clicksCount: Math.floor(Math.random() * 400) + 80,
              ordersCount: Math.floor(Math.random() * 35) + 5,
            },
          ],
        },
      },
    });
    createdProducts.push(product);
  }
  console.log(`✅ ${createdProducts.length} Produits réalistes avec images & liens pub créés`);

  // 7. CLIENTS DÉMO (30+ NOMS BÉNINOIS)
  const customersData = [
    { fullName: 'Adjovi Dossou', phone: '+22997101010', city: 'Cotonou', district: 'Akpakpa', address: 'Rue Pavée Sainte-Cécile' },
    { fullName: 'Koffi Akplogan', phone: '+22997202020', city: 'Porto-Novo', district: 'Ouando', address: 'Face Pharmacie Ouando' },
    { fullName: 'Akossiwa Mensah', phone: '+22997303030', city: 'Cotonou', district: 'Fidjrossè', address: 'Carrefour Club des Rois' },
    { fullName: 'Sènan Hounkpatin', phone: '+22997404040', city: 'Abomey-Calavi', district: 'Godomey', address: 'Maison Hounkpatin' },
    { fullName: 'Bio Chabi', phone: '+22997505050', city: 'Parakou', district: 'Titirou', address: 'Carrefour Papini' },
    { fullName: 'Ayélé Gbaguidi', phone: '+22997606060', city: 'Cotonou', district: 'Cadjehoun', address: 'Près de l’Ambassade de France' },
    { fullName: 'Yaovi Agbodjan', phone: '+22997707070', city: 'Ouidah', district: 'Centre', address: 'Place Chacha' },
    { fullName: 'Afi Tossou', phone: '+22997808080', city: 'Bohicon', district: 'Gare', address: 'Quartier Houndjro' },
    { fullName: 'Kossi Agossou', phone: '+22997909090', city: 'Cotonou', district: 'Gbégamey', address: 'Derrière Collège Notre Dame' },
    { fullName: 'Nadège Zinsou', phone: '+22996112233', city: 'Cotonou', district: 'Sainte-Rita', address: 'Marché Maro-Militaire' },
    { fullName: 'Fadil Mama', phone: '+22996223344', city: 'Djougou', district: 'Taïfa', address: 'Grande Voie' },
    { fullName: 'Rachidath Bio Guéra', phone: '+22996334455', city: 'Parakou', district: 'Albarika', address: 'Cité Universitaire' },
    { fullName: 'Gaston Houndété', phone: '+22996445566', city: 'Abomey-Calavi', district: 'Arconville', address: 'Près de la Mairie' },
    { fullName: 'Blandine Alapini', phone: '+22996556677', city: 'Cotonou', district: 'Agla', address: 'Les Pylônes' },
    { fullName: 'Rodrigue Soglo', phone: '+22996667788', city: 'Cotonou', district: 'Haie Vive', address: 'Rue des Cocotiers' },
    { fullName: 'Christelle Houngbédji', phone: '+22996778899', city: 'Porto-Novo', district: 'Dowa', address: 'Près du Stade' },
    { fullName: 'Marius Kpodékon', phone: '+22996889900', city: 'Natitingou', district: 'Urbain', address: 'Route de Porga' },
    { fullName: 'Clarisse Danhouan', phone: '+22995112233', city: 'Lokossa', district: 'Agnivédji', address: 'Carrefour Douane' },
    { fullName: 'Euloge Kéké', phone: '+22995223344', city: 'Savalou', district: 'Attakè', address: 'Au pied de la Colline' },
    { fullName: 'Hortense Vigan', phone: '+22995334455', city: 'Cotonou', district: 'Aïbatin', address: 'Vers Houéyiho' },
    { fullName: 'Romaric Quenum', phone: '+22995445566', city: 'Ouidah', district: 'Pahou', address: 'Carrefour Kpota' },
    { fullName: 'Pélagie Ahissou', phone: '+22995556677', city: 'Cotonou', district: 'Jéricho', address: 'Près de la Gare' },
    { fullName: 'Serge Agbo', phone: '+22995667788', city: 'Abomey-Calavi', district: 'Tankpè', address: 'Carrefour Tankpè' },
    { fullName: 'Faustine Adéchina', phone: '+22995778899', city: 'Kétou', district: 'Centre', address: 'Maison Royale' },
    { fullName: 'Théodore Bocco', phone: '+22995889900', city: 'Cotonou', district: 'Dédokpo', address: 'Akpakpa Dodomè' },
    { fullName: 'Bernadette Kiki', phone: '+22994112233', city: 'Porto-Novo', district: 'Avakpa', address: 'Face Lycée Toffa' },
    { fullName: 'Séverin Boko', phone: '+22994223344', city: 'Abomey', district: 'Hountondji', address: 'Palais Royal' },
    { fullName: 'Awa Cissé', phone: '+22994334455', city: 'Cotonou', district: 'Zongo', address: 'Rue de la Mosquée' },
    { fullName: 'Dieudonné Houssou', phone: '+22994445566', city: 'Parakou', district: 'Bannikanni', address: 'Voie Inter-États' },
    { fullName: 'Inès Tokpanou', phone: '+22994556677', city: 'Cotonou', district: 'Guinkomey', address: 'Derrière Dantokpa' },
  ];

  const createdCustomers = [];
  for (const c of customersData) {
    const cust = await prisma.customer.upsert({
      where: { phone: c.phone },
      update: c,
      create: {
        ...c,
        totalOrders: Math.floor(Math.random() * 5) + 1,
        totalSpentXOF: Math.floor(Math.random() * 90000) + 15000,
        preferredCurrency: 'XOF',
      },
    });
    createdCustomers.push(cust);

    // Membre de fidélité par téléphone
    await prisma.loyaltyMember.upsert({
      where: { phone: c.phone },
      update: {},
      create: {
        phone: c.phone,
        fullName: c.fullName,
        currentPoints: Math.floor(Math.random() * 2500) + 100,
        tier: Math.random() > 0.6 ? LoyaltyTier.OR : Math.random() > 0.3 ? LoyaltyTier.ARGENT : LoyaltyTier.BRONZE,
        totalSpentXOF: cust.totalSpentXOF,
      },
    });
  }
  console.log(`✅ ${createdCustomers.length} Clients & membres fidélité initialisés`);

  // 8. COMMANDES DÉMO (80+ COMMANDES RÉPARTIES SUR 3 MOIS)
  const statuses = [
    OrderStatus.DELIVERED_PAID,
    OrderStatus.DELIVERED_PAID,
    OrderStatus.DELIVERED_PAID,
    OrderStatus.CONFIRMED,
    OrderStatus.IN_DELIVERY,
    OrderStatus.NEW_TO_CALL,
    OrderStatus.CALLED_NEGOTIATING,
    OrderStatus.CANCELLED,
  ];

  let orderCount = 0;
  for (let i = 1; i <= 82; i++) {
    const customer = createdCustomers[i % createdCustomers.length];
    const product = createdProducts[i % createdProducts.length];
    const shop = createdShops.find((s) => s.id === product.shopId) || createdShops[0];
    const status = statuses[i % statuses.length];

    const quantity = (i % 3) + 1;
    const subtotal = product.priceXOF * quantity;
    const shipping = 1500;
    const total = subtotal + shipping;

    const orderNumber = `MHG-2025-${String(i).padStart(4, '0')}`;
    const daysAgo = Math.floor(Math.random() * 85);
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - daysAgo);

    await prisma.order.upsert({
      where: { orderNumber },
      update: {},
      create: {
        orderNumber,
        shopId: shop.id,
        status,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerEmail: `${customer.fullName.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
        city: customer.city || 'Cotonou',
        district: customer.district || 'Akpakpa',
        address: customer.address || 'Rue Pavée principale',
        landmark: 'Près de la pharmacie de garde',
        notes: i % 2 === 0 ? 'Paiement à la livraison par MTN Mobile Money si possible' : 'Appeler avant de passer svp',
        internalNotes: status === OrderStatus.DELIVERED_PAID ? 'Livré et payé sans incident.' : 'Client très courtois.',
        subtotalXOF: subtotal,
        shippingFeeXOF: shipping,
        loyaltyDiscountXOF: 0,
        promoDiscountXOF: 0,
        totalXOF: total,
        clientCurrency: 'XOF',
        exchangeRate: 1.0,
        totalClientCurrency: total,
        utmSource: i % 3 === 0 ? 'facebook' : i % 3 === 1 ? 'tiktok' : 'whatsapp',
        utmMedium: 'cpc',
        utmCampaign: 'promo_wax_2025',
        createdAt: orderDate,
        updatedAt: orderDate,
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              quantity,
              unitPriceXOF: product.priceXOF,
              unitPriceClient: product.priceXOF,
              totalPriceXOF: subtotal,
              totalPriceClient: subtotal,
              imageUrl:'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80',
            },
          ],
        },
        history: {
          create: [
            {
              status: OrderStatus.NEW_TO_CALL,
              note: 'Commande reçue en ligne en 30 secondes via pub',
              changedBy: 'Système',
              createdAt: orderDate,
            },
            ...(status !== OrderStatus.NEW_TO_CALL
              ? [
                  {
                    status: OrderStatus.CONFIRMED,
                    note: 'Client appelé sur WhatsApp, livraison validée',
                    changedBy: 'Vendeur',
                    createdAt: new Date(orderDate.getTime() + 1000 * 60 * 30),
                  },
                ]
              : []),
            ...(status === OrderStatus.DELIVERED_PAID
              ? [
                  {
                    status: OrderStatus.DELIVERED_PAID,
                    note: 'Colis livré en mains propres et espèces encaissées',
                    changedBy: 'Livreur Cotonou Express',
                    createdAt: new Date(orderDate.getTime() + 1000 * 60 * 60 * 24),
                  },
                ]
              : []),
          ],
        },
      },
    });
    orderCount++;
  }
  console.log(`✅ ${orderCount} Commandes démo créées avec historique et articles`);

  // 9. AVIS CLIENTS (150+ AVIS BÉNINOIS VARIÉS ET AUTHENTIQUES)
  const reviewComments = [
    { title: 'Très satisfaite de mon achat !', comment: 'Robe magnifique, le tissu wax est d’une qualité irréprochable. La vendeuse m’a appelée 10 minutes après ma commande pour confirmer la taille. Livraison rapide à Akpakpa.', rating: 5 },
    { title: 'Conforme à la description', comment: 'Livraison reçue le lendemain à Cadjehoun. Le livreur était très poli et le produit fonctionne à merveille. Je recommande sans hésiter !', rating: 5 },
    { title: 'Bonne qualité mais léger retard', comment: 'Le produit est impeccable et authentique. Seul petit bémol, le livreur a eu 45 minutes de retard à cause de la pluie à Cotonou, mais il a pris la peine de prévenir.', rating: 4 },
    { title: 'Service client au top !', comment: 'C’est tellement pratique de pouvoir commander sans créer de compte avec un mot de passe. Simple, rapide et le paiement à la livraison rassure énormément.', rating: 5 },
    { title: 'Produit 100% naturel', comment: 'L’odeur et la texture prouvent que c’est du vrai bio du Nord Bénin. Ma peau est hydratée et douce. Merci beaucoup pour le sérieux !', rating: 5 },
    { title: 'Parfait pour offrir', comment: 'J’ai commandé pour l’anniversaire de ma sœur à Calavi, elle était ravie. Très belle finition.', rating: 5 },
    { title: 'Très bon rapport qualité-prix', comment: 'Prix très correct par rapport au marché de Dantokpa et sans avoir besoin de se déplacer dans les bouchons. Je recommanderai assurément.', rating: 4 },
    { title: 'Livraison rapide à Porto-Novo', comment: 'Je ne pensais pas être livrée le jour même à Ouando. Très bonne surprise, colis bien emballé.', rating: 5 },
    { title: 'Excellent produit high-tech', comment: 'La batterie tient parfaitement la charge, indispensable lors des délestages. Vendeur sérieux.', rating: 5 },
    { title: 'Tissu wax de qualité supérieure', comment: 'Les couleurs ne déteignent pas du tout au lavage. Les coutures sont solides et soignées.', rating: 5 },
  ];

  let reviewCount = 0;
  for (let i = 0; i < 155; i++) {
    const cust = createdCustomers[i % createdCustomers.length];
    const prod = createdProducts[i % createdProducts.length];
    const sample = reviewComments[i % reviewComments.length];

    await prisma.review.create({
      data: {
        shopId: prod.shopId,
        productId: prod.id,
        authorName: cust.fullName,
        authorPhone: cust.phone,
        rating: sample.rating,
        title: sample.title,
        comment: sample.comment,
        isVerifiedPurchase: true,
        isAutoGenerated: i % 4 === 0,
        status: ReviewStatus.APPROVED,
        reply: i % 3 === 0 ? `Merci infiniment ${cust.fullName.split(' ')[0]} pour votre confiance ! À très bientôt sur MAHUGNON.` : null,
      },
    });
    reviewCount++;
  }
  console.log(`✅ ${reviewCount} Avis clients authentiques générés`);

  // 10. CODES PROMO (5 CODES RÉALISTES)
  const promoCodesData = [
    { code: 'BIENVENUE10', discountType: DiscountType.PERCENTAGE, discountValue: 10, minOrderAmountXOF: 10000, maxUses: 500 },
    { code: 'COTO2025', discountType: DiscountType.FIXED_XOF, discountValue: 5000, minOrderAmountXOF: 35000, maxUses: 200 },
    { code: 'LIVRAISON0', discountType: DiscountType.FIXED_XOF, discountValue: 1500, minOrderAmountXOF: 20000, maxUses: 300 },
    { code: 'WAXLOVE', discountType: DiscountType.PERCENTAGE, discountValue: 15, minOrderAmountXOF: 25000, maxUses: 150 },
    { code: 'TECHBJ', discountType: DiscountType.PERCENTAGE, discountValue: 5, minOrderAmountXOF: 15000, maxUses: 400 },
  ];

  for (const pc of promoCodesData) {
    await prisma.promoCode.upsert({
      where: { code: pc.code },
      update: pc,
      create: pc,
    });
  }
  console.log('✅ 5 Codes promotionnels créés');

  // 11. PARAMÈTRES & CONTENUS DE DÉMO (PREUVES SOCIALES & COMPTEURS)
  const settingsData = [
    {
      key: 'demo_stats',
      value: JSON.stringify({
        shopsCount: 847,
        ordersCount: 12450,
        gmvXOF: 12800000,
        citiesCount: 47,
        avgRating: 4.8,
        totalReviews: 1240,
      }),
      isDemo: true,
    },
    {
      key: 'demo_testimonials',
      value: JSON.stringify([
        {
          id: 1,
          name: 'Adjovi D.',
          role: 'Marchande de mode',
          city: 'Cotonou',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          text: 'Grâce à MAHUGNON, j’ai vendu mes robes wax à plus de 200 clientes en 3 mois. L’équipe est très réactive et les liens pubs m’ont vraiment aidée à me faire connaître sur Facebook.',
          isVendor: true,
        },
        {
          id: 2,
          name: 'Koffi A.',
          role: 'Client régulier',
          city: 'Porto-Novo',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          text: 'Je commande souvent sur MAHUGNON. C’est tellement simple : aucun mot de passe à retenir, on me rappelle toujours rapidement sur WhatsApp et la livraison est ultra fiable.',
          isVendor: false,
        },
        {
          id: 3,
          name: 'Ayélé B.',
          role: 'Marchande de cosmétiques',
          city: 'Abomey-Calavi',
          avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          text: 'Mon magasin de cosmétiques naturels a triplé son chiffre d’affaires depuis mon inscription. Le tableau de bord et la gestion des commandes par WhatsApp me font gagner un temps précieux.',
          isVendor: true,
        },
        {
          id: 4,
          name: 'Bio C.',
          role: 'Client',
          city: 'Parakou',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
          rating: 4.5,
          text: 'Même à Parakou, les colis arrivent en bon état. Le paiement à la livraison me rassure totalement. C’est la meilleure plateforme e-commerce au Bénin actuellement.',
          isVendor: false,
        },
        {
          id: 5,
          name: 'Sènan H.',
          role: 'Marchande d’épices locales',
          city: 'Cotonou',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          text: 'L’intégration des liens pub sur WhatsApp a boosté mes ventes du week-end. Les clients voient directement la photo, le prix et commandent sans hésitation.',
          isVendor: true,
        },
        {
          id: 6,
          name: 'Dossou M.',
          role: 'Commerçant High-Tech',
          city: 'Cotonou',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
          rating: 5,
          text: 'La gestion des stocks et les notifications de commande instantanées sont redoutables. Je gère mes livreurs facilement depuis mon smartphone.',
          isVendor: true,
        },
      ]),
      isDemo: true,
    },
    {
      key: 'demo_live_notifications',
      value: JSON.stringify([
        { id: 1, message: '🛍️ Adjovi de Cotonou vient de commander Robe Wax Royal' },
        { id: 2, message: '🏪 Koffi vient d’ouvrir sa boutique Sneakers Porto-Novo' },
        { id: 3, message: '⭐ Nadège a laissé un avis 5 étoiles sur Beurre de Karité' },
        { id: 4, message: '💰 Commande de 45 000 FCFA livrée à Parakou' },
        { id: 5, message: '🛍️ Bio de Calavi vient de commander Miel Sauvage Dassa' },
        { id: 6, message: '🚚 Nouvelle commande en cours d’expédition vers Akpakpa' },
      ]),
      isDemo: true,
    },
  ];

  for (const s of settingsData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }
  console.log('✅ Paramètres de démo, compteurs animés et preuves sociales enregistrés');

  console.log('\n🎉 SEED MAHUGNON TERMINÉ AVEC SUCCÈS !');
  console.log('----------------------------------------------------');
  console.log('👑 Super Admin : admin@mahugnon.com / Mahugnon2025!');
  console.log('🏪 Vendeur Démo : vendeur@mahugnon.com / Vendeur2025!');
  console.log('----------------------------------------------------\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
