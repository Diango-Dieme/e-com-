// ============================================
// FRONTEND/StoreFront.tsx
// Pôle : Interface Principale
// Regroupe : Header, Navigation, Filtres, Grille Produits
// ============================================
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Search, Menu, X, Waves, Bike, Users, Heart,
  MapPin, Wind, Gauge, Droplets, Star, Filter, ChevronDown
} from 'lucide-react';
import { useStore } from '../LOGIQUE/CartEngine'; // Chemin relatif adapté

// --- Types (Internes au composant) ---
interface Product {
  id: string;
  name: string;
  category: 'Surf' | 'Paddle' | 'Cyclisme' | 'Natation';
  price: number;
  image: string;
  rating: number;
  inStock: boolean;
  localPickup: boolean;
  specs: { icon: JSX.Element; label: string; value: string }[];
}

// --- Données Mockées (Remplacées par API plus tard) ---
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Planche Shortboard Pro', category: 'Surf', price: 450000,
    image: 'https://images.unsplash.com/photo-1605703562752-1cfe7b86bfac?w=500&auto=format',
    rating: 4.8, inStock: true, localPickup: true,
    specs: [
      { icon: <Wind size={14} />, label: 'Volume', value: '28L' },
      { icon: <Gauge size={14} />, label: 'Shape', value: 'Shortboard' },
    ]
  },
  {
    id: '2', name: 'Paddle Gonflable Elite', category: 'Paddle', price: 295000,
    image: 'https://images.unsplash.com/photo-1596733430284-f7437764b2a7?w=500&auto=format',
    rating: 4.5, inStock: true, localPickup: true,
    specs: [
      { icon: <Wind size={14} />, label: 'Longueur', value: '10\'6"' },
      { icon: <Droplets size={14} />, label: 'Poids', value: '8.5 kg' },
    ]
  },
  {
    id: '3', name: 'VTT Carbone XC900', category: 'Cyclisme', price: 1250000,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500&auto=format',
    rating: 4.9, inStock: false, localPickup: true,
    specs: [
      { icon: <Gauge size={14} />, label: 'Cadre', value: 'Carbone' },
      { icon: <Bike size={14} />, label: 'Suspension', value: '140mm' },
    ]
  },
  {
    id: '4', name: 'Combinaison Intégrale 5/4', category: 'Surf', price: 185000,
    image: 'https://images.unsplash.com/photo-1600965962361-9035fbfd1c50?w=500&auto=format',
    rating: 4.6, inStock: true, localPickup: true,
    specs: [
      { icon: <Wind size={14} />, label: 'Epaisseur', value: '5/4mm' },
      { icon: <Users size={14} />, label: 'Fermeture', value: 'Dos' },
    ]
  },
  {
    id: '5', name: 'Lunettes de Natation Pro', category: 'Natation', price: 25000,
    image: 'https://images.unsplash.com/photo-1575424906817-8c5b4a66a29a?w=500&auto=format',
    rating: 4.7, inStock: true, localPickup: true,
    specs: [
      { icon: <Droplets size={14} />, label: 'Anti-buée', value: 'Oui' },
      { icon: <Gauge size={14} />, label: 'UV', value: '400' },
    ]
  }
];

// --- Composant Principal ---
export default function StoreFront() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS);
  const { cart, addToCart } = useStore();

  const categories = ['Tous', 'Surf', 'Paddle', 'Cyclisme', 'Natation'];

  // Effet de filtrage
  useEffect(() => {
    let filtered = MOCK_PRODUCTS;
    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 font-sans">
      {/* Header avec thème "Sport de Luxe" */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <Waves className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Cap<span className="font-light">Surf</span>
            </span>
          </motion.div>

          {/* Barre de recherche Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher (planche, combinaison...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>

          {/* Actions : Panier, Menu Mobile */}
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </motion.button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text" placeholder="Rechercher..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => { setSelectedCategory(cat); setIsMenuOpen(false); }}
                    className={`py-2 px-3 rounded-lg text-center transition ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu Principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Filtres Desktop */}
        <div className="hidden md:flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {categories.map(cat => (
              <motion.button key={cat} whileHover={{ y: -2 }} onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredProducts.length} produits</span>
          </div>
        </div>

        {/* Grille de Produits */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">Aucun produit trouvé.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants} whileHover={{ y: -8 }}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                {/* Badge Local - SEO Visuel */}
                {product.localPickup && (
                  <div className="absolute top-3 left-3 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <MapPin className="w-3 h-3" /> Disponible à Cap Skirring
                  </div>
                )}
                {/* Badge Stock */}
                {!product.inStock && (
                  <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Rupture
                  </div>
                )}

                {/* Image */}
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Infos Produit */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2 line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Spécifications Miniatures */}
                  <div className="flex gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
                    {product.specs.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        {spec.icon} <span>{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Prix et Action */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {product.price.toLocaleString()} FCFA
                    </span>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className={`p-2 rounded-full ${product.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}