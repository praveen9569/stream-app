import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'; // Adjust the path as necessary
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import { protectRoute } from './middleware/auth.middleware.js';
import userRoutes from './routes/user.route.js'; 
import chatRoutes from './routes/chat.route.js'; // Adjust the path as necessary
import { generateStreamToken } from './lib/stream.js'; // Ensure this import is correct
import cors from 'cors';

dotenv.config(); // Loads from .env




const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
 // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes); // Adjust the path as necessary
app.use("/api/chat",chatRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
