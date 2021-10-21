import express from 'express';
import * as Validators from '../validators/link';
import * as Controllers from '../controllers/link';
import * as CacheMiddleware from '../middleware/cache';

const router = express.Router();

// Encode URL
router.post(
  '/encode',
  Validators.validateLinkEncodeDecode,
  CacheMiddleware.cache,
  Controllers.encodeURL,
);

// Decode URL
router.post(
  '/decode/:token',
  Validators.validateLinkDecode,
  CacheMiddleware.cache,
  Controllers.decodeURL,
);

export default router;