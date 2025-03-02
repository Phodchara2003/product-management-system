const { Sequelize, DataTypes } = require('sequelize');

// แก้ไขรหัสผ่านเป็น 12345678 ตามที่ตั้งค่าไว้
const sequelize = new Sequelize('product_management', 'root', '12345678', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true
    },
    // เพิ่ม option นี้เพื่อหลีกเลี่ยงปัญหาการเชื่อมต่อ
    dialectOptions: {
        ssl: false
    }
});

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
        
        // ตั้งค่า alter เป็น true เพื่ออัปเดตโครงสร้างตารางอัตโนมัติ
        await sequelize.sync({ alter: true });
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error; // โยน error เพื่อให้แอปหยุดทำงานหากไม่สามารถเชื่อมต่อได้
    }
};

module.exports = {
    sequelize,
    DataTypes,
    connectToDatabase
};