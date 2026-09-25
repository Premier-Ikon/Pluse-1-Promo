"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Check,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { ShippingAddressModal } from "@/components/account/ShippingAddressModal";
import { ButtonNative } from "@/components/ui/Button";
import {
  formatCustomerAddress,
  useCustomerAuth,
  type CustomerAddress,
  type ShippingAddress,
} from "@/lib/customerAuth";
import { cn } from "@/lib/utils";

function newLocalId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function AccountSettingsPanel() {
  const { user, updateShippingAddresses } = useCustomerAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingAddress | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const addresses = useMemo(() => {
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
  }, [user]);

  const defaultId =
    user?.defaultShippingAddressId || addresses[0]?.id || null;

  async function persist(
    next: ShippingAddress[],
    nextDefaultId?: string | null,
  ): Promise<{ ok: boolean; error?: string }> {
    setError("");
    setMessage("");
    const preferred =
      nextDefaultId && next.some((row) => row.id === nextDefaultId)
        ? nextDefaultId
        : next[0]?.id || null;
    const result = await updateShippingAddresses({
      shippingAddresses: next,
      defaultShippingAddressId: preferred,
    });
    if (!result.ok) {
      const msg = result.error || "Could not save shipping addresses";
      setError(msg);
      return { ok: false, error: msg };
    }
    return { ok: true };
  }

  async function handleSave(value: {
    id?: string;
    label: string;
    address: CustomerAddress;
  }) {
    const nextRow: ShippingAddress = {
      id: value.id || newLocalId(),
      label: value.label,
      ...value.address,
    };
    const without = addresses.filter((row) => row.id !== nextRow.id);
    const next = [...without, nextRow];
    const result = await persist(next, defaultId || nextRow.id);
    if (result.ok) {
      setMessage(
        value.id ? "Shipping address updated." : "Shipping address added.",
      );
    }
    return result;
  }

  async function setDefault(id: string) {
    setBusyId(id);
    const result = await persist(addresses, id);
    setBusyId(null);
    if (result.ok) setMessage("Default shipping location updated.");
  }

  async function removeAddress(id: string) {
    if (addresses.length <= 1) {
      setError("Keep at least one shipping address on file.");
      return;
    }
    setBusyId(id);
    const next = addresses.filter((row) => row.id !== id);
    const nextDefault =
      defaultId === id ? next[0]?.id || null : defaultId;
    const result = await persist(next, nextDefault);
    setBusyId(null);
    if (result.ok) setMessage("Shipping address removed.");
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-white p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-accent-light text-brand-accent-dark">
            <Building2 size={18} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-taupe">
              Business profile
            </h2>
            <p className="mt-1 text-sm text-grey-olive">
              Used to autofill your contact details on quotes and orders.
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-grey-olive">
                  Name
                </dt>
                <dd className="mt-1 text-sm text-taupe">
                  {user.name || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-grey-olive">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-taupe">{user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-grey-olive">
                  Phone
                </dt>
                <dd className="mt-1 text-sm text-taupe">
                  {user.phone || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-grey-olive">
                  Company
                </dt>
                <dd className="mt-1 text-sm text-taupe">
                  {user.company || "—"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-grey-olive">
                  Business address
                </dt>
                <dd className="mt-1 text-sm text-taupe">
                  {formatCustomerAddress(user.address) || "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-brand-accent-dark" />
              <h2 className="text-lg font-semibold text-taupe">
                Shipping locations
              </h2>
            </div>
            <p className="mt-1 text-sm text-grey-olive">
              Add offices, warehouses, or event venues. Set a default for
              autofill.
            </p>
          </div>
          <ButtonNative
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            disabled={addresses.length >= 12}
          >
            <Plus size={16} />
            Add address
          </ButtonNative>
        </div>

        {error ? (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="mb-4 rounded-xl border border-brand-accent/30 bg-brand-accent-light px-4 py-3 text-sm text-taupe">
            {message}
          </p>
        ) : null}

        {!addresses.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center">
            <p className="text-sm text-grey-olive">
              No shipping locations yet. Add one to use on future quotes.
            </p>
            <ButtonNative
              type="button"
              variant="primary"
              className="mt-5"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Plus size={16} />
              Add shipping address
            </ButtonNative>
          </div>
        ) : (
          <ul className="space-y-3">
            {addresses.map((row) => {
              const isDefault = row.id === defaultId;
              const busy = busyId === row.id;
              return (
                <li
                  key={row.id}
                  className={cn(
                    "rounded-2xl border bg-white p-5 transition",
                    isDefault
                      ? "border-brand-accent/40 shadow-sm"
                      : "border-border",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-taupe">
                          {row.label}
                        </p>
                        {isDefault ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-accent-light px-2 py-0.5 text-[11px] font-semibold text-brand-accent-dark">
                            <Check size={11} strokeWidth={2.5} />
                            Default
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-grey-olive">
                        {formatCustomerAddress(row)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {!isDefault ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void setDefault(row.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-taupe transition hover:bg-surface disabled:opacity-50"
                        >
                          <Star size={13} />
                          Set default
                        </button>
                      ) : null}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setEditing(row);
                          setModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-taupe transition hover:bg-surface disabled:opacity-50"
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={busy || addresses.length <= 1}
                        onClick={() => void removeAddress(row.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-40"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <ShippingAddressModal
        open={modalOpen}
        mode={editing ? "edit" : "add"}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
