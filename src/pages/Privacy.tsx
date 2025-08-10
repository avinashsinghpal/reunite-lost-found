import { useEffect } from "react";
import { setPageSEO } from "@/lib/seo";

export default function Privacy() {
  useEffect(() => {
    setPageSEO("Privacy Policy – Lost & Found", "Read our privacy policy.", "/privacy");
  }, []);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
      <article className="max-w-3xl space-y-4">
        <p>
          We value your privacy. Information you submit (like contact details) is used solely to connect item owners and finders. We do not sell your data.
        </p>
        <p>
          By submitting an item, you consent to display of the information you provide on this site. You may request removal by contacting support.
        </p>
      </article>
    </main>
  );
}
