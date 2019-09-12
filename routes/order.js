const express = require('express');
const router = express.Router();

// GET order/*
router.get('/:locator', (req, res, next) => {
  const order = req.app.get('models.order');
  const orderPassenger = req.app.get('models.orderPassenger');

  order.findOne({
    where: {
      locator: req.params.locator
    },
    include: [
      { model: orderPassenger, required: false}
    ]
  })
  .then(order => {
    res.render('order', {title: 'Пассажиры', order});
  });
});

module.exports = router;
