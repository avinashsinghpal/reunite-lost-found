import express from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { validateItem, validateItemUpdate } from '../middleware/validation.js';

const router = express.Router();

// POST /items - Create a new lost or found item
router.post('/', validateItem, async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      date_reported: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('items')
      .insert([itemData])
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create item',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: data
    });

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /items - List all items with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, location, search, page = 1, limit = 20 } = req.query;
    
    let query = supabase
      .from('items')
      .select('*')
      .order('date_reported', { ascending: false });

    // Apply filters
    if (type && ['lost', 'found'].includes(type)) {
      query = query.eq('type', type);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch items',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Items retrieved successfully',
      data: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || data.length
      }
    });

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /items/:id - Get a specific item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }
      console.error('Database query error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch item',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item retrieved successfully',
      data: data
    });

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// PUT /items/:id - Update an item (authenticated only)
router.put('/:id', validateItemUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if item exists
    const { data: existingItem, error: checkError } = await supabase
      .from('items')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Update the item
    const { data, error } = await supabaseAdmin
      .from('items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update item',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: data
    });

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// DELETE /items/:id - Delete an item (authenticated only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const { data: existingItem, error: checkError } = await supabase
      .from('items')
      .select('id, image_url')
      .eq('id', id)
      .single();

    if (checkError || !existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Delete the item
    const { error } = await supabaseAdmin
      .from('items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database delete error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete item',
        error: error.message
      });
    }

    // Note: You might want to also delete the image from storage
    // This would require extracting the filename from the image_url
    // and calling supabaseAdmin.storage.from('item-images').remove([filename])

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;
