import express from 'express';
const app = express();

// Importing middlewares
import applyMiddlewares from './middleware.js';

applyMiddlewares(app);

app.set('view engine', 'ejs');

// Importing Routes
import Routes from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'

// Importin databse
import connectDB from './db.js';
connectDB();


// Sending routes
app.use('/admin', adminRouter);
app.use('/' , Routes);

export default app;