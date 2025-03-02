const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../controllers/productController');

// สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
const uploadDir = path.join(__dirname, '../../public/uploads/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads directory');
}

// กำหนดการตั้งค่า Multer สำหรับอัพโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Debug ก่อนเพื่อตรวจสอบฟังก์ชัน
console.log('productController functions:', {
    getAllProducts: typeof productController.getAllProducts,
    createProduct: typeof productController.createProduct,
    updateProduct: typeof productController.updateProduct,
    deleteProduct: typeof productController.deleteProduct,
    showAddForm: typeof productController.showAddForm,
    showEditForm: typeof productController.showEditForm,
    searchProducts: typeof productController.searchProducts
});

// ปรับเปลี่ยนเส้นทางให้มีการตรวจสอบฟังก์ชันก่อนเรียกใช้
// GET routes
router.get('/', function(req, res) {
    if (typeof productController.getAllProducts === 'function') {
        productController.getAllProducts(req, res);
    } else {
        res.status(500).send('getAllProducts function is not available');
    }
});

router.get('/add', function(req, res) {
    if (typeof productController.showAddForm === 'function') {
        productController.showAddForm(req, res);
    } else {
        res.status(500).send('showAddForm function is not available');
    }
});

router.get('/edit/:id', function(req, res) {
    if (typeof productController.showEditForm === 'function') {
        productController.showEditForm(req, res);
    } else {
        res.status(500).send('showEditForm function is not available');
    }
});

router.get('/search', function(req, res) {
    if (typeof productController.searchProducts === 'function') {
        productController.searchProducts(req, res);
    } else {
        res.status(500).send('searchProducts function is not available');
    }
});

// POST routes
router.post('/add', upload.single('image'), function(req, res) {
    if (typeof productController.createProduct === 'function') {
        productController.createProduct(req, res);
    } else {
        res.status(500).send('createProduct function is not available');
    }
});

// เส้นทางแก้ไขสินค้า
router.post('/edit/:id', upload.single('image'), (req, res) => {
    console.log('Route for edit product triggered with ID:', req.params.id);
    if (typeof productController.updateProduct === 'function') {
        productController.updateProduct(req, res);
    } else {
        console.error('updateProduct function is not available');
        res.status(500).send('updateProduct function is not available');
    }
});

router.post('/delete/:id', function(req, res) {
    if (typeof productController.deleteProduct === 'function') {
        productController.deleteProduct(req, res);
    } else {
        res.status(500).send('deleteProduct function is not available');
    }
});

module.exports = router;