const router = require('express').Router(); const c = require('../controllers/orderController'); const { protect, authorize } = require('../middleware/auth');
router.use(protect); router.get('/', c.list); router.post('/', authorize('customer'), c.create); router.patch('/:id/status', authorize('seller', 'admin'), c.updateStatus); module.exports = router;
