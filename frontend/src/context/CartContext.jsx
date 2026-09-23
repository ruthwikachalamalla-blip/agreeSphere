import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api'; import { useAuth } from './AuthContext';
const CartContext = createContext(null);
export function CartProvider({ children }) {
  const { user } = useAuth(); const [items, setItems] = useState([]);
  const load = useCallback(async () => { if (!user) { setItems([]); return; } try { const { data } = await api.get('/cart'); setItems(data?.items || []); } catch { setItems([]); } }, [user]);
  useEffect(() => { load(); }, [load]);
  const add = async (productId, quantity = 1) => { const { data } = await api.post('/cart', { productId, quantity }); setItems(data.items || []); };
  const update = async (id, quantity) => { const { data } = await api.patch(`/cart/${id}`, { quantity }); setItems(data.items || []); };
  const remove = async id => { const { data } = await api.delete(`/cart/${id}`); setItems(data.items || []); };
  const count = items.reduce((n, i) => n + i.quantity, 0);
  return <CartContext.Provider value={{ items, count, add, update, remove, load }}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
