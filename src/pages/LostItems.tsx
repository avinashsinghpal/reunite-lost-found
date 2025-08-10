import { useEffect } from "react";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/context/ItemsContext";
import { setPageSEO } from "@/lib/seo";

export default function LostItems() {
  const { items } = useItems();

  useEffect(() => {
    setPageSEO("Lost Items – Lost & Found", "Browse lost items reported by the community.", "/lost");
  }, []);

  const list = items.filter((i) => i.type === "lost");

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Lost Items</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </section>
    </main>
  );
}
