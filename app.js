const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const AppError = require('./utils/appError');
const appErrorHandler = require('./controllers/errorController');
const { rateLimit } = require('express-rate-limit');
// require('./utils/mongoCleaner');

const {
  IS_AWS_LAMBDA = false
} = process.env;

if( !IS_AWS_LAMBDA || IS_AWS_LAMBDA === "false" ) {
  require('./databases/redis');
}

const app = express();
// app.enable('trust proxy');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false,
})

app.use(limiter)

app.use(
  express.json({
    limit: '100mb',
  })
);

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl} on this server!!`, 404));
});

app.use(appErrorHandler);

module.exports = app;
