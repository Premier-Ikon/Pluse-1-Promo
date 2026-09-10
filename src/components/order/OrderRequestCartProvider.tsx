"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  cartTotalQty,
  createCartItemId,
  readOrderRequestCart,
  writeOrderRequestCart,
  type OrderRequestCartItem,
} from "@/lib/orderRequestCart";

type OrderRequestCartContextValue = {
  items: OrderRequestCartItem[];
  totalQty: number;
  itemCount: number;
  addItem: (item: Omit<OrderRequestCartItem, "id">) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const OrderRequestCartContext =
  createContext<OrderRequestCartContextValue | null>(null);

export function OrderRequestCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderRequestCartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readOrderRequestCart());
    setReady(true);

    function sync() {
      setItems(readOrderRequestCart());
    }
    window.addEventListener("storage", sync);
    window.addEventListener("p1p-order-cart-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("p1p-order-cart-change", sync);
    };
  }, []);

  const persist = useCallback((next: OrderRequestCartItem[]) => {
    setItems(next);
    writeOrderRequestCart(next);
  }, []);

  const addItem = useCallback(
    (item: Omit<OrderRequestCartItem, "id">) => {
      persist([...readOrderRequestCart(), { ...item, id: createCartItemId() }]);
    },
    [persist],
  );

  const removeItem = useCallback(
    (id: string) => {
      persist(readOrderRequestCart().filter((item) => item.id !== id));
    },
    [persist],
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo(
    () => ({
      items: ready ? items : [],
      totalQty: ready ? cartTotalQty(items) : 0,
      itemCount: ready ? items.length : 0,
      addItem,
      removeItem,
      clear,
    }),
    [ready, items, addItem, removeItem, clear],
  );

  return (
    <OrderRequestCartContext.Provider value={value}>
      {children}
    </OrderRequestCartContext.Provider>
  );
}

export function useOrderRequestCart() {
  const ctx = useContext(OrderRequestCartContext);
  if (!ctx) {
    throw new Error(
      "useOrderRequestCart must be used within OrderRequestCartProvider",
    );
  }
  return ctx;
}
