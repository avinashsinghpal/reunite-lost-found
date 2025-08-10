import { useEffect } from "react";
import { setPageSEO } from "@/lib/seo";

export default function Contact() {
  useEffect(() => {
    setPageSEO("Contact – Lost & Found", "Get in touch with the Lost & Found team.", "/contact");
  }, []);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Contact</h1>
      <section className="max-w-2xl rounded-lg border p-6 space-y-3">
        <p className="text-muted-foreground">
          Questions or feedback? Email us at <a href="mailto:support@example.com" className="story-link">support@example.com</a>.
        </p>
        <p className="text-sm text-muted-foreground">
          For item-specific questions, please use the contact details provided on the item details page.
        </p>
      </section>
    </main>
  );
}
