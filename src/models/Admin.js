const { sequelize, DataTypes } = require('../config/database');

const Admin = sequelize.define('Admin', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    // หลีกเลี่ยงการใช้ options.define ที่อาจทำให้เกิดข้อผิดพลาด
    tableName: 'admins'
});

module.exports = Admin;