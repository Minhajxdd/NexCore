// Importing config Environment file
import dotenv from 'dotenv';
dotenv.config({path: "./config.env"});

// Require app
import app from './app.js';

// Variable for setting up the port
const PORT = process.env.PORT || 4000;

// to listen to the port
app.listen(PORT, () => { 
    console.log(`Server started at port http://localhost:${PORT}`);
})
