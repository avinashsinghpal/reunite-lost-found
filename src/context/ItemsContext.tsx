import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ItemType = "lost" | "found";

export type Item = {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  locationText: string;
  coordinates?: { lng: number; lat: number };
  dateISO: string;
  imageUrl?: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
};

export type NewItem = Omit<Item, "id">;

type Ctx = {
  items: Item[];
  addItem: (item: NewItem) => Item;
  getItem: (id: string) => Item | undefined;
};

const ItemsContext = createContext<Ctx | undefined>(undefined);

const LS_KEY = "lostfound_items_v1";

const seedItems: Item[] = [
  {
    id: "1",
    type: "lost",
    name: "Black Wallet",
    description: "Leather wallet with ID and a few cards.",
    locationText: "Downtown Park",
    coordinates: { lng: 0, lat: 0 },
    dateISO: new Date().toISOString().slice(0, 10),
    imageUrl: "/placeholder.svg",
    contactName: "Alex",
    contactEmail: "alex@example.com",
  },
  {
    id: "2",
    type: "found",
    name: "Set of Keys",
    description: "Three keys on a blue keychain.",
    locationText: "Main Street Cafe",
    coordinates: { lng: 0, lat: 0 },
    dateISO: new Date().toISOString().slice(0, 10),
    imageUrl: "/placeholder.svg",
    contactName: "Jamie",
    contactEmail: "jamie@example.com",
  },
];

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return seedItems;
      const parsed = JSON.parse(raw) as Item[];
      return parsed.length ? parsed : seedItems;
    } catch {
      return seedItems;
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: NewItem) => {
    const newItem: Item = { id: crypto.randomUUID(), ...item };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const getItem = (id: string) => items.find((i) => i.id === id);

  const value = useMemo(() => ({ items, addItem, getItem }), [items]);

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error("useItems must be used within ItemsProvider");
  return ctx;
}
