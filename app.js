const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const soap = require('soap');

const Sequelize = require('sequelize');
const Order = require('./models/order');
const OrderPassenger = require('./models/orderPassenger');

const sequelize = new Sequelize('mysql://root@localhost:3306/orders');

const order = Order(sequelize);
const orderPassenger = OrderPassenger(sequelize);
order.hasMany(orderPassenger, { foreignKey: 'order_id' });

const indexRouter = require('./routes/index');
const ordersRouter = require('./routes/orders');
const orderRouter = require('./routes/order');

const app = express();

app.set('sequelize', sequelize);
app.set('models.order', order);
app.set('models.orderPassenger', orderPassenger);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/orders', ordersRouter);
app.use('/order', orderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const cbrUrl = 'http://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL';

soap.createClient(cbrUrl, (err, client) => {
  app.set('soapClient', client);
});

module.exports = app;
