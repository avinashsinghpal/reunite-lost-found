import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

// Validation schemas
export const itemSchema = Joi.object({
  type: Joi.string().valid('lost', 'found').required(),
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(1000).required(),
  location: Joi.string().min(1).max(200).required(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  image_url: Joi.string().uri().optional().allow(''),
  contact_info: Joi.string().min(1).max(200).required()
});

export const itemUpdateSchema = Joi.object({
  type: Joi.string().valid('lost', 'found').optional(),
  name: Joi.string().min(1).max(100).optional(),
  description: Joi.string().min(1).max(1000).optional(),
  location: Joi.string().min(1).max(200).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  image_url: Joi.string().uri().optional(),
  contact_info: Joi.string().min(1).max(200).optional()
});

// Sanitization function
export const sanitizeInput = (data) => {
  if (typeof data === 'string') {
    return sanitizeHtml(data, {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {}
        }).trim();
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
  
  return data;
};

// Validation middleware
export const validateItem = (req, res, next) => {
  const { error, value } = itemSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  // Sanitize the validated data
  req.body = sanitizeInput(value);
  next();
};

export const validateItemUpdate = (req, res, next) => {
  const { error, value } = itemUpdateSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  // Sanitize the validated data
  req.body = sanitizeInput(value);
  next();
};
