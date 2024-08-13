import mongoose from 'mongoose'; 

async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost/NexCore');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}


export default connectDB;
