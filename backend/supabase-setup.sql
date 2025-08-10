-- Lost & Found Database Setup for Supabase
-- Run these commands in your Supabase SQL Editor

-- 1. Create the items table
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  date_reported TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT NOT NULL,
  contact_info TEXT NOT NULL
);

-- 2. Create indexes for better performance
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_items_date_reported ON items(date_reported DESC);
CREATE INDEX idx_items_lat_lng ON items(latitude, longitude);

-- 3. Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Policy for anonymous read access (anyone can view items)
CREATE POLICY "Allow anonymous read access" ON items
  FOR SELECT USING (true);

-- Policy for authenticated write access (only authenticated users can create/update/delete)
CREATE POLICY "Allow authenticated write access" ON items
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Create storage bucket (run this in Storage section of Supabase dashboard)
-- Bucket name: item-images
-- Public bucket: true

-- 6. Storage policies (run these after creating the bucket)
-- Allow public read access to item-images bucket
CREATE POLICY "Public Access" ON storage.objects 
  FOR SELECT USING (bucket_id = 'item-images');

-- Allow authenticated users to upload to item-images bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'item-images' AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update" ON storage.objects 
  FOR UPDATE USING (
    bucket_id = 'item-images' AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated users can delete" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'item-images' AND auth.role() = 'authenticated'
  );

-- 7. Optional: Create a function to automatically update date_reported
CREATE OR REPLACE FUNCTION update_date_reported()
RETURNS TRIGGER AS $$
BEGIN
  NEW.date_reported = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Optional: Create trigger to automatically update date_reported on insert
CREATE TRIGGER update_items_date_reported
  BEFORE INSERT ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_date_reported();

-- 9. Optional: Create a view for recent items
CREATE VIEW recent_items AS
SELECT 
  id,
  type,
  name,
  description,
  location,
  latitude,
  longitude,
  date_reported,
  image_url,
  contact_info,
  CASE 
    WHEN date_reported > NOW() - INTERVAL '24 hours' THEN 'recent'
    WHEN date_reported > NOW() - INTERVAL '7 days' THEN 'recent_week'
    ELSE 'older'
  END as recency
FROM items
ORDER BY date_reported DESC;

-- 10. Optional: Create a function to search items
CREATE OR REPLACE FUNCTION search_items(search_term TEXT)
RETURNS TABLE (
  id UUID,
  type TEXT,
  name TEXT,
  description TEXT,
  location TEXT,
  latitude FLOAT,
  longitude FLOAT,
  date_reported TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  contact_info TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.type,
    i.name,
    i.description,
    i.location,
    i.latitude,
    i.longitude,
    i.date_reported,
    i.image_url,
    i.contact_info
  FROM items i
  WHERE 
    i.name ILIKE '%' || search_term || '%' OR
    i.description ILIKE '%' || search_term || '%' OR
    i.location ILIKE '%' || search_term || '%'
  ORDER BY i.date_reported DESC;
END;
$$ LANGUAGE plpgsql;

-- 11. Optional: Create a function to get items by location radius
CREATE OR REPLACE FUNCTION get_items_near_location(
  lat FLOAT,
  lng FLOAT,
  radius_km FLOAT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  type TEXT,
  name TEXT,
  description TEXT,
  location TEXT,
  latitude FLOAT,
  longitude FLOAT,
  date_reported TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  contact_info TEXT,
  distance_km FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.type,
    i.name,
    i.description,
    i.location,
    i.latitude,
    i.longitude,
    i.date_reported,
    i.image_url,
    i.contact_info,
    (
      6371 * acos(
        cos(radians(lat)) * 
        cos(radians(i.latitude)) * 
        cos(radians(i.longitude) - radians(lng)) + 
        sin(radians(lat)) * 
        sin(radians(i.latitude))
      )
    ) as distance_km
  FROM items i
  WHERE 
    i.latitude IS NOT NULL AND 
    i.longitude IS NOT NULL AND
    (
      6371 * acos(
        cos(radians(lat)) * 
        cos(radians(i.latitude)) * 
        cos(radians(i.longitude) - radians(lng)) + 
        sin(radians(lat)) * 
        sin(radians(i.latitude))
      )
    ) <= radius_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- 12. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON items TO anon, authenticated;
GRANT ALL ON recent_items TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_items(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_items_near_location(FLOAT, FLOAT, FLOAT) TO anon, authenticated;

-- 13. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 14. Create a full-text search index for better search performance
CREATE INDEX idx_items_search ON items USING gin(
  to_tsvector('english', name || ' ' || description || ' ' || location)
);

-- 15. Optional: Create a function for full-text search
CREATE OR REPLACE FUNCTION search_items_full_text(search_query TEXT)
RETURNS TABLE (
  id UUID,
  type TEXT,
  name TEXT,
  description TEXT,
  location TEXT,
  latitude FLOAT,
  longitude FLOAT,
  date_reported TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  contact_info TEXT,
  rank FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.type,
    i.name,
    i.description,
    i.location,
    i.latitude,
    i.longitude,
    i.date_reported,
    i.image_url,
    i.contact_info,
    ts_rank(to_tsvector('english', i.name || ' ' || i.description || ' ' || i.location), plainto_tsquery('english', search_query)) as rank
  FROM items i
  WHERE 
    to_tsvector('english', i.name || ' ' || i.description || ' ' || i.location) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, i.date_reported DESC;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION search_items_full_text(TEXT) TO anon, authenticated;
