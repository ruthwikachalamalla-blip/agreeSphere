const router = require('express').Router(); const c = require('../controllers/cartController'); const { protect } = require('../middleware/auth');
router.use(protect); router.get('/', c.get); router.post('/', c.add); router.patch('/:productId', c.update); router.delete('/:productId', c.remove); module.exports = router;
