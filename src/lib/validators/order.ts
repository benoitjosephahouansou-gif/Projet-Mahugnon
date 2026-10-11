import { z } from 'zod';

export const checkoutFormSchema = z.object({
  shopId: z.string().min(1, 'La boutique est requise'),
  customerName: z.string().min(2, 'Veuillez saisir votre nom complet'),
  customerPhone: z
    .string()
    .min(8, 'Le numéro WhatsApp est requis')
    .regex(/^(\+?[0-9\s-]{8,20})$/, 'Numéro de téléphone invalide'),
  secondaryPhone: z.string().optional().or(z.literal('')),
  customerEmail: z.string().email('Email invalide').optional().or(z.literal('')),
  city: z.string().min(2, 'Veuillez préciser votre ville'),
  district: z.string().min(2, 'Veuillez préciser votre quartier'),
  address: z.string().min(3, 'Veuillez décrire votre adresse de livraison'),
  landmark: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  promoCode: z.string().optional().or(z.literal('')),
  clientCurrency: z.string().default('XOF'),
  items: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        variantName: z.string().optional(),
        quantity: z.number().int().positive(),
        priceXOF: z.number().positive(),
        imageUrl: z.string().optional(),
      })
    )
    .min(1, 'Votre panier est vide'),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
