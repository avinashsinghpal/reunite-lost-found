import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Item } from "@/context/ItemsContext";

export default function ItemCard({ item }: { item: Item }) {
  return (
    <Card className="overflow-hidden hover-scale animate-enter">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={`${item.name} – Lost & Found item image`}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      )}
      <CardHeader>
        <CardTitle className="text-lg">
          {item.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{item.locationText}</p>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm">{item.description}</p>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">{new Date(item.dateISO).toLocaleDateString()}</span>
        <Button asChild variant="outline" size="sm">
          <Link to={`/items/${item.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
