import express from 'express';
const app = express();

// Importing Routes
import Routes from './routes/userRoute.js'

app.set('view engine', 'ejs');

app.use(express.static('public'));




app.use('/' , Routes);

export default app;