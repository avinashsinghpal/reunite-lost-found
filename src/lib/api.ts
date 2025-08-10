// API service for Lost & Found using Supabase directly
// DEPLOYMENT FIX: This file now uses Supabase instead of localhost API
import { supabase, TABLES } from './supabase'

export interface Item {
  id: string;
  type: 'lost' | 'found';
  name: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  date_reported: string;
  image_url: string;
  contact_info: string;
}

export interface CreateItemData {
  type: 'lost' | 'found';
  name: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image_url: string;
  contact_info: string;
}

export interface UpdateItemData {
  type?: 'lost' | 'found';
  name?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  contact_info?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface ItemsResponse extends ApiResponse<Item[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ItemResponse extends ApiResponse<Item> {}

export interface UploadResponse extends ApiResponse<{
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}> {}

// Helper function to convert Supabase response to our API format
function createApiResponse<T>(data: T, message: string = 'Success'): ApiResponse<T> {
  return {
    success: true,
    message,
    data
  }
}

function createErrorResponse(message: string, errors?: string[]): ApiResponse<any> {
  return {
    success: false,
    message,
    data: null as any,
    errors
  }
}

// Items API using Supabase
export const itemsApi = {
  // Get all items with optional filters
  async getItems(params?: {
    type?: 'lost' | 'found';
    location?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ItemsResponse> {
    try {
      console.log('🔍 Fetching items with params:', params);
      
      let query = supabase
        .from(TABLES.ITEMS)
        .select('*')
        .order('date_reported', { ascending: false });

      // Apply filters
      if (params?.type) {
        query = query.eq('type', params.type);
      }
      
      if (params?.location) {
        query = query.ilike('location', `%${params.location}%`);
      }
      
      if (params?.search) {
        query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }

      // Apply pagination
      if (params?.page && params?.limit) {
        const from = (params.page - 1) * params.limit;
        const to = from + params.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Error fetching items:', error);
        throw new Error(error.message);
      }

      console.log('✅ Items fetched successfully:', { count: data?.length });
      
      return createApiResponse(data || [], 'Items fetched successfully');
    } catch (error) {
      console.error('❌ Failed to fetch items:', error);
      throw error;
    }
  },

  // Get a specific item by ID
  async getItem(id: string): Promise<ItemResponse> {
    try {
      console.log('🔍 Fetching item:', id);
      
      const { data, error } = await supabase
        .from(TABLES.ITEMS)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching item:', error);
        throw new Error(error.message);
      }

      console.log('✅ Item fetched successfully:', data);
      return createApiResponse(data, 'Item fetched successfully');
    } catch (error) {
      console.error('❌ Failed to fetch item:', error);
      throw error;
    }
  },

  // Create a new item
  async createItem(itemData: CreateItemData): Promise<ItemResponse> {
    try {
      console.log('📝 Creating new item:', itemData);
      
      // Add timestamp
      const itemWithTimestamp = {
        ...itemData,
        date_reported: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(TABLES.ITEMS)
        .insert([itemWithTimestamp])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating item:', error);
        throw new Error(error.message);
      }

      console.log('✅ Item created successfully:', data);
      return createApiResponse(data, 'Item created successfully');
    } catch (error) {
      console.error('❌ Failed to create item:', error);
      throw error;
    }
  },

  // Update an item
  async updateItem(id: string, itemData: UpdateItemData): Promise<ItemResponse> {
    try {
      console.log('✏️ Updating item:', id, itemData);
      
      const { data, error } = await supabase
        .from(TABLES.ITEMS)
        .update(itemData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating item:', error);
        throw new Error(error.message);
      }

      console.log('✅ Item updated successfully:', data);
      return createApiResponse(data, 'Item updated successfully');
    } catch (error) {
      console.error('❌ Failed to update item:', error);
      throw error;
    }
  },

  // Delete an item
  async deleteItem(id: string): Promise<ApiResponse<null>> {
    try {
      console.log('🗑️ Deleting item:', id);
      
      const { error } = await supabase
        .from(TABLES.ITEMS)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting item:', error);
        throw new Error(error.message);
      }

      console.log('✅ Item deleted successfully');
      return createApiResponse(null, 'Item deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete item:', error);
      throw error;
    }
  },
};

// Upload API using Supabase Storage
export const uploadApi = {
  // Upload an image file to Supabase Storage
  async uploadImage(file: File): Promise<UploadResponse> {
    try {
      console.log('📤 Starting image upload to Supabase:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${TABLES.STORAGE}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(TABLES.STORAGE)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Storage upload error:', error);
        throw new Error(error.message);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(TABLES.STORAGE)
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;

      console.log('✅ Image uploaded successfully:', {
        fileName,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type
      });

      return createApiResponse({
        fileName,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type
      }, 'Image uploaded successfully');

    } catch (error) {
      console.error('❌ Upload failed:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorType: error.constructor.name
      });
      throw error;
    }
  },
};

// Health check using Supabase
export const healthApi = {
  async checkHealth(): Promise<ApiResponse<{
    timestamp: string;
    environment: string;
    supabaseStatus: string;
  }>> {
    try {
      console.log('🏥 Checking Supabase health...');
      
      // Test Supabase connection by making a simple query
      const { data, error } = await supabase
        .from(TABLES.ITEMS)
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.error('❌ Supabase health check failed:', error);
        throw new Error(error.message);
      }

      const healthData = {
        timestamp: new Date().toISOString(),
        environment: 'production',
        supabaseStatus: 'connected'
      };

      console.log('✅ Health check passed:', healthData);
      return createApiResponse(healthData, 'Service is healthy');
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  },
};

export default {
  items: itemsApi,
  upload: uploadApi,
  health: healthApi,
};
