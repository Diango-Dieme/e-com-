// ============================================
// PAGES/ProductSheet.tsx
// Pôle : Page Produit Individuelle
// Inclut : Galerie, Spécs, Stock Local, Paiement Wave, Schema.org
// ============================================
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag, MapPin, Check, Shield, Truck, Star,
  Waves, Gauge, Wind, Droplets, Ruler, Battery, ChevronLeft,
  CreditCard, Smartphone
} from 'lucide-react';
import { useStore } from '../LOGIQUE/CartEngine';

// Interface pour les props de la page (dans un vrai projet, vient de Next.js)
interface ProductSheetProps {
  params: { id: string };
}

// Données mockées pour l'exemple
const PRODUCT_DETAIL = {
  id: '1',
  name: 'Planche Shortboard Pro 2024',
  brand: 'OceanRider',
  category: 'Surf',
  price: 450000,
  description: `Conçue pour les vagues puissantes de Cap Skirring, cette shortboard en époxy haute performance offre une réactivité exceptionnelle. Son shape précis permet des manoeuvres radicales tout en gardant une bonne portance.`,
  images: [
    'https://images.unsplash.com/photo-1605703562752-1cfe7b86bfac?w=800&auto=format',
    'https://images.unsplash.com/photo-1623126907902-3cd0e9fc5b3c?w=800&auto=format',
    'https://images.unsplash.com/photo-1582639388609-d3b6104f6ad4?w=800&auto=format',
  ],
  inStock: true,
  localPickup: true,
  stockQuantity: 3,
  specs: [
    { icon: <Ruler />, label: 'Longueur', value: '5\'10"' },
    { icon: <Gauge />, label: 'Volume', value: '28.5 L' },
    { icon: <Wind />, label: 'Type', value: 'Shortboard' },
    { icon: <Droplets />, label: 'Matériau', value: 'Époxy / Fibre de verre' },
    { icon: <Battery />, label: "Poids max surfeur", value: "85 kg" },
  ],
  features: [
    'Construction légère en époxy',
    'Dérives FCS II incluses',
    'Leash inclus',
    'Garantie 2 ans',
  ],
  rating: 4.8,
  reviews: 124,
};

export default function ProductSheet({ params }: ProductSheetProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useStore();

  // --- Données Structurées JSON-LD pour Google (SEO AGRESSIF) ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: PRODUCT_DETAIL.name,
    description: PRODUCT_DETAIL.description,
    image: PRODUCT_DETAIL.images,
    brand: {
      '@type': 'Brand',
      name: PRODUCT_DETAIL.brand,
    },
    offers: {
      '@type': 'Offer',
      price: PRODUCT_DETAIL.price,
      priceCurrency: 'XOF',
      availability: PRODUCT_DETAIL.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      // --- POINTS FORTS POUR LE SEO LOCAL ---
      availableAtOrFrom: {
        '@type': 'Place',
        name: 'Cap Skirring, Sénégal',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cap Skirring',
          addressRegion: 'Ziguinchor',
          addressCountry: 'SN',
        },
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          name: 'Cap Skirring et environs',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: 'PT1H', // 1 heure
          transitTime: 'PT2H', // 2 heures
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 15,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: PRODUCT_DETAIL.rating,
      reviewCount: PRODUCT_DETAIL.reviews,
    },
  };

  return (
    <>
      {/* Injection des données structurées dans le <head> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Bouton Retour */}
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition">
            <ChevronLeft className="w-5 h-5" /> Retour à la boutique
          </button>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* --- SECTION GALERIE --- */}
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                <img src={PRODUCT_DETAIL.images[selectedImage]} alt={PRODUCT_DETAIL.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="grid grid-cols-3 gap-4">
                {PRODUCT_DETAIL.images.map((img, index) => (
                  <motion.button key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${selectedImage === index ? 'border-blue-600' : 'border-transparent'
                      }`}
                  >
                    <img src={img} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* --- SECTION INFOS PRODUIT --- */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {PRODUCT_DETAIL.category}
                </span>
                {PRODUCT_DETAIL.localPickup && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Disponible immédiatement à Cap Skirring
                  </span>
                )}
                {PRODUCT_DETAIL.stockQuantity > 0 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" /> Stock: {PRODUCT_DETAIL.stockQuantity} unités
                  </span>
                )}
              </div>

              {/* Titre et note */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {PRODUCT_DETAIL.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(PRODUCT_DETAIL.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {PRODUCT_DETAIL.reviews} avis
                  </span>
                </div>
              </div>

              {/* Prix */}
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {PRODUCT_DETAIL.price.toLocaleString()} <span className="text-lg font-normal text-gray-600">FCFA</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {PRODUCT_DETAIL.description}
              </p>

              {/* Spécifications techniques */}
              <div className="border-t border-b border-gray-200 dark:border-gray-800 py-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spécifications techniques</h2>
                <div className="grid grid-cols-2 gap-4">
                  {PRODUCT_DETAIL.specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <div className="text-blue-600">{spec.icon}</div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{spec.label}</p>
                        <p className="font-medium">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caractéristiques */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Caractéristiques</h2>
                <ul className="space-y-2">
                  {PRODUCT_DETAIL.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Check className="w-5 h-5 text-green-500" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions d'achat */}
              <div className="space-y-4 pt-4">
                {/* Sélecteur quantité */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 dark:text-gray-300">Quantité:</span>
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-xl hover:bg-gray-100 dark:hover:bg-gray-800">-</button>
                    <span className="px-4 py-1 text-lg border-x border-gray-300 dark:border-gray-700">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(PRODUCT_DETAIL.stockQuantity, quantity + 1))}
                      className="px-3 py-1 text-xl hover:bg-gray-100 dark:hover:bg-gray-800">+</button>
                  </div>
                </div>

                {/* Boutons de paiement */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => addToCart({ ...PRODUCT_DETAIL, quantity })}
                    className="col-span-2 lg:col-span-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <ShoppingBag className="w-5 h-5" /> Ajouter au panier
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="col-span-2 lg:col-span-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <Smartphone className="w-5 h-5" /> Payer avec Wave
                  </motion.button>
                </div>

                {/* Moyens de paiement acceptés */}
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2">
                  <CreditCard className="w-4 h-4" /> Carte bancaire
                  <span>•</span>
                  <Smartphone className="w-4 h-4" /> Wave
                  <span>•</span>
                  <Smartphone className="w-4 h-4" /> Orange Money
                </div>
              </div>

              {/* Livraison locale */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start gap-3">
                <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-200">Livraison express à Cap Skirring</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Livraison en 2h dans toute la ville. Retrait gratuit en boutique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}