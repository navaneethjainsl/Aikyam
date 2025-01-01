import express from 'express';
import fileUpload from 'express-fileupload';

// import mongodb from 'mongodb';
// import {MongoClient} from "mongodb";
import mongoose from "mongoose";

import connectToMongo from "./db.js"
connectToMongo()

// import ejs from "ejs";
import lodash from "lodash";
import bodyParser from "body-parser";
import dotenv from 'dotenv/config';
import fs from 'fs';

// import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import { Strategy } from 'passport-local';
import cookieParser from 'cookie-parser';

import axios from "axios";
import cors from "cors";

import { PdfReader } from "pdfreader";

// import {authenticate} from '@google-cloud/local-auth';
// import {google} from 'googleapis';


// dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload());

app.use(express.json());

app.use(cors({
	origin: 'http://localhost:3000', // allow to server to accept request from different origin
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true // allow session cookie from browser to pass through
}));
app.use((req, res, next) => {
	// access-control-allow-origin http://localhost:5173
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});
app.use(cookieParser());
// app.use(cors());

app.use(session({
	secret: "aikyam",
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		maxAge: 24 * 60 * 60 * 1000
	}
}));

app.use(passport.initialize());
app.use(passport.session());

import auth from "./routes/auth.js";
import user from "./routes/user.js";
app.use('/api/auth', auth);
app.use('/api/user', user);

////////////////////////////////////////////////////NJ////////////////////////////////////////////////////

// Logging middleware for debugging purposes
app.use((req, res, next) => {
	console.log(`Received ${req.method} request for '${req.url}' - Body: ${JSON.stringify(req.body)}`);
	next();
});
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
//   });

//   // Example of middleware
// app.use((req, res, next) => {
//     const token = req.headers['auth-token'];
//     if (token !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc3MjZiN2JhYzVkNTZmZGU4ZmU3NTg0In0sImlhdCI6MTczNTU1MjAyNn0.zFlTytrlDTuy1g5OtGqvKL4p7fZeHriqI5GZQZHQT3Y') {
//       return res.status(403).json({ success: false, message: 'Forbidden' });
//     }
//     next(); // Continue to the actual route handler
//   });

// Endpoint to handle wake word detection
// app.post('/api/wake-word', (req, res) => {
//     const { transcript } = req.body;

//     if (transcript && transcript.toLowerCase().includes('jarvis')) {
//         console.log('Wake word "Jarvis" detected');
//         // Perform your action here (e.g., trigger an event, send a notification, etc.)
//         res.status(200).json({ message: 'Wake word detected', action: 'Performing action...' });
//     } else {
//         res.status(400).json({ message: 'Wake word not detected' });
//     }
// });



////////////////////////////////////////////////////Chinmayi////////////////////////////////////////////////////



////////////////////////////////////////////////////Chaithra////////////////////////////////////////////////////



////////////////////////////////////////////////////Amrutha////////////////////////////////////////////////////

// jobs
// app.get('/api/jobs', (req, res) => {
//     const userRole = req.headers['user-role']; // Example of role-based access
//     if (userRole !== 'admin') {
//       return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
//     }
//     res.json({ success: true, message: [{ title: 'Job 1', company: 'Company A' }] });
//   });
//   app.post('/api/apply-job', (req, res) => {
//     const { jobId } = req.body;
//     if (!jobId) {
//       return res.status(400).json({ success: false, message: 'Job ID is required' });
//     }
//     // Proceed with application logic...
//   });

// signup
// app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Adjust for your frontend URL

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/aikyam', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.log(err));

// // POST route for user signup
// app.post('/api/auth/signup', async (req, res) => {
//   const { name, username, password } = req.body;

//   // Check if all fields are provided
//   if (!name || !username || !password) {
//     return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
//   }

//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: 'User already exists.' });
//     }

//     // Hash the password before saving it
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user and save to the database
//     const newUser = new User({
//       name,
//       username,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     // Create a JWT token for the user
//     const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

//     // Set the token as a cookie
//     res.cookie('authToken', token, {
//       httpOnly: true,
//       secure: false, // Use 'true' in production if using https
//       maxAge: 3600000, // 1 hour expiration
//     });

//     res.json({ success: true, message: 'Registration successful!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
//   }
// });

// // signin
// // POST route for user login
// app.post('/api/auth/login', async (req, res) => {
//   console.log("login 2")
//   const { username, password } = req.body;

//   // Check if both fields are provided
//   if (!username || !password) {
//     return res.status(400).json({ success: false, message: 'Please provide both username and password.' });
//   }

//   try {
//     // Find the user in the database by username
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ success: false, message: 'User not found.' });
//     }

//     // Compare the provided password with the stored hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: 'Invalid password.' });
//     }

//     // Create a JWT token for the user
//     const token = jwt.sign({ userId: user._id }, 'aikyam', { expiresIn: '1h' });

//     // Set the token as a cookie
//     res.cookie('authToken', token, {
//       httpOnly: true,
//       secure: false, // Set to 'true' in production if using https
//       maxAge: 3600000, // 1 hour expiration
//     });

//     res.json({ success: true, message: 'Login successful!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
//   }
// });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});