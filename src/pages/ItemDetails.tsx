import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useItems } from "@/context/ItemsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { setPageSEO } from "@/lib/seo";

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const { getItem } = useItems();
  const item = id ? getItem(id) : undefined;

  useEffect(() => {
    setPageSEO(
      item ? `${item.name} – Details` : "Item not found – Lost & Found",
      item ? `View details for ${item.name}.` : "",
      item ? `/items/${item.id}` : undefined
    );
  }, [item]);

  if (!item) {
    return (
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-6">Item Not Found</h1>
        <Button asChild variant="outline"><Link to="/">Go Home</Link></Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10">
      <Card className="overflow-hidden">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={`${item.name} image`} className="w-full h-72 object-cover" />
        )}
        <CardHeader>
          <CardTitle className="text-3xl">{item.name}</CardTitle>
          <p className="text-muted-foreground">{item.type.toUpperCase()} • {new Date(item.dateISO).toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h2 className="text-lg font-medium mb-1">Description</h2>
            <p>{item.description}</p>
          </section>
          <section>
            <h2 className="text-lg font-medium mb-1">Location</h2>
            <p className="text-muted-foreground">{item.locationText}</p>
            {item.coordinates && (
              <p className="text-sm text-muted-foreground">Coordinates: {item.coordinates.lat.toFixed(5)}, {item.coordinates.lng.toFixed(5)}</p>
            )}
          </section>
          <section>
            <h2 className="text-lg font-medium mb-1">Contact</h2>
            <p>{item.contactName}</p>
            {item.contactEmail && (
              <p>
                Email: <a className="story-link" href={`mailto:${item.contactEmail}?subject=Regarding ${encodeURIComponent(item.name)}`}>{item.contactEmail}</a>
              </p>
            )}
            {item.contactPhone && <p>Phone: {item.contactPhone}</p>}
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
