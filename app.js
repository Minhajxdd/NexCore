import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();

// Importing Routes
import Routes from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'

// Importin databse
import connectDB from './db.js';

app.set('view engine', 'ejs');

connectDB();
app.use(cookieParser())

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

// Session Middleware
app.use(session({
    secret: 'Secret Key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/NexCore' }), 
    cookie: { maxAge: 60000 * 60 * 3},
    
}));

app.use('/' , Routes);
app.use('/admin', adminRouter);

export default app;