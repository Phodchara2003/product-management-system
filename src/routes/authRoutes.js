const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Debug: ตรวจสอบว่า controller มีฟังก์ชันที่เรียกใช้หรือไม่
console.log('authController functions:', {
    showLogin: typeof authController.showLogin,
    showRegister: typeof authController.showRegister,
    login: typeof authController.login,
    register: typeof authController.register
});

// เส้นทางสำหรับแสดงหน้า
router.get('/login', function(req, res) {
    if (typeof authController.showLogin === 'function') {
        authController.showLogin(req, res);
    } else {
        res.send('showLogin function is not available');
    }
});
router.get('/register', function(req, res) {
    if (typeof authController.showRegister === 'function') {
        authController.showRegister(req, res);
    } else {
        res.send('showRegister function is not available');
    }
});

// เส้นทางสำหรับการส่งข้อมูล
router.post('/login', function(req, res) {
    if (typeof authController.login === 'function') {
        authController.login(req, res);
    } else {
        res.status(500).send('login function is not available');
    }
});
router.post('/register', function(req, res) {
    if (typeof authController.register === 'function') {
        authController.register(req, res);
    } else {
        res.status(500).send('register function is not available');
    }
});

module.exports = router;