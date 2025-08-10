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

      {/* Feature Catalogue - before footer */}
      <section className="container mx-auto pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Feature Catalogue</h2>
          <p className="text-muted-foreground">Everything you need to reunite with your belongings.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature title="Quick Reports" desc="Create a lost/found report in under a minute." icon="FilePlus" />
          <Feature title="Map Location" desc="Drop a pin where the item was lost or found." icon="MapPin" />
          <Feature title="Image Uploads" desc="Attach photos to help others recognize items." icon="Image" />
          <Feature title="Contact Options" desc="Share email or phone securely to coordinate." icon="Mail" />
          <Feature title="Search & Filters" desc="Scan items rapidly with an intuitive layout." icon="Search" />
          <Feature title="Privacy-first" desc="We minimize data and keep it under your control." icon="Shield" />
        </div>
      </section>
    </main>
  );
};

import { FilePlus, MapPin, Image as ImageIcon, Mail, Search, Shield } from "lucide-react";

const IconMap: Record<string, React.ComponentType<any>> = {
  FilePlus,
  MapPin,
  Image: ImageIcon,
  Mail,
  Search,
  Shield,
};

function Feature({ title, desc, icon }: { title: string; desc: string; icon: keyof typeof IconMap | string }) {
  const IconComp = IconMap[(icon as keyof typeof IconMap)] || FilePlus;
  return (
    <div className="rounded-lg border p-6 hover-scale animate-enter">
      <div className="flex items-center gap-3 mb-3">
        <IconComp className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

export default Index;
