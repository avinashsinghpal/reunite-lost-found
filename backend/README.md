# Lost & Found Backend API

A Node.js + Express backend API for the Lost & Found website with Supabase integration for database and file storage.

## Features

- ✅ RESTful API for lost and found items
- ✅ Image upload to Supabase Storage
- ✅ Row Level Security (RLS) with anonymous read and authenticated write
- ✅ Input validation and sanitization
- ✅ File upload size and type restrictions
- ✅ CORS support for frontend integration
- ✅ Rate limiting and security headers
- ✅ Ready for deployment on Vercel/Render

## Prerequisites

- Node.js 18+ 
- Supabase account and project
- npm or yarn

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase project details:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
NODE_ENV=development
```

### 3. Supabase Database Setup

#### Create the `items` table:

```sql
-- Create items table
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

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous read access
CREATE POLICY "Allow anonymous read access" ON items
  FOR SELECT USING (true);

-- Policy for authenticated write access
CREATE POLICY "Allow authenticated write access" ON items
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

#### Create Storage Bucket:

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a new bucket named `item-images`
4. Set the bucket to public
5. Configure the bucket policy:

```sql
-- Allow public read access to item-images bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'item-images');

-- Allow authenticated users to upload to item-images bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'item-images' AND auth.role() = 'authenticated'
);
```

### 4. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### File Upload
- `POST /api/upload` - Upload image file
  - Body: `multipart/form-data` with `image` field
  - Returns: File URL and metadata

### Items Management
- `POST /api/items` - Create new item
- `GET /api/items` - List all items (with optional filters)
- `GET /api/items/:id` - Get specific item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## API Documentation

### Create Item
```http
POST /api/items
Content-Type: application/json

{
  "type": "lost",
  "name": "iPhone 13",
  "description": "Black iPhone 13 with red case",
  "location": "Central Park",
  "latitude": 40.7829,
  "longitude": -73.9654,
  "image_url": "https://...",
  "contact_info": "john@example.com"
}
```

### List Items with Filters
```http
GET /api/items?type=lost&location=Central Park&search=iPhone&page=1&limit=20
```

### Upload Image
```http
POST /api/upload
Content-Type: multipart/form-data

image: [file]
```

## Security Features

- **Input Validation**: All inputs are validated using Joi schemas
- **Input Sanitization**: HTML content is sanitized to prevent XSS
- **File Upload Restrictions**: 
  - Max file size: 5MB
  - Allowed types: JPEG, PNG, WebP, GIF
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domains
- **Security Headers**: Helmet.js for security headers

## Deployment

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

### Render
1. Connect your GitHub repository
2. Set environment variables
3. Build command: `npm install`
4. Start command: `npm start`

### Environment Variables for Production
```env
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

## Error Handling

All endpoints return consistent JSON responses:

```json
{
  "success": true/false,
  "message": "Human readable message",
  "data": {}, // Optional data payload
  "errors": [] // Optional validation errors
}
```

## Development

### Project Structure
```
backend/
├── config/
│   └── supabase.js      # Supabase client configuration
├── middleware/
│   ├── validation.js    # Input validation and sanitization
│   └── upload.js        # File upload middleware
├── routes/
│   ├── items.js         # Items CRUD operations
│   └── upload.js        # File upload endpoint
├── server.js            # Main Express server
├── package.json
├── .env.example
└── README.md
```

### Testing the API

You can test the API using tools like Postman, curl, or Thunder Client:

```bash
# Health check
curl http://localhost:3001/health

# Get all items
curl http://localhost:3001/api/items

# Create an item
curl -X POST http://localhost:3001/api/items \
  -H "Content-Type: application/json" \
  -d '{"type":"lost","name":"Test Item","description":"Test","location":"Test","image_url":"https://example.com/image.jpg","contact_info":"test@example.com"}'
```

## License

MIT
