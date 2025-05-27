import {createContext, useContext, useReducer, ReactNode} from 'react';
import {CartItem} from '@prisma/client';
import {v4} from 'uuid';

type CartState = {id: string; items: CartItem[]};

type CartAction =
  | {type: 'ADD_ITEM'; payload: CartItem}
  | {type: 'REMOVE_ITEM'; payload: {id: string}}
  | {type: 'CLEAR'};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const incoming = action.payload;
      const idx = state.items.findIndex(
        i =>
          i.productId === incoming.productId &&
          i.productOptionId === incoming.productOptionId,
      );

      // already in cart → just bump quantity
      if (idx !== -1) {
        const updated = [...state.items];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + incoming.quantity,
        };
        return {id: state.id, items: updated};
      }

      // new product
      return {id: state.id, items: [...state.items, incoming]};
    }

    case 'REMOVE_ITEM':
      return {
        id: state.id,
        items: state.items.filter(i => i.id !== action.payload.id),
      };

    case 'CLEAR':
      return {id: state.id, items: []};

    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
} | null>(null);

export const CartProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(cartReducer, {id: v4(), items: []});

  const addItem = (item: CartItem) =>
    dispatch({type: 'ADD_ITEM', payload: item});
  const removeItem = (id: string) =>
    dispatch({type: 'REMOVE_ITEM', payload: {id}});
  const clearCart = () => dispatch({type: 'CLEAR'});

  return (
    <CartContext.Provider value={{state, addItem, removeItem, clearCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside a <CartProvider>');
  return ctx;
};
