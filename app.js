import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

// Importing Routes
import Routes from './routes/userRoute.js'
import connectDB from './db.js';

app.set('view engine', 'ejs');

connectDB();
app.use(cookieParser())

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.use('/' , Routes);

export default app;