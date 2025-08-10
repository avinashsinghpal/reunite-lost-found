import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MapInput from "@/components/MapInput";
import { useItems, type NewItem, type ItemType } from "@/context/ItemsContext";
import { uploadApi } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Please enter an item name"),
  description: z.string().min(10, "Please describe the item"),
  locationText: z.string().min(2, "Enter a location"),
  dateISO: z.string().min(1, "Select a date"),
  contactName: z.string().min(2, "Enter your name"),
  contactEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
});

export default function ItemForm({ type }: { type: ItemType }) {
  const { addItem } = useItems();
  const [coords, setCoords] = useState<{ lng: number; lat: number } | undefined>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      locationText: "",
      dateISO: new Date().toISOString().slice(0, 10),
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setIsSubmitting(true);
      setUploadError(null);

      let finalImageUrl: string | undefined = undefined;

      // Upload image if a file is selected
      if (selectedFile) {
        try {
          const uploadResponse = await uploadApi.uploadImage(selectedFile);
          finalImageUrl = uploadResponse.data.fileUrl;
        } catch (error) {
          console.error('Image upload failed:', error);
          setUploadError('Failed to upload image. Please try again.');
          return;
        }
      }

      const payload: NewItem = {
        type,
        name: values.name,
        description: values.description,
        locationText: values.locationText,
        coordinates: coords,
        dateISO: values.dateISO,
        imageUrl: finalImageUrl || '',
        contactName: values.contactName,
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone || undefined,
      };

      const created = await addItem(payload);
      window.location.href = `/items/${created.id}`;
    } catch (error) {
      console.error('Form submission failed:', error);
      setUploadError('Failed to submit item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(undefined);
      setImageUrl(undefined);
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Black Wallet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateISO"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date {type === "lost" ? "lost" : "found"}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide details that help identify the item" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="locationText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location description</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Downtown Park near the fountain" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Add a photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}
            {imageUrl && (
              <img src={imageUrl} alt="Uploaded preview" className="h-32 w-48 object-cover rounded-md border" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Pick location on map (optional)</label>
          <MapInput value={coords} onChange={setCoords} />
          {coords && (
            <p className="text-xs text-muted-foreground">Selected: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="(optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : `Submit ${type === "lost" ? "Lost" : "Found"} Item`}
          </Button>
          <span className="text-sm text-muted-foreground">
            {isSubmitting ? "Uploading and saving..." : "We'll display your submission instantly."}
          </span>
        </div>
      </form>
    </Form>
  );
}
