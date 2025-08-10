import { useEffect } from "react";
import ItemForm from "@/components/ItemForm";
import { setPageSEO } from "@/lib/seo";

export default function ReportLost() {
  useEffect(() => {
    setPageSEO("Report Lost Item – Lost & Found", "Create a report for a lost item.", "/report-lost");
  }, []);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Report Lost Item</h1>
      <ItemForm type="lost" />
    </main>
  );
}
