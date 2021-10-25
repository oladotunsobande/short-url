import express from 'express';
import * as Validators from '../validators/link';
import * as Controllers from '../controllers/link';
import * as CacheMiddleware from '../middleware/cache';

const router = express.Router();

// Encode URL
router.post(
  '/encode',
  Validators.validateLinkEncode,
  CacheMiddleware.cache,
  Controllers.encodeURL,
);

// Decode URL
router.post(
  '/decode',
  Validators.validateLinkDecode,
  CacheMiddleware.cache,
  Controllers.decodeURL,
);

// Get token details
router.get(
  '/statistics/:token',
  Validators.validateGetTokenDetails,
  Controllers.getTokenDetails,
);

export default router;