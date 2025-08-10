// API service for Lost & Found backend
const API_BASE_URL = 'http://localhost:3001/api';

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

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  console.log('🌐 Making API request:', {
    url,
    method: config.method || 'GET',
    headers: config.headers,
    body: config.body
  });

  try {
    const response = await fetch(url, config);
    console.log('✅ API response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const data = await response.json();
    console.log('📦 API response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ API request failed:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorType: error.constructor.name,
      url,
      config
    });
    throw error;
  }
}

// Items API
export const itemsApi = {
  // Get all items with optional filters
  async getItems(params?: {
    type?: 'lost' | 'found';
    location?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ItemsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.type) searchParams.append('type', params.type);
    if (params?.location) searchParams.append('location', params.location);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/items${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<ItemsResponse>(endpoint);
  },

  // Get a specific item by ID
  async getItem(id: string): Promise<ItemResponse> {
    return apiRequest<ItemResponse>(`/items/${id}`);
  },

  // Create a new item
  async createItem(itemData: CreateItemData): Promise<ItemResponse> {
    return apiRequest<ItemResponse>('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  // Update an item
  async updateItem(id: string, itemData: UpdateItemData): Promise<ItemResponse> {
    return apiRequest<ItemResponse>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  // Delete an item
  async deleteItem(id: string): Promise<ApiResponse<null>> {
    return apiRequest<ApiResponse<null>>(`/items/${id}`, {
      method: 'DELETE',
    });
  },
};

// Upload API
export const uploadApi = {
  // Upload an image file
  async uploadImage(file: File): Promise<UploadResponse> {
    console.log('📤 Starting image upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const formData = new FormData();
    formData.append('image', file);

    const url = `${API_BASE_URL}/upload`;
    
    try {
      console.log('🌐 Uploading to:', url);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      console.log('✅ Upload response received:', {
        status: response.status,
        statusText: response.statusText
      });

      const data = await response.json();
      console.log('📦 Upload response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Upload failed:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorType: error.constructor.name,
        url
      });
      throw error;
    }
  },
};

// Health check
export const healthApi = {
  async checkHealth(): Promise<ApiResponse<{
    timestamp: string;
    environment: string;
  }>> {
    const url = API_BASE_URL.replace('/api', '/health');
    
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

export default {
  items: itemsApi,
  upload: uploadApi,
  health: healthApi,
};
