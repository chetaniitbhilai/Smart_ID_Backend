import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import the cors package
import connectToMongoDB from "./db/connectToMongoDB.js";
import userRoutes from "./routes/userRoute.js";
import courseRoutes from "./routes/courseRoute.js"
import attendanceRoutes from "./routes/attendanceRoute.js"
import complainRoutes from "./routes/complainRoutes.js"

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

dotenv.config(); // Load environment variables from .env file

// Debugging statement to ensure environment variables are loaded
console.log("MONGO_DB_URI:", process.env.MONGO_DB_URI);
console.log("PORT:", process.env.PORT);

const PORT = process.env.PORT || 5000; // Use port from env file, else default to 5000

const app = express(); // Creating a server
app.use(express.static('public')); 
// // Enable CORS for all routes
app.use(cors({
    origin: (origin, callback) => {
        // Allow localhost dev origins (3000-5199) and undefined (like Postman)
        if (!origin || /http:\/\/localhost:(3\d{3}|5(0|1)\d{2})$/.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

// Setting up middleware
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(cookieParser()); // Access cookies

// Setting up routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", userRoutes);
app.use("/course", courseRoutes);
app.use("/attendance", attendanceRoutes)
app.use("/complain", complainRoutes)

// Start the server and connect to MongoDB
app.listen(PORT, () => {
    connectToMongoDB(); // Connect to the MongoDB database
    console.log(`Listening on port ${PORT}`); // Log the port number
});