import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { itemsApi, type Item as ApiItem, type CreateItemData } from "../lib/api";

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
  loading: boolean;
  error: string | null;
  addItem: (item: NewItem) => Promise<Item>;
  getItem: (id: string) => Item | undefined;
  refreshItems: () => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};

const ItemsContext = createContext<Ctx | undefined>(undefined);

// Convert API item to frontend item format
function apiItemToItem(apiItem: ApiItem): Item {
  return {
    id: apiItem.id,
    type: apiItem.type,
    name: apiItem.name,
    description: apiItem.description,
    locationText: apiItem.location,
    coordinates: apiItem.latitude && apiItem.longitude 
      ? { lat: apiItem.latitude, lng: apiItem.longitude }
      : undefined,
    dateISO: apiItem.date_reported,
    imageUrl: apiItem.image_url,
    contactName: apiItem.contact_info, // For now, using contact_info as contactName
    contactEmail: apiItem.contact_info.includes('@') ? apiItem.contact_info : undefined,
    contactPhone: !apiItem.contact_info.includes('@') ? apiItem.contact_info : undefined,
  };
}

// Convert frontend item to API format
function itemToApiItem(item: NewItem): CreateItemData {
  return {
    type: item.type,
    name: item.name,
    description: item.description,
    location: item.locationText,
    latitude: item.coordinates?.lat,
    longitude: item.coordinates?.lng,
    image_url: item.imageUrl || '',
    contact_info: item.contactEmail || item.contactPhone || item.contactName,
  };
}

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemsApi.getItems();
      const convertedItems = response.data.map(apiItemToItem);
      setItems(convertedItems);
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (item: NewItem): Promise<Item> => {
    try {
      setError(null);
      const apiItem = itemToApiItem(item);
      const response = await itemsApi.createItem(apiItem);
      const newItem = apiItemToItem(response.data);
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      console.error('Failed to add item:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getItem = (id: string) => items.find((i) => i.id === id);

  const refreshItems = async () => {
    await fetchItems();
  };

  const deleteItem = async (id: string) => {
    try {
      setError(null);
      await itemsApi.deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = useMemo(
    () => ({ 
      items, 
      loading, 
      error, 
      addItem, 
      getItem, 
      refreshItems, 
      deleteItem 
    }), 
    [items, loading, error]
  );

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error("useItems must be used within ItemsProvider");
  return ctx;
}
