import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import {CartItem} from '@prisma/client';
import {v4} from 'uuid';

export type CartState = {id: string | null; items: CartItem[]};

type CartAction =
  | {type: 'SET'; payload: CartState}
  | {type: 'ADD_ITEM'; payload: CartItem & {id: string | null}}
  | {type: 'REMOVE_ITEM'; payload: {id: string}}
  | {type: 'CLEAR'}
  | {type: 'SAVE'};

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

    case 'SAVE':
      fetch(`/api/carts${state.id ? `/${state.id}` : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      })
        .then(res => console.log(res.ok ? 'Saved' : res.status))
        .catch(e => console.error(e));
      return state;

    case 'SET':
      const {id, items} = action.payload;
      return {id, items};

    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  setCart: (item: CartState) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  saveCart: () => void;
} | null>(null);

export const CartProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(cartReducer, {id: null, items: []});

  const setCart = (cart: CartState) => dispatch({type: 'SET', payload: cart});
  const addItem = (item: CartItem) =>
    dispatch({type: 'ADD_ITEM', payload: item});
  const removeItem = (id: string) =>
    dispatch({type: 'REMOVE_ITEM', payload: {id}});
  const clearCart = () => dispatch({type: 'CLEAR'});
  const saveCart = () => dispatch({type: 'SAVE'});

  useEffect(() => {
    if (state.items.length === 0) {
      const data = localStorage.getItem('cartState');
      if (data) setCart(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartState', JSON.stringify(state));
    saveCart();
  }, [state]);

  return (
    <CartContext.Provider
      value={{state, addItem, removeItem, clearCart, saveCart, setCart}}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside a <CartProvider>');
  return ctx;
};
