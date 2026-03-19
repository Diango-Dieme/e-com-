// ============================================
// LOGIQUE/CartEngine.ts
// Pôle : Logique Métier
// Gère : Panier, TVA (18%), Totaux FCFA, Checkout
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types ---
export interface CartItem {
  id: string;
  name: string;
  price: number; // Prix en FCFA
  quantity: number;
  image: string;
  category: string;
  maxStock?: number;
}

interface CartState {
  cart: CartItem[];
  // Actions
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  // Getters (calculés)
  getSubtotal: () => number;
  getTVA: () => number; // 18% au Sénégal
  getTotal: () => number;
  getItemCount: () => number;
  // Checkout
  prepareCheckout: () => CheckoutData;
}

interface CheckoutData {
  items: CartItem[];
  subtotal: number;
  tva: number;
  total: number;
  timestamp: string;
}

// --- CONSTANTES ---
const TVA_RATE = 0.18; // 18% de TVA au Sénégal

// --- STORE PRINCIPAL ---
export const useStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      // Ajouter un produit
      addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
          // Si l'item existe, on incrémente la quantité (si stock dispo)
          const newQuantity = existingItem.quantity + (product.quantity || 1);
          if (product.maxStock && newQuantity > product.maxStock) return;

          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            )
          });
        } else {
          // Nouvel item
          set({
            cart: [...cart, {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: product.quantity || 1,
              image: product.image,
              category: product.category,
              maxStock: product.stockQuantity
            }]
          });
        }
      },

      // Retirer du panier
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.id !== productId) });
      },

      // Mettre à jour la quantité
      updateQuantity: (productId, quantity) => {
        const { cart } = get();
        const item = cart.find(i => i.id === productId);

        if (!item) return;
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        if (item.maxStock && quantity > item.maxStock) return;

        set({
          cart: cart.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        });
      },

      // Vider le panier
      clearCart: () => set({ cart: [] }),

      // Calculs
      getSubtotal: () => {
        return get().cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      },

      getTVA: () => {
        return get().getSubtotal() * TVA_RATE;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return subtotal + (subtotal * TVA_RATE);
      },

      getItemCount: () => {
        return get().cart.reduce((acc, item) => acc + item.quantity, 0);
      },

      // Préparation des données pour le checkout (Wave/Orange Money)
      prepareCheckout: () => {
        const state = get();
        const subtotal = state.getSubtotal();
        const tva = state.getTVA();
        const total = state.getTotal();

        // Logique de validation basique
        if (state.cart.length === 0) {
          throw new Error('Panier vide');
        }

        // Vérification des stocks (simulée)
        state.cart.forEach(item => {
          if (item.maxStock && item.quantity > item.maxStock) {
            throw new Error(`Stock insuffisant pour ${item.name}`);
          }
        });

        return {
          items: state.cart,
          subtotal: Math.round(subtotal),
          tva: Math.round(tva),
          total: Math.round(total),
          timestamp: new Date().toISOString(),
        };
      }
    }),
    {
      name: 'cap-skirring-cart', // Nom pour le localStorage
    }
  )
);

// --- Fonctions utilitaires pour le checkout externe ---
// Ces fonctions pourraient être appelées par les composants de paiement

/**
 * Formate un nombre en FCFA
 * Exemple: 12500 -> "12 500 FCFA"
 */
export const formatFCFA = (amount: number): string => {
  return amount.toLocaleString('fr-SN') + ' FCFA';
};

/**
 * Prépare la requête pour l'API Wave (Simulation)
 */
export const prepareWavePayment = (checkoutData: CheckoutData) => {
  // Ici, on construirait l'objet à envoyer à l'API Wave
  return {
    amount: checkoutData.total,
    currency: 'XOF',
    description: `Paiement CapSurf - ${checkoutData.items.length} article(s)`,
    // ... autres champs spécifiques à Wave
  };
};

/**
 * Prépare la requête pour l'API Orange Money (Simulation)
 */
export const prepareOrangeMoneyPayment = (checkoutData: CheckoutData) => {
  return {
    amount: checkoutData.total,
    currency: 'XOF',
    orderId: `ORDER-${Date.now()}`,
    items: checkoutData.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
    })),
  };
};

// --- Hook personnalisé pour utiliser le panier avec des valeurs calculées ---
export const useCartWithTotals = () => {
  const store = useStore();
  return {
    ...store,
    subtotal: store.getSubtotal(),
    tva: store.getTVA(),
    total: store.getTotal(),
    itemCount: store.getItemCount(),
    formattedSubtotal: formatFCFA(store.getSubtotal()),
    formattedTVA: formatFCFA(store.getTVA()),
    formattedTotal: formatFCFA(store.getTotal()),
  };
};