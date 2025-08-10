import { useEffect } from "react";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/context/ItemsContext";
import { setPageSEO } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw } from "lucide-react";

export default function FoundItems() {
  const { items, loading, error, refreshItems } = useItems();

  useEffect(() => {
    setPageSEO("Found Items – Lost & Found", "Browse found items reported by the community.", "/found");
  }, []);

  const list = items.filter((i) => i.type === "found");

  if (loading) {
    return (
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">Found Items</h1>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading found items...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">Found Items</h1>
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={refreshItems}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Found Items</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshItems}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {list.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No found items found.</p>
          <p className="text-muted-foreground">Be the first to report a found item!</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </main>
  );
}
