const Sequelize = require('sequelize');

class Order extends Sequelize.Model {}

module.exports = sequelize => Order.init(
    {
        locator: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        price: Sequelize.DECIMAL(6, 2),
        currency: Sequelize.STRING,
        date_insert: Sequelize.DATE
    },
    {
        sequelize,
        modelName: 'order',
        timestamps: false
    }
);
