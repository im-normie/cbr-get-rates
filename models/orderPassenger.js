const Sequelize = require('sequelize');

class OrderPassenger extends Sequelize.Model {}

module.exports = sequelize => OrderPassenger.init(
    {
        order_id: Sequelize.INTEGER,
        name_first: Sequelize.STRING,
        name_second: Sequelize.STRING,
        date_insert: Sequelize.DATE
    },
    {
        sequelize,
        modelName: 'orderPassenger',
        tableName: 'order_passengers',
        timestamps: false
    }
);
