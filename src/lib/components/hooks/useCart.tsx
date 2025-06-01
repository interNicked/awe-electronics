/* eslint-disable @typescript-eslint/no-unused-vars */
import {CartItem} from '@prisma/client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';

export type CartState = {id: string | null; items: CartItem[]};

type CartAction =
  | {type: 'SET'; payload: CartState}
  | {type: 'SET_ID'; payload: CartState['id']}
  | {type: 'ADD_ITEM'; payload: CartItem & {id: string | null}}
  | {type: 'REMOVE_ITEM'; payload: {id: string; quantity?: number}}
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
      if (action.payload.quantity) {
        const {quantity} = action.payload;
        return {
          id: state.id,
          items: state.items.map(i => {
            if (i.id !== action.payload.id) return i;
            else return {...i, quantity: i.quantity - quantity};
          }),
        };
      }
      return {
        id: state.id,
        items: state.items.filter(i => i.id !== action.payload.id),
      };

    case 'CLEAR':
      return {id: state.id, items: []};

    case 'SAVE':
      return state;

    case 'SET':
      const {id, items} = action.payload;
      return {id, items};

    case 'SET_ID':
      const newState = {id: action.payload, items: state.items};
      saveCart(newState);
      return newState;

    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  setCart: (item: CartState) => void;
  setCartId: (item: CartState['id']) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, quantity?: number) => void;
  clearCart: () => void;
  saveCart: () => void;
  getTotal: () => number;
} | null>(null);

export const CartProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(cartReducer, {id: null, items: []});

  const setCart = (cart: CartState) => dispatch({type: 'SET', payload: cart});
  const setCartId = (cartId: CartState['id']) =>
    dispatch({type: 'SET_ID', payload: cartId});
  const addItem = (item: CartItem) =>
    dispatch({type: 'ADD_ITEM', payload: item});
  const removeItem = (id: string, quantity: number | undefined = undefined) =>
    dispatch({type: 'REMOVE_ITEM', payload: {id, quantity}});
  const clearCart = () => dispatch({type: 'CLEAR'});
  const saveCart = () => dispatch({type: 'SAVE'});

  const getTotal = () =>
    state.items.reduce(
      (pv, cv) => (pv += cv.quantity * (cv.basePrice + cv.extraPrice)),
      0,
    );

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
      value={{
        state,
        addItem,
        removeItem,
        clearCart,
        saveCart,
        setCart,
        setCartId,
        getTotal,
      }}
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

const saveCart = (state: CartState) => {
  fetch(`/api/carts${state.id ? `/${state.id}` : ''}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state),
  })
    .then(res => console.log(res.ok ? 'Saved' : res.status))
    .catch(e => console.error(e));
};
