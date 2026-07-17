"use client";

import { useEffect, useMemo, useState } from "react";

type PantryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: string;
};

const initialForm = {
  name: "",
  quantity: 1,
  unit: "",
  category: "",
  expiryDate: new Date().toISOString().slice(0, 10),
};

export default function PantryManager() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [form, setForm] = useState(initialForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [recipeResult, setRecipeResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const response = await fetch("/api/pantry");
    if (response.ok) {
      const data = await response.json();
      setItems(data.items ?? []);
    }
    setLoading(false);
  };

  const categories = useMemo(() => {
    const groups: Record<string, PantryItem[]> = {};
    items.forEach((item) => {
      groups[item.category] = groups[item.category] ?? [];
      groups[item.category].push(item);
    });
    return groups;
  }, [items]);

  const now = new Date();
  const expiringSoon = items.filter((item) => {
    const date = new Date(item.expiryDate);
    return date >= now && date <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  });
  const expired = items.filter((item) => new Date(item.expiryDate) < now);
  const lowStock = items.filter((item) => item.quantity > 0 && item.quantity <= 2);

  const handleChange = (field: string, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setSelectedId(null);
    setForm(initialForm);
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const url = selectedId ? `/api/pantry/${selectedId}` : "/api/pantry";
    const method = selectedId ? "PATCH" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data?.error || "Unable to save item.");
      return;
    }

    resetForm();
    await fetchItems();
    setMessage(selectedId ? "Item updated." : "Item added.");
  };

  const editItem = (item: PantryItem) => {
    setSelectedId(item.id);
    setForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      expiryDate: item.expiryDate.slice(0, 10),
    });
    setMessage(null);
  };

  const deleteItem = async (id: string) => {
    const response = await fetch(`/api/pantry/${id}`, { method: "DELETE" });
    if (response.ok) {
      await fetchItems();
      setMessage("Item deleted.");
    }
  };

  const fetchRecipes = async () => {
    setRecipeResult(null);
    const itemNames = items.map((item) => item.name).filter(Boolean);
    if (itemNames.length === 0) {
      setRecipeResult("Add pantry items to get recipe suggestions.");
      return;
    }

    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: itemNames }),
    });

    if (!response.ok) {
      const data = await response.json();
      setRecipeResult(data?.error || "Unable to fetch recipe suggestions.");
      return;
    }

    const data = await response.json();
    const content = data?.result?.choices?.[0]?.message?.content;
    setRecipeResult(content ?? JSON.stringify(data?.result, null, 2));
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Inventory</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Your pantry items</h2>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-700">
              {items.length} item{items.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500">Loading items…</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-slate-500">No pantry items yet. Add one to get started.</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">
                          {item.quantity} {item.unit} · {item.category}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => editItem(item)}
                          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      Expires {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Insights</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-3xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Expiring soon</p>
                <p className="mt-2 text-2xl font-semibold">{expiringSoon.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Expired</p>
                <p className="mt-2 text-2xl font-semibold">{expired.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-4">
                <p className="text-sm text-slate-400">Low stock</p>
                <p className="mt-2 text-2xl font-semibold">{lowStock.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-4">
            <h3 className="text-lg font-semibold text-slate-900">Recipe suggestions</h3>
            <p className="mt-2 text-sm text-slate-500">Generate recipe ideas from your current pantry.</p>
            <button
              type="button"
              onClick={fetchRecipes}
              className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Generate recipes
            </button>
            {recipeResult ? (
              <pre className="mt-4 whitespace-pre-wrap rounded-3xl bg-slate-950 p-4 text-sm text-slate-100">
                {recipeResult}
              </pre>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.65fr_0.35fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Add or edit pantry items</h2>
          <form className="mt-6 space-y-4" onSubmit={submitForm}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-slate-600">Item name</span>
                <input
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Quantity</span>
                <input
                  type="number"
                  min={0}
                  value={form.quantity}
                  onChange={(event) => handleChange("quantity", Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Unit</span>
                <input
                  value={form.unit}
                  onChange={(event) => handleChange("unit", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-600">Category</span>
                <input
                  value={form.category}
                  onChange={(event) => handleChange("category", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm text-slate-600">Expiry date</span>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(event) => handleChange("expiryDate", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-slate-400"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                {selectedId ? "Save changes" : "Add item"}
              </button>
              {selectedId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-2xl border border-slate-200 px-6 py-3 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              ) : null}
            </div>
            {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          </form>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Section breakdown</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="font-semibold">All items</p>
              <p>{items.length} total</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="font-semibold">Expiring soon</p>
              <p>{expiringSoon.length} item(s) in the next 7 days</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="font-semibold">Expired</p>
              <p>{expired.length} item(s)</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="font-semibold">Low stock</p>
              <p>{lowStock.length} item(s) at 2 or fewer units</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
