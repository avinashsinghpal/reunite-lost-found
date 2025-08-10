import { useEffect } from "react";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/context/ItemsContext";
import { setPageSEO } from "@/lib/seo";

export default function FoundItems() {
  const { items } = useItems();

  useEffect(() => {
    setPageSEO("Found Items – Lost & Found", "Browse found items reported by the community.", "/found");
  }, []);

  const list = items.filter((i) => i.type === "found");

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Found Items</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </section>
    </main>
  );
}
