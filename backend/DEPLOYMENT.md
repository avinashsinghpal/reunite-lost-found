# Deployment Guide

This guide covers deploying the Lost & Found backend to various platforms.

## Prerequisites

1. **Supabase Project Setup**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL commands from `supabase-setup.sql` in your Supabase SQL Editor
   - Create the `item-images` storage bucket
   - Note down your project URL and API keys

2. **Environment Variables**
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `NODE_ENV`: Set to `production` for production deployments
   - `CORS_ORIGIN`: Your frontend domain(s)

## Platform-Specific Deployment

### 1. Vercel Deployment

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to backend directory
cd backend

# Deploy
vercel --prod

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NODE_ENV production
vercel env add CORS_ORIGIN https://your-frontend-domain.com
```

#### Option B: GitHub Integration
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### 2. Render Deployment

1. **Create a new Web Service**
   - Connect your GitHub repository
   - Choose the `backend` directory as root
   - Set build command: `npm install`
   - Set start command: `npm start`

2. **Environment Variables**
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your app

### 3. Railway Deployment

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Environment Variables**
   - Add all required environment variables in Railway dashboard

3. **Deploy**
   - Railway will automatically deploy on push

### 4. Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set SUPABASE_URL=your_supabase_url
   heroku config:set SUPABASE_ANON_KEY=your_anon_key
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### 5. DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Configure App**
   - Build command: `npm install`
   - Run command: `npm start`
   - Set environment variables

3. **Deploy**
   - Click "Create Resources"

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `SUPABASE_URL` | Your Supabase project URL | Yes | `https://xyz.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NODE_ENV` | Environment mode | No | `production` |
| `PORT` | Server port | No | `3001` |
| `CORS_ORIGIN` | Allowed frontend domains | No | `https://your-app.com` |
| `MAX_FILE_SIZE` | Max file upload size | No | `5242880` |
| `ALLOWED_FILE_TYPES` | Allowed file types | No | `image/jpeg,image/png` |

## Post-Deployment Checklist

1. **Test Health Endpoint**
   ```bash
   curl https://your-api-domain.com/health
   ```

2. **Test API Endpoints**
   ```bash
   # Test get items
   curl https://your-api-domain.com/api/items
   
   # Test create item
   curl -X POST https://your-api-domain.com/api/items \
     -H "Content-Type: application/json" \
     -d '{"type":"lost","name":"Test","description":"Test","location":"Test","image_url":"https://example.com/image.jpg","contact_info":"test@example.com"}'
   ```

3. **Update Frontend Configuration**
   - Update your frontend to use the new API URL
   - Test all functionality

4. **Monitor Logs**
   - Check application logs for any errors
   - Monitor performance and usage

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` includes your frontend domain
   - Check for trailing slashes in URLs

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check if RLS policies are correctly set

3. **File Upload Issues**
   - Verify storage bucket exists and is public
   - Check storage policies

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names

### Debug Commands

```bash
# Check environment variables
echo $SUPABASE_URL

# Test Supabase connection
curl -H "apikey: $SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
     "$SUPABASE_URL/rest/v1/items?select=*&limit=1"
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use platform-specific secret management

2. **API Keys**
   - Keep service role key secure
   - Use anon key for client-side operations

3. **CORS**
   - Only allow necessary domains
   - Avoid using `*` in production

4. **Rate Limiting**
   - Monitor rate limit settings
   - Adjust based on usage patterns

## Performance Optimization

1. **Database Indexes**
   - Ensure all necessary indexes are created
   - Monitor query performance

2. **Caching**
   - Consider adding Redis for caching
   - Implement response caching headers

3. **CDN**
   - Use CDN for static assets
   - Configure proper cache headers

## Monitoring and Logging

1. **Application Logs**
   - Monitor error logs
   - Set up alerting for critical errors

2. **Performance Monitoring**
   - Monitor response times
   - Track API usage

3. **Database Monitoring**
   - Monitor Supabase usage
   - Track query performance
