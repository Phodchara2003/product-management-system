const Admin = require('../models/Admin');

// เพิ่ม console.log เพื่อ debug
console.log('Loading authController...');

// ตรวจสอบว่าฟังก์ชันทุกตัวถูกประกาศก่อน export
const login = async (req, res) => {
    console.log('Login function called');
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ where: { username } });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Store user in session
        req.session.user = admin;
        req.session.isAuthenticated = true;
        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

const register = async (req, res) => {
    console.log('Register function called');
    const { username, password, address, email, phone } = req.body;
    try {
        const newAdmin = await Admin.create({ 
            username, 
            password, 
            address, 
            email, 
            phone 
        });
        
        // เปลี่ยนการตอบกลับเป็น redirect ไปหน้า login
        req.session.flashMessage = 'ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ';
        return res.redirect('/auth/login');
        
        // ถ้าต้องการให้แสดงข้อความสำเร็จก่อน สามารถใช้ flash messages ได้
        // แต่ต้องติดตั้ง express-flash หรือทำการจัดการ session ด้วยตัวเอง
    } catch (error) {
        console.error('Registration error:', error);
        // กรณีเกิดข้อผิดพลาด ให้กลับไปที่หน้าลงทะเบียน พร้อมแสดงข้อความผิดพลาด
        return res.render('auth/register', { 
            error: error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน',
            formData: req.body // ส่งข้อมูลกลับไปเพื่อให้ผู้ใช้ไม่ต้องกรอกใหม่ทั้งหมด
        });
    }
};

// แสดงหน้า Login
const showLogin = (req, res) => {
    console.log('ShowLogin function called');
    const flashMessage = req.session.flashMessage;
    req.session.flashMessage = null; // เคลียร์ message หลังจากใช้งานแล้ว
    res.render('auth/login', { flashMessage });
};

// แสดงหน้า Register
const showRegister = (req, res) => {
    console.log('ShowRegister function called');
    res.render('auth/register');
};

// Log ก่อน export เพื่อตรวจสอบ
console.log('Exporting functions:', {
    login: !!login,
    register: !!register,
    showLogin: !!showLogin,
    showRegister: !!showRegister
});

module.exports = {
    login,
    register,
    showLogin,
    showRegister
};