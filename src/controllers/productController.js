const Product = require('../models/Product');

// เพิ่ม console.log เพื่อ debug
console.log('Loading productController...');

// แก้ไขฟังก์ชัน getAllProducts
const getAllProducts = async (req, res) => {
    try {
        console.log('Getting all products...');
        // ดึงข้อมูลล่าสุดจากฐานข้อมูลทุกครั้ง
        const products = await Product.findAll({
            order: [['updatedAt', 'DESC']] // เรียงตามวันที่อัปเดตล่าสุด
        });
        
        console.log('Found products:', products.length);
        
        // ดึงข้อความแจ้งเตือน (ถ้ามี)
        const flashMessage = req.session.flashMessage;
        req.session.flashMessage = null; // เคลียร์ข้อความหลังจากใช้
        
        res.render('products/index', { 
            products,
            flashMessage,
            currentTime: Date.now() // เพิ่มเวลาปัจจุบันเพื่อป้องกัน cache
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send(`Error fetching products: ${error.message}`);
    }
};

// แสดงหน้าเพิ่มสินค้า
const showAddForm = (req, res) => {
    res.render('products/add');
};

// เพิ่มสินค้า
const createProduct = async (req, res) => {
    try {
        // ปรับชื่อฟิลด์ให้ตรงกับแบบฟอร์ม
        const { productId, productName, price, quantity } = req.body;
        
        // จัดการกับรูปภาพ
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.filename;
        }
        
        // สร้างสินค้าในฐานข้อมูล โดยปรับชื่อฟิลด์ให้ตรงกับโมเดล Product
        await Product.create({
            code: productId,
            name: productName, 
            price, 
            quantity, 
            image: imagePath
        });
        
        // กำหนดข้อความแจ้งเตือน
        req.session.flashMessage = 'เพิ่มสินค้าสำเร็จ';
        
        // เมื่อเพิ่มสำเร็จให้ redirect ไปยังหน้าแสดงสินค้าทั้งหมด
        return res.redirect('/products');
    } catch (error) {
        console.error('Error creating product:', error);
        // กรณีเกิดข้อผิดพลาด ส่งกลับไปแสดงข้อผิดพลาดที่หน้าเพิ่มสินค้า
        return res.render('products/add', { 
            error: error.message || 'เกิดข้อผิดพลาดในการเพิ่มสินค้า',
            formData: req.body // ส่งข้อมูลกลับไปเพื่อไม่ให้ผู้ใช้ต้องกรอกใหม่ทั้งหมด
        });
    }
};

// แสดงหน้าแก้ไขสินค้า
const showEditForm = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).render('error', { 
                message: 'ไม่พบสินค้าที่ต้องการแก้ไข',
                error: { status: 404 }
            });
        }
        
        res.render('products/edit', { product });
    } catch (error) {
        console.error('Error fetching product for edit:', error);
        res.status(500).render('error', { 
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า',
            error: error
        });
    }
};

// อัพเดทสินค้า
const updateProduct = async (req, res) => {
    try {
        console.log('Update product function called with ID:', req.params.id);
        console.log('Request body:', req.body);
        
        const { code, name, price, quantity } = req.body;
        
        // ค้นหาสินค้าที่จะอัพเดต
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            console.log('Product not found with ID:', req.params.id);
            return res.status(404).send('ไม่พบสินค้าที่ต้องการแก้ไข');
        }
        
        console.log('Found product:', product.toJSON());
        
        // เตรียมข้อมูลที่จะอัพเดต
        const updateData = { 
            code, 
            name, 
            price: parseFloat(price), // แปลงเป็น float เพื่อป้องกันปัญหา
            quantity: parseInt(quantity, 10) // แปลงเป็น integer
        };
        
        // ถ้ามีการอัพโหลดรูปภาพใหม่
        if (req.file) {
            updateData.image = req.file.filename;
            console.log('New image uploaded:', req.file.filename);
        }
        
        console.log('Updating product with data:', updateData);
        
        // อัพเดตข้อมูลสินค้า
        await product.update(updateData);
        console.log('Product updated successfully');
        
        // กำหนดข้อความสำเร็จและเปลี่ยนเส้นทางไปยังหน้าแสดงสินค้า
        req.session.flashMessage = 'อัพเดตสินค้าสำเร็จ';
        return res.redirect('/products');
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).send(`เกิดข้อผิดพลาดในการอัพเดตสินค้า: ${error.message}`);
    }
};

// ลบสินค้า
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        
        await product.destroy();
        res.redirect('/products');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};

// ค้นหาสินค้า
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { code: { [Op.like]: `%{query}%` } },
                    { name: { [Op.like]: `%{query}%` } }
                ]
            }
        });
        res.render('products/index', { products, query });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Error searching products', error: error.message });
    }
};

// Log ก่อน export เพื่อตรวจสอบ
console.log('Exporting productController functions:', {
    getAllProducts: !!getAllProducts,
    createProduct: !!createProduct,
    updateProduct: !!updateProduct,
    deleteProduct: !!deleteProduct,
    showAddForm: !!showAddForm,
    showEditForm: !!showEditForm,
    searchProducts: !!searchProducts
});

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    showAddForm,
    showEditForm,
    searchProducts
};