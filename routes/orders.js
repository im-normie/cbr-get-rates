const express = require('express');
const router = express.Router();

// GET orders
router.get('/', (req, res, next) => {
  const soapClient = req.app.get('soapClient');

  const rateArgs = {
    On_date: new Date().toISOString()
  };

  soapClient['GetCursOnDate'](rateArgs, (err, result) => {
    let rates;

    try {
      rates = result['GetCursOnDateResult']['diffgram']['ValuteData']['ValuteCursOnDate'];
    } catch (err) {
      res.send(err.toString());
      return;
    }

    const order = req.app.get('models.order');
    const orderPassenger = req.app.get('models.orderPassenger');

    order.findAll({
      include: [
        { model: orderPassenger, required: false}
      ]
    })
    .then(orders => {
      orders.forEach(order => {
        if (order.currency === 'RUB') {
          order.priceRub = order.price;
        } else {
          let rateData = rates.find(
            rateData => rateData['VchCode'] === order.currency
          );
          order.priceRub = order.price / rateData['Vnom'] * rateData['Vcurs'];
        }

        order.passengerCount = order.orderPassengers.length;
      });

      res.render('orders', { title: 'Заказы', orders });
    });
  });
});

module.exports = router;
