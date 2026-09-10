"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CustomerUser = {
  id: string;
  email: string;
  name?: string | null;
};

type CustomerAuthContextValue = {
  user: CustomerUser | null;
  loading: boolean;
  requestCode: (email: string) => Promise<{ ok: boolean; error?: string; message?: string }>;
  verify: (input: {
    email: string;
    code?: string;
    token?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  fetchMyOrders: () => Promise<unknown[]>;
};

const SESSION_KEY = "p1p_customer_session";

function catalogBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_CATALOG_API_URL || "http://localhost:4001"
  ).replace(/\/$/, "");
}

function getToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SESSION_KEY) || "";
}

function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) window.localStorage.removeItem(SESSION_KEY);
  else window.localStorage.setItem(SESSION_KEY, token);
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(
  null,
);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${catalogBaseUrl()}/api/customer/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setToken(null);
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const requestCode = useCallback(async (email: string) => {
    try {
      const res = await fetch(`${catalogBaseUrl()}/api/customer/auth/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          ok: false,
          error: data.error || "Could not send sign-in email",
        };
      }
      return { ok: true, message: data.message };
    } catch {
      return { ok: false, error: "Could not send sign-in email" };
    }
  }, []);

  const verify = useCallback(
    async (input: { email: string; code?: string; token?: string }) => {
      try {
        const res = await fetch(`${catalogBaseUrl()}/api/customer/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data.error || "Verification failed" };
        }
        setToken(data.token || null);
        setUser(data.user || null);
        return { ok: true };
      } catch {
        return { ok: false, error: "Verification failed" };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        await fetch(`${catalogBaseUrl()}/api/customer/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        /* ignore */
      }
    }
    setToken(null);
    setUser(null);
  }, []);

  const fetchMyOrders = useCallback(async () => {
    const token = getToken();
    if (!token) return [];
    const res = await fetch(`${catalogBaseUrl()}/api/customer/order-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.orderRequests || [];
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      requestCode,
      verify,
      logout,
      fetchMyOrders,
    }),
    [user, loading, requestCode, verify, logout, fetchMyOrders],
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return ctx;
}
