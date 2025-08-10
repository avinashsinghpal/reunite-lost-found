import { useEffect } from "react";
import ItemForm from "@/components/ItemForm";
import { setPageSEO } from "@/lib/seo";

export default function ReportFound() {
  useEffect(() => {
    setPageSEO("Report Found Item – Lost & Found", "Create a report for a found item.", "/report-found");
  }, []);

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Report Found Item</h1>
      <ItemForm type="found" />
    </main>
  );
}
