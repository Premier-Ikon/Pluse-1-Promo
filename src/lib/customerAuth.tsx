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

export type CustomerAddress = {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  formatted?: string | null;
  placeId?: string | null;
};

export type ShippingAddress = CustomerAddress & {
  id: string;
  label: string;
};

export type CustomerUser = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  company?: string | null;
  address?: CustomerAddress | null;
  shippingAddresses?: ShippingAddress[];
  defaultShippingAddressId?: string | null;
  profileComplete?: boolean;
};

export type CustomerProfileInput = {
  name: string;
  phone: string;
  company: string;
  address: CustomerAddress;
};

export type ShippingAddressesInput = {
  shippingAddresses: Array<CustomerAddress & { id?: string; label: string }>;
  defaultShippingAddressId?: string | null;
};

type CustomerAuthContextValue = {
  user: CustomerUser | null;
  loading: boolean;
  requestCode: (
    email: string,
  ) => Promise<{ ok: boolean; error?: string; message?: string }>;
  verify: (input: {
    email: string;
    code?: string;
    token?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (
    profile: CustomerProfileInput,
  ) => Promise<{ ok: boolean; error?: string }>;
  updateShippingAddresses: (
    input: ShippingAddressesInput,
  ) => Promise<{ ok: boolean; error?: string }>;
  refresh: () => Promise<void>;
  fetchMyOrders: () => Promise<unknown[]>;
};

const SESSION_KEY = "p1p_customer_session";

function catalogBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_CATALOG_API_URL || "http://localhost:4001"
  ).replace(/\/$/, "");
}

export function getCustomerToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SESSION_KEY) || "";
}

function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) window.localStorage.removeItem(SESSION_KEY);
  else window.localStorage.setItem(SESSION_KEY, token);
}

export function formatCustomerAddress(address?: CustomerAddress | null) {
  if (!address?.line1) return "";
  return [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.postalCode}`,
  ]
    .filter(Boolean)
    .join(", ");
}

export function getDefaultShippingAddress(user?: CustomerUser | null) {
  if (!user) return null;
  const list = getShippingAddressOptions(user);
  if (!list.length) return null;
  return (
    list.find((row) => row.id === user.defaultShippingAddressId) || list[0]
  );
}

export function getShippingAddressOptions(user?: CustomerUser | null) {
  if (!user) return [] as ShippingAddress[];
  if (user.shippingAddresses?.length) return user.shippingAddresses;
  if (user.address?.line1) {
    return [
      {
        id: "business",
        label: "Business",
        ...user.address,
      },
    ];
  }
  return [];
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(
  null,
);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getCustomerToken();
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
      return {
        ok: false,
        error:
          "Could not reach the sign-in service. If you're on localhost, make sure the API allows your port, then try again.",
      };
    }
  }, []);

  const verify = useCallback(
    async (input: { email: string; code?: string; token?: string }) => {
      try {
        const res = await fetch(
          `${catalogBaseUrl()}/api/customer/auth/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          },
        );
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
    const token = getCustomerToken();
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

  const updateProfile = useCallback(async (profile: CustomerProfileInput) => {
    const token = getCustomerToken();
    if (!token) return { ok: false, error: "Please sign in again" };
    try {
      const res = await fetch(`${catalogBaseUrl()}/api/customer/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { ok: false, error: data.error || "Could not save profile" };
      }
      setUser(data.user || null);
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not save profile" };
    }
  }, []);

  const updateShippingAddresses = useCallback(
    async (input: ShippingAddressesInput) => {
      const token = getCustomerToken();
      if (!token) return { ok: false, error: "Please sign in again" };
      try {
        const res = await fetch(
          `${catalogBaseUrl()}/api/customer/shipping-addresses`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
          },
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return {
            ok: false,
            error: data.error || "Could not save shipping addresses",
          };
        }
        setUser(data.user || null);
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not save shipping addresses" };
      }
    },
    [],
  );

  const fetchMyOrders = useCallback(async () => {
    const token = getCustomerToken();
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
      updateProfile,
      updateShippingAddresses,
      refresh,
      fetchMyOrders,
    }),
    [
      user,
      loading,
      requestCode,
      verify,
      logout,
      updateProfile,
      updateShippingAddresses,
      refresh,
      fetchMyOrders,
    ],
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
