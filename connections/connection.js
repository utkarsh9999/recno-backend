const { Sequelize, DataTypes } = require('sequelize');
//mysql connection to DB
const sequelize = new Sequelize('Itsm', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',  // Change to 'postgres', 'sqlite', etc. based on your database
    logging: false  // Set to true for verbose logging
});

// Test the connection
sequelize.authenticate().then(() =>
    console.log('Database connected...')
).catch(err =>
    console.error('Connection error:', err)
);
//Mysql User Model->
const User = sequelize.define('User', {
    // Define attributes/fields
    firstName: {
        type: DataTypes.STRING,
        allowNull: false  // The field is required
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Email must be unique
        validate: {
            isEmail: true  // Sequelize built-in validation for email format
        }
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt timestamps
});
//check
sequelize.sync().then(() =>
    console.log('User table has been created')).catch(err =>
    console.error('Error syncing database:', err)
);
module.exports=User;
module.exports=sequelize;