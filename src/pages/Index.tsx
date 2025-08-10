import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { setPageSEO } from "@/lib/seo";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    setPageSEO(
      "Lost & Found – Reunite with Your Items",
      "Report and find lost items near you. Helping you reunite with your lost items fast.",
      "/"
    );
  }, []);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="bg-hero">
          <div className="container mx-auto py-20 md:py-28">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
                Helping you reunite with your lost items
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Report lost or found items in minutes. Browse community submissions and connect securely to return belongings to their owners.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="hero" size="lg">
                  <Link to="/report-lost">Report Lost Item</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/report-found">Report Found Item</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border p-6 animate-enter">
            <h3 className="text-lg font-medium mb-2">Fast reporting</h3>
            <p className="text-muted-foreground">Fill out a quick form with item details and contact information.</p>
          </div>
          <div className="rounded-lg border p-6 animate-enter">
            <h3 className="text-lg font-medium mb-2">Smart discovery</h3>
            <p className="text-muted-foreground">Browse lost and found items with clear cards and filters.</p>
          </div>
          <div className="rounded-lg border p-6 animate-enter">
            <h3 className="text-lg font-medium mb-2">Secure contact</h3>
            <p className="text-muted-foreground">Connect via email or phone to coordinate a safe handoff.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
